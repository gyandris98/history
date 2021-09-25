const SEARCH_PAGE_SIZE = 10;

interface IConfiguration {
  apiLink: string;
  searchPageSize: number;
}

const dev: IConfiguration = {
  apiLink: 'https://localhost:5001/api',
  searchPageSize: SEARCH_PAGE_SIZE,
};

const prod: IConfiguration = {
  apiLink: '',
  searchPageSize: SEARCH_PAGE_SIZE,
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export default {
  ...config,
};
