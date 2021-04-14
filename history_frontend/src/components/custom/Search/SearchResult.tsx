import React, { FunctionComponent, useEffect, useState } from 'react';
import { IArticlePreview } from '../../../api/article';
import tagAPI from '../../../api/tag';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { EuiPagination, EuiSpacer } from '@elastic/eui';
import { IArticlePreviewPagination } from './../../../api/article';
import Link from 'next/link';
import dayjs from 'dayjs';

interface SearchResultProps {
  searchTerm: string;
  searchBy: (
    pageNumber: number,
    pageSize: number,
    query: string
  ) => Promise<IArticlePreviewPagination>;
}

const Clickable = styled.div`
  cursor: pointer;
  &:hover h1 {
    color: var(--accent);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  justify-content: center;
`;

const TagName = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
`;

const Preview = styled.div`
  display: flex;
  flex-direction: row;
`;

const Image = styled.img`
  width: 200px;
  border-radius: 10px;
`;

const Body = styled.div`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Pagination = styled(EuiPagination)`
  margin: auto;
  margin-top: 2rem;
`;

const Lead = styled.p``;

const SearchResult: FunctionComponent<SearchResultProps> = ({
  searchTerm,
  searchBy,
}) => {
  const [items, setItems] = useState<IArticlePreview[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const query = useQuery(
    ['articlepreviews', { pageNumber, pageSize }],
    async params => {
      const data = await searchBy(pageNumber, pageSize, searchTerm);
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

  return (
    <Container>
      <TagName>
        "{searchTerm}" ({totalCount})
      </TagName>
      {items.map((item, key) => {
        const date = dayjs(item.createdAt);
        return (
          <Link
            key={key}
            href={`cikk/${date.year()}/${date.month() + 1}/${date.day()}/${
              item.slug
            }`}>
            <Clickable>
              <Preview>
                <Image src={item.cover.url} />
                <Body>
                  <Title>{item.title}</Title>
                  <Lead>{item.lead}</Lead>
                </Body>
              </Preview>
            </Clickable>
          </Link>
        );
      })}
      <Pagination
        pageCount={Math.ceil(totalCount / pageSize)}
        activePage={pageNumber - 1}
        onPageClick={activePage => goToPage(activePage)}
      />
    </Container>
  );
};

export default SearchResult;
