import React, { FunctionComponent } from 'react';
import { IArticlePreview } from '../../../api/article';
import articleAPI from '../../../api/publicarticle';
import SearchResult from '../../../components/custom/Search/SearchResult';
import config from '../../../config';

interface TitleSearchProps {
  title: string;
  articles: IArticlePreview[];
}

const TitleSearch: FunctionComponent<TitleSearchProps> = ({
  title,
  articles,
}) => {
  return (
    <SearchResult
      searchTerm={title}
      searchBy={articleAPI.searchByTitle}
      initialData={articles}
    />
  );
};

export async function getServerSideProps(context) {
  const { title } = context.query;
  const result = await articleAPI.searchByTitle(
    1,
    config.searchPageSize,
    title
  );

  return {
    props: {
      title,
      articles: result.articles,
    },
  };
}

export default TitleSearch;
