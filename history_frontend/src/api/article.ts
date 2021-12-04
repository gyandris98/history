import axios from './axios';
import config from '../config';
import { OutputData } from '@editorjs/editorjs';
import { IImage } from './image';
import { IUser } from './users';

export interface IArticle {
  id: string;
  title: string;
  lead: string;
  body: OutputData;
  createdAt: string;
  user: IUser;
  cover: IImage;
  slug: string;
  author: string;
  schedule: string;
  tags: string[];
}

export interface IArticlePreview {
  id: string;
  title: string;
  lead: string;
  createdAt: string;
  user: IUser;
  cover: IImage;
  slug: string;
}

export interface IArticlePreviewPagination {
  articles: IArticlePreview[];
  totalCount: number;
  pageNumber: number;
}

export interface ISearchOutput {
  query: string;
  from?: string;
  to?: string;
}

const ENDPOINT = '/article/';

export async function createArticle(article) {
  const res = await axios.post<IArticle>(config.apiLink + ENDPOINT, article);
  return res.data;
}

export async function fetchAdminArticlePreviews(
  pageNumber: number,
  pageSize: number
) {
  const res = await axios.get<IArticlePreviewPagination>(
    `${config.apiLink}${ENDPOINT}${pageNumber}/${pageSize}`
  );
  return res.data;
}

export async function fetchAdminArticlePreviewsSearch(
  pageNumber: number,
  pageSize: number,
  query: ISearchOutput
) {
  const res = await axios.post<IArticlePreviewPagination>(
    `${config.apiLink}${ENDPOINT}${pageNumber}/${pageSize}`,
    query
  );
  return res.data;
}

export async function fetchById(id: string, token: string) {
  const res = await axios.get<IArticle>(config.apiLink + ENDPOINT + id);
  return res.data;
}

export async function update(id: string, data) {
  const res = await axios.put<IArticle>(config.apiLink + ENDPOINT + id, data);
  return res.data;
}

const exported = {
  createArticle,
  fetchAdminArticlePreviews,
  fetchAdminArticlePreviewsSearch,
  fetchById,
  update,
};

export default exported;
