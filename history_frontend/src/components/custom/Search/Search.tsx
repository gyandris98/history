import React, {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import tagAPI from '../../../api/tag';
import { EuiInputPopover } from '@elastic/eui';
import Link from 'next/link';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #000;
  padding: 20px;
  padding-bottom: 50px;
  text-align: center;
  width: 100%;
  max-width: 350px;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 1.7rem;
`;

const CustomInput = styled.input`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  max-width: 500px;
  font-size: 20px;
  &:focus {
    outline: none;
  }
`;

const Tag = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  &:last-child {
    margin-top: 15px;
  }
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background: #e3e3e3;
  }
`;

const NoResultsTag = styled(Tag)`
  cursor: default;
  &:hover {
    background: none;
  }
`;

const TagCategory = styled(Tag)`
  cursor: default;
  font-weight: bold;
  background: #ffe0e0;
  border-color: #ffbdbd;
  &:hover {
    background: #ffe0e0;
  }
`;

const ResultWrapper = styled.div``;

interface SearchProps {
  close: () => void;
}

const Search: FunctionComponent<SearchProps> = () => {
  const [search, setSearch] = useState('');
  const [displayedSearch, setDisplayedSearch] = useState('');
  const [open, setOpen] = useState(false);
  const { data } = useQuery(`search/${search}`, async () => {
    return await tagAPI.searchByTagOrTitle(search);
  });

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    setDisplayedSearch(target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => setSearch(displayedSearch), 500);
    return () => clearTimeout(timeoutId);
  }, [displayedSearch]);

  const input = (
    <CustomInput
      placeholder="Keresés"
      onChange={handleChange}
      value={displayedSearch}
    />
  );
  useEffect(() => {
    if (data) {
      setOpen(true);
    }
  }, [data]);
  return (
    <Wrapper>
      <EuiInputPopover
        input={input}
        isOpen={open}
        closePopover={() => setOpen(false)}
        onClick={() => setOpen(true)}>
        {data ? (
          <>
            <TagCategory>Címkék</TagCategory>
            {data.tags.map(item => (
              <Link href={`/cikk/tag/${item}`}>
                <Tag>{item}</Tag>
              </Link>
            ))}
            {data.tags.length === 0 && (
              <NoResultsTag>Nincs találat</NoResultsTag>
            )}
            <Link href={`/cikk/kereses/${search}`}>
              <Tag>
                <b>Cikk cím:</b> {search} ({data.titleCount})
              </Tag>
            </Link>
          </>
        ) : (
          <p>Nincs találat</p>
        )}
      </EuiInputPopover>
    </Wrapper>
  );
};

export default Search;
