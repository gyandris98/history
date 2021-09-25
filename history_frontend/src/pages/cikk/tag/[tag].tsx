import React, { FunctionComponent, useEffect, useState } from 'react';
import { IArticlePreview } from '../../../api/article';
import tagAPI from '../../../api/tag';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { EuiPagination, EuiSpacer } from '@elastic/eui';
import SearchResult from '../../../components/custom/Search/SearchResult';
import config from '../../../config';

interface TagProps {
  articles: IArticlePreview[];
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

const Tag: FunctionComponent<TagProps> = ({ articles, tag }) => {
  return (
    <SearchResult
      searchTerm={tag}
      searchBy={tagAPI.fetchByTag}
      // initialData={articles}
    />
  );
};

export async function getServerSideProps(context) {
  const { tag } = context.query;
  //  const result = await tagAPI.fetchByTag(1, config.searchPageSize, tag);

  return {
    props: {
      tag,
      //  articles: result.articles,
    },
  };
}

export default Tag;
