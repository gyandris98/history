import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import AdminNav from '../custom/Admin/AdminNav';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

const Column = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: calc((100vw - 1000px) / 2);
`;

const Page = styled.div`
  background: #eef5fa;
  border-radius: 100px;
  border-radius: 0;
  width: 100%;
  max-width: 1000px;
  //padding: 70px 60px;
  //padding: 20px 0;
  background: #fff;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  border-radius: 5px;
  height: fit-content;
  margin-bottom: 200px;
`;

interface EditorLayoutProps {
  leftColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  path: string;
}

const AdminLayout: FunctionComponent<EditorLayoutProps> = ({
  children,
  leftColumn,
  rightColumn,
  path,
}) => {
  return (
    <Container>
      <Column>
        <AdminNav path={path} />
        {leftColumn}
      </Column>
      <Page>{children}</Page>
      <Column>{rightColumn}</Column>
    </Container>
  );
};

export default AdminLayout;
