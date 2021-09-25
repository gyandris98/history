import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import articleAPI from '../../api/publicarticle';
import { IArticle, IArticlePreview } from './../../api/article';
import styled from 'styled-components';
import dayjs from 'dayjs';
import ArticlePreview from '../../components/custom/ArticlePreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  line-height: 1.5;
  max-width: 1000px;
  margin: auto;
`;

const Column = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: calc((100vw - 1000px) / 2);
`;

const Middle = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Text = styled.div`
  width: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 25%;
  max-width: 25%;
  padding: 15px;
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Cover = styled.img`
  width: 100%;
  border-radius: 0.5rem;
`;

const Lead = styled.p`
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
  line-height: 24px;
  font-size: 16px;
  -webkit-font-smoothing: subpixel-antialiased;
`;

const AuthorContainer = styled.div`
  margin: 1rem 0 0rem 0;
  border-bottom: 1px solid rgb(221, 221, 221);
`;

const Author = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const AuthorDate = styled.span`
  margin-left: 0.5rem;
  opacity: 0.8;
`;

const Header = styled.h2`
  margin: 2rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.2;
`;

const QuoteContainer = styled.div`
  margin: 1rem;
`;

const Quote = styled.p`
  text-transform: uppercase;
  font-size: 1.3rem;
  line-height: 1.8rem;
  padding-left: 1rem;
  border-left: solid 0.3rem var(--accent);
`;

const QuoteAuthor = styled.div`
  content: '-';
  margin-right: 0.2rem;
`;

const ImageContainer = styled.div`
  margin-bottom: 1rem;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
`;

const ImageCaption = styled.div`
  margin-top: 0.5rem;
  opacity: 0.9;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 24px;
  font-size: 16px;
  font-weight: 400;
  -webkit-font-smoothing: subpixel-antialiased;
`;

const Latest = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const LatestIcon = styled(FontAwesomeIcon)`
  color: var(--accent);
`;

const TagContainer = styled.ul`
  margin-top: 10px;
`;

const Tag = styled.li`
  display: inline-block;
  color: #333;
  background-color: #dddddd;
  border-radius: 5px;
  cursor: pointer;
  margin: 3px;
  padding: 5px 8px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #ffbdbd;
  }
`;

interface ArticleProps {
  article: IArticle;
  latest: IArticlePreview[];
}

const renderBlock = (block, key) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <Paragraph
          dangerouslySetInnerHTML={{ __html: block.data.text }}
          key={key}
        />
      );
    case 'header':
      return (
        <Header
          dangerouslySetInnerHTML={{ __html: block.data.text }}
          key={key}
        />
      );
    case 'embed':
      return null;
    //   return (
    //     <div className={styles.embed} key={key}>
    //       <ReactPlayer
    //         url={block.data.source}
    //         key={key}
    //         style={{
    //           margin: "auto",
    //         }}
    //         className={styles.embed}
    //         controls={true}
    //         width="100%"
    //       />
    //       {block.data.caption && (
    //         <div
    //           className={styles.embedCaption}
    //           dangerouslySetInnerHTML={{ __html: block.data.caption }}
    //         />
    //       )}
    //     </div>
    //   );
    case 'quote':
      return (
        <QuoteContainer key={key}>
          <Quote dangerouslySetInnerHTML={{ __html: block.data.text }} />
          {block.data.caption && (
            <QuoteAuthor>
              <span dangerouslySetInnerHTML={{ __html: block.data.caption }} />
            </QuoteAuthor>
          )}
        </QuoteContainer>
      );
    case 'image':
      return (
        <ImageContainer key={key}>
          <Image src={block.data.file.url} alt={block.data.caption} />
          {block.data.caption && (
            <ImageCaption>
              <span dangerouslySetInnerHTML={{ __html: block.data.caption }} />
            </ImageCaption>
          )}
        </ImageContainer>
      );
    default:
      return null;
  }
};

const Article: FunctionComponent<ArticleProps> = ({ article, latest }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  console.log(article);
  return (
    <Page>
      <Title>{article.title}</Title>
      {article.cover && <Cover src={article.cover.url} />}
      <Body>
        <Text>
          <AuthorContainer>
            <Author>
              {article.author ? article.author : article.user.name}
            </Author>
            {' / '}
            <AuthorDate>
              {dayjs(article.createdAt).format('YYYY.MM.DD.')}
            </AuthorDate>
          </AuthorContainer>
          <TagContainer>
            {article.tags?.map((item, key) => (
              <Link key={key} href={`tag/${item}`}>
                <Tag>{item}</Tag>
              </Link>
            ))}
          </TagContainer>
          <Lead>{article.lead}</Lead>
          {article.body.blocks.map((block, i) => renderBlock(block, i))}
        </Text>
        <RightColumn>
          <Latest>
            <LatestIcon icon={faBell} /> Legfrissebb
          </Latest>
          {latest.map(item => (
            <ArticlePreview article={item} noLead inArticle />
          ))}
        </RightColumn>
      </Body>
    </Page>
  );
};

export const getStaticProps = async ({ params, ...rest }) => {
  const { all }: { all: string[] } = params;
  console.log(all);
  const article = await articleAPI.fetchBySlug({
    year: all[0],
    month: all[1],
    day: all[2],
    slug: all[3],
  });
  console.log(article);
  const latest = await articleAPI.fetchLatest(article.id, 3);
  return {
    props: {
      article,
      latest,
    },
  };
};

export const getStaticPaths = async () => {
  const slugs = await articleAPI.fetchSlugs();
  const paths = slugs.map(slug => ({
    params: {
      all: Object.values(slug),
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default Article;
