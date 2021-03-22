import React, { FunctionComponent } from 'react';
import articleAPI from '../api/publicarticle';
import Link from 'next/link';
import MyComponent from '../components/my_component';
import { IArticle } from './../api/article';
import dayjs from 'dayjs';
import ArticlePreview from '../components/custom/ArticlePreview';
import styled from 'styled-components';

interface HomePageProps {
  articles: IArticle[];
}

const Page = styled.div`
  width: 100%;
  max-width: 1030px;
  margin: auto;
  display: flex;
  flex-direction: row;
`;

const Column = styled.div<{ wide?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  width: ${props => (props.wide ? `67%` : `33%`)};
`;

const Index: FunctionComponent<HomePageProps> = ({ articles }) => {
  return (
    <Page>
      <Column wide>
        <ArticlePreview article={articles[0]} titleSize="large" />
        {articles.slice(3).map(item => (
          <ArticlePreview article={item} key={item.id} noCover />
        ))}
      </Column>
      <Column>
        <ArticlePreview article={articles[1]} noLead />
        <ArticlePreview article={articles[2]} noLead />
      </Column>
    </Page>
  );
};

export const getServerSideProps = async () => {
  const articles = await articleAPI.getHomePage();
  return {
    props: {
      articles,
    },
  };
};

export default Index;
