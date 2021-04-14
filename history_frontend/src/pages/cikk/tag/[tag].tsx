import React, { FunctionComponent, useEffect, useState } from 'react';
import { IArticlePreview } from '../../../api/article';
import tagAPI from '../../../api/tag';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { EuiPagination, EuiSpacer } from '@elastic/eui';
import SearchResult from '../../../components/custom/Search/SearchResult';

interface TagProps {
  articles: IArticlePreview[];
  count: number;
  tag: string;
}

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

const Tag: FunctionComponent<TagProps> = ({ articles, tag, count }) => {
  return (
    <SearchResult
      // count={count}
      // articles={articles}
      searchTerm={tag}
      searchBy={tagAPI.fetchByTag}
    />
  );
  // const [items, setItems] = useState<IArticlePreview[]>(articles);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [pageSize, setPageSize] = useState(1);
  // const [totalCount, setTotalCount] = useState(count);

  // const query = useQuery(
  //   ['articlepreviews', { pageNumber, pageSize }],
  //   async params => {
  //     const data = await tagAPI.fetchByTag(pageNumber, pageSize, tag);
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

  // return (
  //   <Container>
  //     <TagName>
  //       "{tag}" ({totalCount})
  //     </TagName>
  //     {items.map((item, key) => (
  //       <Preview>
  //         <Image src={item.cover.url} />
  //         <Body>
  //           <Title>{item.title}</Title>
  //           <Lead>{item.lead}</Lead>
  //         </Body>
  //       </Preview>
  //     ))}
  //     <Pagination
  //       pageCount={Math.ceil(totalCount / pageSize)}
  //       activePage={pageNumber - 1}
  //       onPageClick={activePage => goToPage(activePage)}
  //     />
  //   </Container>
  // );
};

export async function getServerSideProps(context) {
  const { tag } = context.query;
  // const response = await tagAPI.fetchByTag(1, 10, tag);

  return {
    props: {
      // articles: response.articles,
      // count: response.totalCount,
      tag,
    },
  };
}

export default Tag;
