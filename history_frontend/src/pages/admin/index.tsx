import { networkInterfaces } from 'os';
import React, { FunctionComponent, useEffect } from 'react';
import FancyButton from '../../components/custom/FancyButton';
import NextEuiButton from '../../components/next_eui/button';
import {
  authOnlyProps,
  contextAuth,
  handleUserResponseRefresh,
  useAuth,
} from '../../lib/auth';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AdminNav from '../../components/custom/Admin/AdminNav';
import articleAPI, { IArticlePreview } from '../../api/article';
import { SortableProperties } from '@elastic/eui';
import Link from 'next/link';
import CustomButton from '../../components/custom/CustomButton';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AdminArticlePreview from '../../components/custom/AdminArticlePreview';
import { useQuery } from 'react-query';
import Spinner from './../../components/custom/Spinner/index';

interface indexProps {
  articles: IArticlePreview[];
}

const Page = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const Column = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: calc((100vw - 1000px) / 2);
`;

const Middle = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const ArticlePreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Admin: FunctionComponent<indexProps> = ({ articles = [] }) => {
  const { status, data, error, isFetching } = useQuery('previews', async () => {
    return await articleAPI.fetchAdminArticlePreviews('');
  });
  console.log(error);

  const { user } = useAuth();
  const router = useRouter();
  console.log(articles);
  const handleNewArticle = () => {
    router.push('/admin/article/new');
  };

  return (
    <Page>
      <Column>
        <AdminNav path="/" />
      </Column>
      <Middle>
        {/* {JSON.stringify({ status, data, error, isFetching })} */}
        {/* {JSON.stringify({ status, isFetching })} */}
        {/* <p>Admin</p>
        <p>{JSON.stringify(user)}</p>
        <FancyButton onClick={handleNewArticle}>Új cikk</FancyButton> */}
        {/* <ArticlePreviewContainer>
          {[...Array(10)].map((item, index) => (
            <AdminArticlePreview key={index} loading={true} />
          ))}
        </ArticlePreviewContainer> */}
        {status === 'loading' ? (
          // <Spinner />
          <ArticlePreviewContainer>
            {[...Array(10)].map((item, index) => (
              <AdminArticlePreview key={index} loading={true} />
            ))}
          </ArticlePreviewContainer>
        ) : (
          <ArticlePreviewContainer>
            {data.map(article => (
              <AdminArticlePreview
                article={article}
                href={`/admin/article/edit/${article.id}`}
                key={article.id}
              />
            ))}
          </ArticlePreviewContainer>
        )}
      </Middle>
      <Column>
        <Link href="/admin/article/new">
          <CustomButton color="primary" icon="new">
            Új cikk
          </CustomButton>
        </Link>
      </Column>
    </Page>
  );
};

// export const getServerSideProps = async context => {
//   const notLoggedIn = contextAuth(context);
//   console.log(notLoggedIn);
//   if (!notLoggedIn.token) return notLoggedIn;

//   const articles = await articleAPI.fetchAdminArticlePreviews(
//     notLoggedIn.token
//   );
//   return {
//     props: {
//       articles,
//     },
//   };
// };

// export const getServerSideProps = context => {
//   const notLoggedIn = contextAuth(context);
//   if (!notLoggedIn.token) return notLoggedIn;

//   return {
//     props: {},
//   };
// };

export default Admin;
