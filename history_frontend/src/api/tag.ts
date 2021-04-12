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

const exported = {
  fetchByTag,
};

export default exported;
