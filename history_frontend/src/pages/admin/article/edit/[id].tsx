import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { contextAuth } from '../../../../lib/auth';
import articleAPI, { IArticle } from '../../../../api/article';
import Editor from '../../../../components/layouts/AdminLayout';
import ArticleEditor, {
  IArticleOutput,
} from '../../../../components/custom/ArticleEditor/ArticleEditor';
import CustomButton from '../../../../components/custom/CustomButton';
import AdminLayout from '../../../../components/layouts/AdminLayout';
import useSWR from 'swr';
import { useQuery } from 'react-query';
import Spinner from '../../../../components/custom/Spinner';

interface ArticleEditProps {
  article: IArticle;
  id: string;
}

const ArticleEdit: FunctionComponent<ArticleEditProps> = ({ id }) => {
  const router = useRouter();
  const { status, data, error, isFetching } = useQuery(
    'article-edit',
    async () => {
      return await articleAPI.fetchById(id, '');
    },
    { refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (error) {
      router.push('/login');
    }
  }, [error]);
  //console.log(article);
  const onSubmit = async (output: IArticleOutput) => {
    try {
      await articleAPI.update(id, output);
      router.push('/admin');
    } catch (error) {}
  };
  return (
    <AdminLayout
      path="edit"
      rightColumn={
        <CustomButton color="primary" form="article-form" icon="save">
          Mentés
        </CustomButton>
      }>
      {status === 'loading' ? (
        <Spinner />
      ) : (
        <ArticleEditor
          formId="article-form"
          handleArticleSubmit={onSubmit}
          defaultValues={data}
        />
      )}
    </AdminLayout>
  );
};

export const getServerSideProps = async context => {
  const notLoggedIn = contextAuth(context);
  console.log(notLoggedIn);
  if (!notLoggedIn.token) return notLoggedIn;

  const { id } = context.query;
  if (!id) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }
  return {
    props: {
      id,
    },
  };
};

// export const getServerSideProps = async context => {
//   const notLoggedIn = contextAuth(context);
//   console.log(notLoggedIn);
//   if (!notLoggedIn.token) return notLoggedIn;

//   const { id } = context.query;
//   if (!id) {
//     return {
//       redirect: {
//         destination: '/404',
//         permanent: false,
//       },
//     };
//   }

//   const article = await articleAPI.fetchById(id, notLoggedIn.token);
//   console.log(id);
//   return {
//     props: {
//       article,
//       id,
//     },
//   };

//   return {
//     props: {},
//   };
//   // const articles = await articleAPI.fetchAdminArticlePreviews(
//   //   notLoggedIn.token
//   // );
//   // return {
//   //   props: {
//   //     articles,
//   //   },
//   // };
// };

export default ArticleEdit;
