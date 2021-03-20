import axios from './axios';
import config from '../config';

export interface IImage {
  id: string;
  width: number;
  height: number;
  createdAt: Date;
  url: string;
  bytes: number;
}

const ENDPOINT = '/image/';

export const EDITOR_ENDPOINT = config.apiLink + ENDPOINT + 'editor';

async function upload(file) {
  const formData = new FormData();
  formData.append('image', file);

  const axiosConfig = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const res = await axios.post<IImage>(
    config.apiLink + ENDPOINT,
    formData,
    axiosConfig
  );
  return res.data;
}

async function remove(id: string) {
  const res = await axios.delete<string>(config.apiLink + ENDPOINT + id);
  return res.data;
}

const exported = {
  upload,
  remove,
};

export default exported;
