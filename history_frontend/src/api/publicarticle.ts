import axios from './axios';
import config from '../config';
import {
  IArticle,
  IArticlePreview,
  IArticlePreviewPagination,
} from './article';

export interface ISlug {
  year: string;
  month: string;
  day: string;
  slug: string;
}

const ENDPOINT = '/public/article/';

export async function getHomePage() {
  const res = await axios.get<IArticlePreview[]>(config.apiLink + ENDPOINT);
  return res.data;
}

export async function fetchBySlug({
  year,
  month,
  day,
  slug,
}: {
  year: string;
  month: string;
  day: string;
  slug: string;
}) {
  const res = await axios.get<IArticle>(
    config.apiLink + ENDPOINT + `${year}/${month}/${day}/${slug}`
  );
  return res.data;
}

export async function fetchLatest(id: string, count: number) {
  const res = await axios.get<IArticlePreview[]>(
    config.apiLink + ENDPOINT + `${id}/latest/${count}`
  );
  return res.data;
}

export async function searchByTitle(
  pageNumber: number,
  pageSize: number,
  title: string
) {
  const res = await axios.get<IArticlePreviewPagination>(
    config.apiLink +
      ENDPOINT +
      `search/title/${pageNumber}/${pageSize}/${title}`
  );
  return res.data;
}

export async function fetchSlugs(count?: number) {
  var countRequest = count ? count : '';
  const res = await axios.get<ISlug[]>(
    `${config.apiLink}${ENDPOINT}slugs/${countRequest}`
  );
  return res.data;
}

const exported = {
  fetchBySlug,
  fetchSlugs,
  getHomePage,
  fetchLatest,
  searchByTitle,
};

export default exported;
