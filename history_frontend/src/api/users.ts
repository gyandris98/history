import config from '../config';
import axios from './axios';

const ENDPOINT = '/users/';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: {
    name: string;
    title: string;
  };
}

export interface IUserPagination {
  users: IUser[];
  totalCount: number;
  pageNumber: number;
}

export const roleOptions = [
  {
    value: 'Reader',
    text: 'Olvasó',
  },
  {
    value: 'Editor',
    text: 'Szerkesztő',
  },
  {
    value: 'Admin',
    text: 'Admin',
  },
];

async function fetchUsers({
  pageNumber,
  pageSize,
}: {
  token?: string;
  pageNumber: number;
  pageSize: number;
}) {
  const res = await axios.get<IUserPagination>(
    config.apiLink + ENDPOINT + `${pageNumber}/${pageSize}`
  );
  return res.data;
}

async function deleteUsers(ids: string[]) {
  const res = await axios.delete<string[]>(config.apiLink + ENDPOINT, {
    data: ids,
  });
  return res.data;
}

async function changeRole(id: string, role: string) {
  const res = await axios.patch<IUser>(
    `${config.apiLink}${ENDPOINT}role/${id}/${role}`,
    {}
  );
  return res.data;
}

async function changeInfo(name: string, email: string, token: string) {
  const res = await axios.patch<string>(
    `${config.apiLink}${ENDPOINT}info`,
    { name, email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

async function changePassword(newPassword: string, token: string) {
  const res = await axios.patch(
    `${config.apiLink}${ENDPOINT}password`,
    { newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

const exported = {
  fetchUsers,
  deleteUsers,
  changeRole,
  changeInfo,
  changePassword,
};

export default exported;
