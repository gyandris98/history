import React, { FunctionComponent, useEffect, useState } from 'react';
//import EditorJS from '@editorjs/editorjs';
import { Admin } from '../../../components/layouts/Admin';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
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
import CustomButton from '../../../components/custom/CustomButton';
import { useHistory } from 'react-router';

interface NewArticleProps {}

const NewArticle: FunctionComponent<NewArticleProps> = () => {
  const [data, setData] = useState<OutputData>();
  //const router = useRouter();
  const history = useHistory();
  // useEffect(() => {
  //   const loadEditor = async () => {
  //     const EditorJS =  await import('@editorjs/editorjs');
  //     const editor = new EditorJS('editorjs');
  //   }
  //   if (window) {
  //     loadEditor();
  //   }
  // }, [window]);

  const onArticleSubmit = async (formData: IArticleOutput) => {
    try {
      await articleAPI.createArticle(formData);
      history.push('/');
    } catch (error) {}
  };

  return (
    <>
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
    </>
  );
};

export default NewArticle;
