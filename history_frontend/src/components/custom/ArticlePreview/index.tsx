import dayjs from 'dayjs';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import { IArticlePreview } from './../../../api/article';
import styled from 'styled-components';

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

interface ArticlePreviewProps {
  article: IArticlePreview;
  noCover?: boolean;
  noLead?: boolean;
  titlePosition?: 'side' | 'bottom';
  titleSize?: 'small' | 'large';
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
}) => {
  const date = dayjs(article.createdAt);
  const Title = getElement(titleSize);
  return (
    <div>
      <Link
        href={`cikk/${date.year()}/${date.month() + 1}/${date.day()}/${
          article.slug
        }`}>
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
      {!noLead && <p>{article.lead}</p>}
    </div>
  );
};

export default ArticlePreview;
