import { faHashtag, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

interface TagEditorProps {
  tags: string[];
  onNewItem: (tag: string) => void;
  onDelete: (tag: string) => void;
}

const Container = styled.div``;

const Icon = styled(FontAwesomeIcon)`
  margin-left: 10px;
  }
`;

const Tag = styled.li`
  display: inline-block;
  color: #333;
  background-color: #dddddd;
  border-radius: 5px;
  cursor: pointer;
  margin: 3px;
  padding: 8px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #ffdddd;
    text-decoration: line-through;
  }
  //   &:hover {
  //     background-color: white;
  //     color: var(--accent);
  //     text-decoration: line-through;
  //     // &::before {
  //     //   color: var(--accent);
  //     // }
  //   }
`;

const Input = styled.input`
  margin-left: 5px;
  border: none;
  border-color: transparent;
  width: 100%;
  padding: 8px;
  font-size: 16px;
  padding: 5px 0;
  &:focus {
    outline: none;
  }
`;

const TagEditor: FunctionComponent<TagEditorProps> = ({
  tags,
  onDelete,
  onNewItem,
}) => {
  const [value, setValue] = useState('');

  const onChange = ({ target }: { target: HTMLInputElement }) => {
    setValue(target.value);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onNewItem(value);
      setValue('');
    } else if (e.key === 'Backspace' && value.length === 0 && tags.length > 0) {
      onDelete(tags[tags.length - 1]);
    }
  };

  return (
    <Container>
      {tags.map((item, key) => {
        return (
          <Tag key={key} onClick={() => onDelete(item)}>
            {/* <Icon icon={faHashtag} /> {item} */}
            {item}
          </Tag>
        );
      })}
      <li style={{ display: 'inline-block' }}>
        <Input value={value} onChange={onChange} onKeyDown={onKeyDown} />
      </li>
    </Container>
  );
};

export default TagEditor;
