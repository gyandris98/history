import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faAtom } from '@fortawesome/free-solid-svg-icons';

export const FileUploadContainer = styled.section<{ hover: boolean }>`
  position: relative;
  margin: 25px 0 15px;
  border: 3px dashed lightgray;
  padding: 35px 20px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  cursor: pointer;
  transition: all 1s cubic-bezier(0.25, 0.8, 0.25, 1);
  ${props =>
    props.hover &&
    `
    background-color: #ffd3c2;
    border-color: var(--accent);
  `}
`;

export const FormField = styled.input`
  font-size: 18px;
  display: block;
  width: 100%;
  border: none;
  text-transform: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const Icon = styled(FontAwesomeIcon)<{ isHover: boolean }>`
  margin: 0 auto;
  font-size: 40px;
  margin: 10px;
  transition: all 1s cubic-bezier(0.25, 0.8, 0.25, 1);
  ${props =>
    props.isHover && `font-size: 60px; color: var(--accent); margin: 10px;`}
`;
export const Title = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  loading?: boolean;
}

const ImageUploader: FunctionComponent<ImageUploaderProps> = ({
  onUpload,
  loading = false,
}) => {
  const [hover, setHover] = useState(false);
  const handleNewFileUpload = e => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      onUpload(newFiles[0]);
    }
  };

  return (
    <FileUploadContainer
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragEnter={() => setHover(true)}
      onDragLeave={() => setHover(false)}
      hover={hover}>
      <Icon
        icon={loading ? faAtom : faFileImage}
        spin={loading}
        isHover={hover}
      />
      <Title>
        {loading
          ? 'Feltöltés folyamatban...'
          : 'Húzzon ide egy képet, vagy böngésszen'}
      </Title>
      <FormField type="file" title="" value="" onChange={handleNewFileUpload} />
    </FileUploadContainer>
  );
};

export default ImageUploader;
