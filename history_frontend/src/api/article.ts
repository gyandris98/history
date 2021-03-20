import axios from './axios';
import config from '../config';
import { OutputData } from '@editorjs/editorjs';
import { User } from './user';
import { IArticleOutput } from '../components/custom/ArticleEditor/ArticleEditor';
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

const ENDPOINT = '/article/';

export async function createArticle(article) {
  const res = await axios.post<IArticle>(config.apiLink + ENDPOINT, article);
  return res.data;
}

export async function fetchAdminArticlePreviews(token: string) {
  console.log(axios.defaults.headers);
  await new Promise((resolve, reject) => setTimeout(() => resolve(''), 1000));
  const res = await axios.get<IArticlePreview[]>(config.apiLink + ENDPOINT);
  return res.data;
}

export async function fetchById(id: string, token: string) {
  await new Promise((resolve, reject) => setTimeout(() => resolve(''), 1000));
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
  fetchById,
  update,
};

export default exported;
