import React, { FunctionComponent } from 'react';

import { EuiSpacer } from '@elastic/eui';
import articleAPI from '../../../api/article';
import ArticleEditor, {
  IArticleOutput,
} from '../../../components/custom/ArticleEditor/ArticleEditor';
import AdminLayout from '../../../components/layouts/AdminLayout';
import CustomButton from '../../../components/custom/CustomButton';
import { useHistory } from 'react-router';

interface NewArticleProps {}

const NewArticle: FunctionComponent<NewArticleProps> = () => {
  const history = useHistory();

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
