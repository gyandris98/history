import dayjs from 'dayjs';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import { IArticlePreview } from './../../../api/article';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Clickable = styled.div`
  cursor: pointer;
  &:hover {
    color: var(--accent);
  }
`;

const Cover = styled.img<{ noBorderRadius?: boolean }>`
  width: 100%;
  ${props => !props.noBorderRadius && `border-radius: 0.5rem;`}
  margin-bottom: 0.5rem;
`;

const LargeTitle = styled.h1`
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 0.67rem;
`;

const SmallTitle = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const SideBySideContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const SideBySideCover = styled.div`
  max-width: 40%;
  margin-right: 10px;
`;

const SideBySideTitle = styled.div`
  display: flex;
  flex-direction: column;
  overflow: none;
`;

const Lead = styled.p`
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  font-size: 16px;
`;

interface ArticlePreviewProps {
  article: IArticlePreview;
  noCover?: boolean;
  noLead?: boolean;
  titlePosition?: 'side' | 'bottom';
  titleSize?: 'small' | 'large';
  inArticle?: boolean;
}

function getElement(titleSize: string) {
  switch (titleSize) {
    case 'small':
      return SmallTitle;
    case 'large':
      return LargeTitle;
  }
}

const ArticlePreview: FunctionComponent<ArticlePreviewProps> = ({
  article,
  noCover,
  noLead,
  titleSize = 'small',
  titlePosition = 'bottom',
  inArticle,
}) => {
  const date = dayjs(article.createdAt);
  const Title = getElement(titleSize);
  return (
    <Wrapper>
      <Link
        href={`${!inArticle ? `cikk/` : ``}${date.year()}/${
          date.month() + 1
        }/${date.day()}/${article.slug}`}>
        <div>
          <Clickable>
            {titlePosition === 'bottom' ? (
              <>
                {article.cover && !noCover && <Cover src={article.cover.url} />}
                <Title>{article.title}</Title>
              </>
            ) : (
              <SideBySideContainer>
                {article.cover && !noCover && (
                  <SideBySideCover>
                    <Cover src={article.cover.url} />
                  </SideBySideCover>
                )}
                <SideBySideTitle>
                  <Title>{article.title}</Title>
                </SideBySideTitle>
              </SideBySideContainer>
            )}
          </Clickable>
        </div>
      </Link>
      {!noLead && <Lead>{article.lead}</Lead>}
    </Wrapper>
  );
};

export default ArticlePreview;
