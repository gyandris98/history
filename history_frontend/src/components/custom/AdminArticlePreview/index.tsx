import React, { FunctionComponent } from 'react';
import { IArticlePreview } from '../../../api/article';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div<{ loading?: boolean }>`
  width: 100%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  padding: 20px;
  margin-bottom: 20px;
  color: #444444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    animation-name: example;
    animation-duration: 0.25s;
    border-left: 6px solid var(--accent);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    background-color: #fffaff;
  }
  @keyframes example {
    0% {
      border-left-width: 2px;
    }
    25% {
      border-left-width: 3px;
    }
    50% {
      border-left-width: 4px;
    }
    100% {
      border-left-width: 5px;
    }
  }
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  ${props =>
    props.loading &&
    `
    height: 84px;
  background: linear-gradient(
    to right,
    #fff 1%,
    rgb(226, 226, 226) 25%,
    #fff 45%
  );
  background-size: 3000px 100%;
  animation: shimmer 2s infinite;
  `}
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: auto;
  text-align: right;
  opacity: 0.8;
`;

const Lead = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DateContainer = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const CustomLink = styled(Link)`
  width: 100%;
`;

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

interface AdminArticlePreviewProps {
  article?: IArticlePreview;
  href?: string;
  loading?: boolean;
}

const AdminArticlePreview: FunctionComponent<AdminArticlePreviewProps> = ({
  article,
  href,
  loading = false,
}) => {
  if (loading) {
    return <Container loading={true} />;
  }
  return (
    <CustomLink to={href}>
      <Container>
        <Left>
          <Title>{article.title}</Title>
          <Lead>{article.lead}</Lead>
        </Left>

        <Right>
          <DateContainer>
            <b>{formatDate(article.createdAt)}</b>
          </DateContainer>
          <div>{article.user.name}</div>
        </Right>
      </Container>
    </CustomLink>
  );
};

export default AdminArticlePreview;
