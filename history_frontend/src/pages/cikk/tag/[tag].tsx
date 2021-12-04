import React, { FunctionComponent } from 'react';
import { IArticlePreview } from '../../../api/article';
import tagAPI from '../../../api/tag';
import SearchResult from '../../../components/custom/Search/SearchResult';

interface TagProps {
  articles: IArticlePreview[];
  tag: string;
}

const Tag: FunctionComponent<TagProps> = ({ articles, tag }) => {
  return <SearchResult searchTerm={tag} searchBy={tagAPI.fetchByTag} />;
};

export async function getServerSideProps(context) {
  const { tag } = context.query;

  return {
    props: {
      tag,
    },
  };
}

export default Tag;
