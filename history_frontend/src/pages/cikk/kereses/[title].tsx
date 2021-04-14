import React, { FunctionComponent, useEffect } from 'react';
import { IArticlePreview } from '../../../api/article';
import articleAPI from '../../../api/publicarticle';
import SearchResult from '../../../components/custom/Search/SearchResult';

interface TitleSearchProps {
  title: string;
}

const TitleSearch: FunctionComponent<TitleSearchProps> = ({ title }) => {
  return (
    <SearchResult searchTerm={title} searchBy={articleAPI.searchByTitle} />
  );
};

export async function getServerSideProps(context) {
  const { title } = context.query;

  return {
    props: {
      title,
    },
  };
}

export default TitleSearch;
