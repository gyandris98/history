import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { API, OutputData } from '@editorjs/editorjs';
import { IArticle } from '../../../api/article';
import ImageUploader from '../../custom/ImageUploader/ImageUploader';
import imageAPI, { IImage } from '../../../api/image';
import CustomButton from '../CustomButton';
import TextareaAutosize from 'react-autosize-textarea';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../lib/auth';
import { EuiDatePicker, EuiFormRow } from '@elastic/eui';
import moment from 'moment';

const EditorJs = dynamic(() => import('react-editor-js'), {
  ssr: false,
});

interface IArticleInput {
  title: string;
  lead: string;
  author: string;
  schedule: moment.Moment;
}

export interface IArticleOutput {
  title: string;
  lead: string;
  body: OutputData;
  cover: IImage;
  author: string;
  schedule: string;
}

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
  flex-grow: 1;
  flex-basis: 0;
`;

const BorderlessInput = styled.input<{ bold?: boolean; big?: boolean }>`
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

const BorderlessTextarea = styled(TextareaAutosize)<{
  bold?: boolean;
  big?: boolean;
}>`
  border: none;
  border-color: transparent;
  width: 100%;
  padding: 5px;
  font-size: 16px;
  padding: 5px 0;
  resize: none;
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

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const VerticalHr = styled.div`
  border-left: 1px solid #d9dadb;
`;

const CoverPreview = styled.img`
  width: 100%;
  border-radius: 10px 10px 0 0;
  margin: 10px 10px 0 10px;
`;

const CoverDetails = styled.div`
  border-radius: 0 0 10px 10px;
  border: 1px solid #d9dadb;
  border-top: none;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  margin: 0px 10px 10px 10px;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DeleteButton = styled(CustomButton)`
  margin-left: auto;
`;

interface ArticleEditorProps {
  formId: string;
  handleArticleSubmit: (data: IArticleOutput) => void;
  defaultValues?: IArticle;
}
const KILO_BYTES_PER_BYTE = 1000;
const convertBytesToKB = bytes => Math.round(bytes / KILO_BYTES_PER_BYTE);

const ArticleEditor: FunctionComponent<ArticleEditorProps> = ({
  formId,
  handleArticleSubmit,
  defaultValues,
}) => {
  const [data, setData] = useState<OutputData>(defaultValues?.body);
  const { user } = useAuth();
  const [tools, setTools] = useState({});
  const [cover, setCover] = useState<IImage>(defaultValues?.cover);
  const [coverLoading, setCoverLoading] = useState(false);

  const { errors, register, handleSubmit, control } = useForm<IArticleInput>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      lead: defaultValues?.lead ?? '',
      author: defaultValues?.author ?? '',
      schedule: defaultValues?.schedule ? moment(defaultValues.schedule) : null,
    },
  });

  const handleChange = (api: API, newData?: OutputData) => {
    setData(newData);
  };

  const onSubmit = (formData: IArticleInput) => {
    //console.log(formData);
    const scheduled = formData.schedule;
    delete formData.schedule;
    handleArticleSubmit({
      ...formData,
      body: data,
      cover,
      schedule: scheduled?.toISOString(),
    });
  };

  const onDelete = async e => {
    e.preventDefault();
    try {
      await imageAPI.remove(cover.id);
      setCover(null);
    } catch (error) {}
  };

  const onDrop = async pictureFiles => {
    try {
      setCoverLoading(true);
      const result = await imageAPI.upload(pictureFiles);
      setCover(result);
    } finally {
      setCoverLoading(false);
    }
  };
  useEffect(() => {
    const getTools = async () => {
      const tools = await (await import('../../../lib/tools')).EDITOR_JS_TOOLS;
      tools.image.config.additionalRequestHeaders[
        'Authorization'
      ] = `Bearer ${user.token}`;
      setTools(tools);
    };
    getTools();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id={formId}>
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
          <BorderlessTextarea
            name="lead"
            type="text"
            id="lead"
            async
            rows={3}
            bold
            ref={register}
          />
        </InputWrapper>

        <MutedHr />
        <HorizontalContainer>
          <InputWrapper htmlFor="author">
            <InputTitle>SZERZŐ</InputTitle>
            <BorderlessInput
              name="author"
              type="text"
              id="author"
              placeholder={user.unique_name}
              ref={register}
            />
          </InputWrapper>
          <VerticalHr />
          <InputWrapper htmlFor="date">
            <InputTitle>ÜTEMEZÉS</InputTitle>
            {/* <BorderlessInput name="date" type="text" id="date" ref={register} /> */}
            <Controller
              control={control}
              name="schedule"
              render={({ onChange, value }) => (
                <EuiDatePicker
                  selected={value}
                  onChange={onChange}
                  showTimeSelect
                  dateFormat="YYYY.MM.DD HH:mm"
                />
              )}
            />
          </InputWrapper>
        </HorizontalContainer>

        <MutedHr />
        <InputWrapper htmlFor="cover">
          <InputTitle>BORÍTÓ</InputTitle>

          {cover ? (
            <>
              <CoverPreview src={cover.url} />
              <CoverDetails>
                <b>{convertBytesToKB(cover.bytes)} Kb</b> ({cover.width}x
                {cover.height})
                <DeleteButton color="danger" onClick={onDelete} icon="delete">
                  Törlés
                </DeleteButton>
              </CoverDetails>
            </>
          ) : (
            <ImageUploader onUpload={onDrop} loading={coverLoading} />
          )}
        </InputWrapper>
      </form>

      <MutedHr />
      <InputWrapper>
        <InputTitle>SZÖVEG</InputTitle>
        <EditorWrapper>
          {Object.keys(tools).length && (
            <EditorJs
              placeholder="Itt kezdődik..."
              onChange={handleChange}
              data={data}
              tools={tools}
            />
          )}
        </EditorWrapper>
      </InputWrapper>

      <style jsx>{`
        .cdx-block {
          padding: 0.4em;
          color: red;
        }
        .ce-block__content {
          max-width: 100% !important;
        }
      `}</style>
    </>
  );
};

export default ArticleEditor;
