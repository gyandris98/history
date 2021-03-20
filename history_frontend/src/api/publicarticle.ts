import axios from './axios';
import config from '../config';
import { IArticle, IArticlePreview } from './article';

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

const exported = {
  fetchBySlug,
  getHomePage,
  fetchLatest,
};

export default exported;
