import React, { FunctionComponent, useEffect, useState } from 'react';
import { IArticlePreview } from '../../../api/article';
import tagAPI from '../../../api/tag';
import SearchResult from '../../../components/custom/Search/SearchResult';
import config from '../../../config';

interface TagProps {
  articles: IArticlePreview[];
  tag: string;
}

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
  // const result = await tagAPI.fetchByTag(1, config.searchPageSize, tag);

  return {
    props: {
      tag,
      // articles: result.articles,
    },
  };
}

export default Tag;
