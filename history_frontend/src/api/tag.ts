import axios from './axios';
import config from '../config';
import { IArticlePreviewPagination } from './article';

const ENDPOINT = '/public/tag/';

export async function fetchByTag(
  pageNumber: number,
  pageSize: number,
  tag: string
) {
  const res = await axios.get<IArticlePreviewPagination>(
    config.apiLink + ENDPOINT + `${pageNumber}/${pageSize}/${tag}`
  );
  return res.data;
}

interface IPartialTagSearch {
  titleCount: number;
  tags: string[];
}

export async function searchByTagOrTitle(query: string) {
  if (query.length > 0) {
    const res = await axios.get<IPartialTagSearch>(
      config.apiLink + ENDPOINT + query
    );
    return res.data;
  }
}

const exported = {
  fetchByTag,
  searchByTagOrTitle,
};

export default exported;
