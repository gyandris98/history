import React, { FunctionComponent, useEffect, useState } from 'react';
//import EditorJS from '@editorjs/editorjs';
import { Admin } from '../../../components/layouts/Admin';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import './articleEditor.module.css';
import { API, OutputData } from '@editorjs/editorjs';
import {
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiTextArea,
} from '@elastic/eui';
import { useForm } from 'react-hook-form';
import FancyButton from '../../../components/custom/FancyButton/';
import articleAPI from '../../../api/article';
import { Router, useRouter } from 'next/router';
import { userInfo } from 'os';
import ArticleEditor, {
  IArticleOutput,
} from '../../../components/custom/ArticleEditor/ArticleEditor';
import Editor from '../../../components/layouts/AdminLayout';
import AdminLayout from '../../../components/layouts/AdminLayout';
import { contextAuth } from '../../../lib/auth';
import CustomButton from '../../../components/custom/CustomButton';
//import EditorJs from 'react-editor-js';

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
  max-width: 950px;
  //padding: 70px 60px;
  //padding: 20px 0;
  background: #fff;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  border-radius: 5px;
`;

const EditorWrapper = styled.div`
  min-height: 450px;
  background: #fff;
  border-radius: 8px;
  // box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
  //   0 9px 45px 0 rgb(114 119 160 / 12%);
  // padding: 20px 60px;
  font-size: 16px;
`;

const InputWrapper = styled.label`
  display: block;
  padding: 20px 60px;
`;

const BorderlessInput = styled.input<{ bold: boolean; big: boolean }>`
  border: none;
  border-color: transparent;
  width: 100%;
  padding: 5px;
  font-size: 16px;
  padding: 5px 0;
  ${props => props.bold && `font-weight: bold;`}
  ${props => props.big && `font-size: 24px;`}
  &:focus {
    outline: none;
  }
`;

const InputTitle = styled.p`
  opacity: 0.9;
  font-size: 12px;
`;

const MutedHr = styled.div`
  width: 100%;
  border-bottom: 1px solid #d9dadb;
`;

interface newArticleProps {}

const EditorJs = dynamic(() => import('react-editor-js'), {
  ssr: false,
});

interface IArticleInput {
  title: string;
  lead: string;
}

// const EditorJS = dynamic(() => import("@editorjs/editorjs"), {
//     ssr: false
// });

const newArticle: FunctionComponent<newArticleProps> = () => {
  const [data, setData] = useState<OutputData>();
  const { errors, register, handleSubmit } = useForm<IArticleInput>();
  const router = useRouter();
  // useEffect(() => {
  //   const loadEditor = async () => {
  //     const EditorJS =  await import('@editorjs/editorjs');
  //     const editor = new EditorJS('editorjs');
  //   }
  //   if (window) {
  //     loadEditor();
  //   }
  // }, [window]);

  const handleChange = (api: API, newData?: OutputData) => {
    setData(newData);
  };

  const onSubmit = formData => {
    console.log({ ...formData, body: data });
    try {
      articleAPI.createArticle({ ...formData, body: data });
      router.push('/admin');
    } catch (error) {}
  };
  const onArticleSubmit = async (formData: IArticleOutput) => {
    try {
      await articleAPI.createArticle(formData);
      router.push('/admin');
    } catch (error) {}
  };

  return (
    <Admin>
      <EuiSpacer />
      <AdminLayout
        path="new"
        rightColumn={
          <CustomButton color="primary" form="article-form" icon="save">
            Publikálás
          </CustomButton>
        }>
        <ArticleEditor
          formId="article-form"
          handleArticleSubmit={onArticleSubmit}
        />
      </AdminLayout>
      {/* <Container>
        <Column></Column>
        <Page>
          <ArticleEditor
            formId="article-form"
            handleArticleSubmit={onArticleSubmit}
          /> */}
      {/* <form onSubmit={handleSubmit(onSubmit)} id="article-form">
            <InputWrapper htmlFor="title">
              <InputTitle>CÍM</InputTitle>
              <BorderlessInput
                name="title"
                type="text"
                bold
                big
                id="title"
                ref={register}
              />
            </InputWrapper>

            <MutedHr />
            <InputWrapper htmlFor="lead">
              <InputTitle>LEAD</InputTitle>
              <BorderlessInput
                name="lead"
                type="text"
                id="lead"
                bold
                ref={register}
              />
            </InputWrapper>
          </form>

          <MutedHr />
          <InputWrapper>
            <InputTitle>SZÖVEG</InputTitle>
            <EditorWrapper>
              <EditorJs
                autofocus
                placeholder="Itt kezdődik..."
                onChange={handleChange}
              />
            </EditorWrapper>
          </InputWrapper>

          <style jsx>{`
            .cdx-block {
              padding: 0.4em;
              color: red;
            }
            .ce-block__content {
              max-width: 100% !important;
            }import AdminLayout from './../../../components/layouts/AdminLayout';

          `}</style> */}
      {/* </Page>
        <Column>
          <FancyButton form="article-form">Publikálás</FancyButton>
        </Column>
      </Container> */}
    </Admin>
  );
};

const newArticleNoSSR = dynamic(() => Promise.resolve(newArticle), {
  ssr: false,
});

export const getServerSideProps = context => {
  const notLoggedIn = contextAuth(context);
  if (!notLoggedIn.token) return notLoggedIn;

  return {
    props: {},
  };
};
//export default newArticleNoSSR;
export default newArticle;
