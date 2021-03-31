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
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Column = styled.div<{ wide?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  width: ${props => (props.wide ? `67%` : `33%`)};
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Desktop = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

const Mobile = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const Index: FunctionComponent<HomePageProps> = ({ articles }) => {
  return (
    <>
    <Desktop>
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
    </Desktop>
    <Mobile>
      <ArticlePreview article={articles[0]} titleSize="large" />
      <ArticlePreview article={articles[1]} noLead />
        <ArticlePreview article={articles[2]} noLead />
        {articles.slice(3).map(item => (
          <ArticlePreview article={item} key={item.id} noCover />
        ))}
    </Mobile>
    </>
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
