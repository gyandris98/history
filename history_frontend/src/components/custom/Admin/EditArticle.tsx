import React, { FunctionComponent, useEffect } from 'react';
import { useQuery } from 'react-query';
import AdminLayout from '../../layouts/AdminLayout';
import ArticleEditor, { IArticleOutput } from '../ArticleEditor/ArticleEditor';
import CustomButton from '../CustomButton';
import Spinner from '../Spinner';
import articleAPI from '../../../api/article';
import { useHistory, useParams } from 'react-router-dom';

interface EditArticleProps {}

const EditArticle: FunctionComponent<EditArticleProps> = () => {
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();

  const { status, data, error } = useQuery(
    `article-edit/${id}`,
    async () => {
      return await articleAPI.fetchById(id, '');
    },
    { refetchOnWindowFocus: false, refetchOnMount: 'always' }
  );
  useEffect(() => {
    if (error) {
      history.push('/login');
    }
  }, [error]);
  const onSubmit = async (output: IArticleOutput) => {
    try {
      await articleAPI.update(id, output);
      history.push('/');
    } catch (error) {}
  };
  return (
    <AdminLayout
      path="edit"
      rightColumn={
        <CustomButton color="primary" form="article-form" icon="save">
          Mentés
        </CustomButton>
      }>
      {status === 'loading' ? (
        <Spinner />
      ) : (
        <ArticleEditor
          formId="article-form"
          handleArticleSubmit={onSubmit}
          defaultValues={data}
        />
      )}
    </AdminLayout>
  );
};

export default EditArticle;
