import { networkInterfaces } from 'os';
import React, { FunctionComponent, useEffect, useState } from 'react';
import FancyButton from '../../components/custom/FancyButton';
import NextEuiButton from '../../components/next_eui/button';
import { authOnlyProps, contextAuth, useAuth } from '../../lib/auth';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AdminNav from '../../components/custom/Admin/AdminNav';
import articleAPI, { IArticlePreview, ISearchOutput } from '../../api/article';
import { SortableProperties } from '@elastic/eui';
//import Link from 'next/link';
import CustomButton from '../../components/custom/CustomButton';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AdminArticlePreview from '../../components/custom/AdminArticlePreview';
import { useQuery } from 'react-query';
import Spinner from './../../components/custom/Spinner/index';
import { EuiPagination } from '@elastic/eui';
import Search from '../../components/custom/Search';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AdminIndex from '../../components/custom/Admin/AdminIndex';
import AdminUsers from '../../components/custom/Admin/AdminUsers';
import NewArticle from '../../components/custom/Admin/NewArticle';
import EditArticle from '../../components/custom/Admin/EditArticle';
import ProtectedRoute from './../../components/custom/ProtectedRoute/index';
import Login from '../../components/custom/Admin/login';
import Register from '../../components/custom/Admin/register';

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
  if (typeof window === 'undefined') return null;
  return (
    <Router basename="/admin">
      <Switch>
        <ProtectedRoute path={['', '/']} exact>
          <AdminIndex />
        </ProtectedRoute>

        <ProtectedRoute path="/article/new">
          <NewArticle />
        </ProtectedRoute>
        <ProtectedRoute path="/article/edit/:id">
          <EditArticle />
        </ProtectedRoute>
        <ProtectedRoute path="/users">
          <AdminUsers />
        </ProtectedRoute>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </Router>
  );
  // const { status, data, error, isFetching } = useQuery('previews', async () => {
  //   return await articleAPI.fetchAdminArticlePreviews('');
  // });
  // const [items, setItems] = useState<IArticlePreview[]>([]);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [pageSize, setPageSize] = useState(1);
  // const [totalCount, setTotalCount] = useState(0);
  // const [search, setSearch] = useState<ISearchOutput>({ query: '' });

  // const query = useQuery(
  //   ['articlepreviews', { pageNumber, pageSize }],
  //   async params => {
  //     const data = await articleAPI.fetchAdminArticlePreviewsSearch(
  //       pageNumber,
  //       pageSize,
  //       search
  //     );
  //     setItems(data.articles);
  //     setPageNumber(data.pageNumber);
  //     setTotalCount(data.totalCount);
  //     setPageSize(pageSize);
  //     return data;
  //   }
  // );

  // const goToPage = (page: number) => {
  //   setPageNumber(page + 1);
  // };

  // const { user } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   query.refetch();
  // }, [search]);

  // useEffect(() => {
  //   if (query.error) {
  //     router.push('/login');
  //   }
  // }, [query.error]);

  // const handleNewArticle = () => {
  //   router.push('/admin/article/new');
  // };

  // const onSearch = async (data: ISearchOutput) => {
  //   await setSearch(data);
  // };

  // return (
  //   <Page>
  //     <Column>
  //       <AdminNav path="/" />
  //     </Column>
  //     <Middle>
  //       {/* {JSON.stringify({ status, data, error, isFetching })} */}
  //       {/* {JSON.stringify({ status, isFetching })} */}
  //       {/* <p>Admin</p>
  //       <p>{JSON.stringify(user)}</p>
  //       <FancyButton onClick={handleNewArticle}>Új cikk</FancyButton> */}
  //       {/* <ArticlePreviewContainer>
  //         {[...Array(10)].map((item, index) => (
  //           <AdminArticlePreview key={index} loading={true} />
  //         ))}
  //       </ArticlePreviewContainer> */}
  //       <Search onSearch={onSearch} />
  //       {query.status === 'loading' ? (
  //         // <Spinner />
  //         <ArticlePreviewContainer>
  //           {[...Array(pageSize)].map((item, index) => (
  //             <AdminArticlePreview key={index} loading={true} />
  //           ))}
  //         </ArticlePreviewContainer>
  //       ) : (
  //         <ArticlePreviewContainer>
  //           {items?.map(article => (
  //             <AdminArticlePreview
  //               article={article}
  //               href={`/admin/article/edit/${article.id}`}
  //               key={article.id}
  //             />
  //           ))}
  //           <EuiPagination
  //             pageCount={Math.ceil(totalCount / pageSize)}
  //             activePage={pageNumber - 1}
  //             onPageClick={activePage => goToPage(activePage)}
  //           />
  //         </ArticlePreviewContainer>
  //       )}
  //     </Middle>
  //     <Column>
  //       <Link href="/admin/article/new">
  //         <CustomButton color="primary" icon="new">
  //           Új cikk
  //         </CustomButton>
  //       </Link>
  //     </Column>
  //   </Page>
  // );
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
