import { EuiPagination } from '@elastic/eui';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import articleAPI, {
  IArticlePreview,
  ISearchOutput,
} from '../../../api/article';
import AdminArticlePreview from '../AdminArticlePreview';
import CustomButton from '../CustomButton';
import AdminNav from './AdminNav';
import AdminSearch from '../AdminSearch';

interface AdminIndexProps {}

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

const AdminIndex: FunctionComponent<AdminIndexProps> = () => {
  const [items, setItems] = useState<IArticlePreview[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState<ISearchOutput>({ query: '' });

  const query = useQuery(
    ['articlepreviews', { pageNumber, pageSize }],
    async _ => {
      const data = await articleAPI.fetchAdminArticlePreviewsSearch(
        pageNumber,
        pageSize,
        search
      );
      setItems(data.articles);
      setPageNumber(data.pageNumber);
      setTotalCount(data.totalCount);
      setPageSize(pageSize);
      return data;
    }
  );

  const goToPage = (page: number) => {
    setPageNumber(page + 1);
  };

  const router = useRouter();

  useEffect(() => {
    query.refetch();
  }, [search]);

  useEffect(() => {
    if (query.error) {
      router.push('/login');
    }
  }, [query.error]);

  const onSearch = async (data: ISearchOutput) => {
    setSearch(data);
  };

  return (
    <Page>
      <Column>
        <AdminNav path="/" />
      </Column>
      <Middle>
        <AdminSearch onSearch={onSearch} />
        {query.status === 'loading' ? (
          <ArticlePreviewContainer>
            {[...Array(pageSize)].map((item, index) => (
              <AdminArticlePreview key={index} loading={true} />
            ))}
          </ArticlePreviewContainer>
        ) : (
          <ArticlePreviewContainer>
            {items?.map(article => (
              <AdminArticlePreview
                article={article}
                href={`/article/edit/${article.id}`}
                key={article.id}
              />
            ))}
            <EuiPagination
              pageCount={Math.ceil(totalCount / pageSize)}
              activePage={pageNumber - 1}
              onPageClick={activePage => goToPage(activePage)}
            />
          </ArticlePreviewContainer>
        )}
      </Middle>
      <Column>
        <Link to="/article/new">
          <CustomButton color="primary" icon="new">
            Új cikk
          </CustomButton>
        </Link>
      </Column>
    </Page>
  );
};

export default AdminIndex;
