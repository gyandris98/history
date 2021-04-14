import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import {
  EuiDatePicker,
  EuiFieldSearch,
  EuiForm,
  EuiFormRow,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import CustomButton from '../CustomButton';
import { ISearchOutput } from '../../../api/article';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  padding: 20px;
  margin-bottom: 20px;
`;

const Form = styled(EuiForm)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;
`;

interface SearchProps {
  onSearch: (data: ISearchOutput) => void;
}

interface IFormInput {
  query: string;
  from?: moment.Moment;
  to?: moment.Moment;
}

const AdminSearch: FunctionComponent<SearchProps> = ({ onSearch }) => {
  const { errors, register, handleSubmit, control } = useForm<IFormInput>({
    defaultValues: {
      query: '',
      from: null,
      to: null,
    },
  });

  const onSubmit = (data: IFormInput) => {
    onSearch({
      ...data,
      from: data.from?.toISOString(),
      to: data.to?.toISOString(),
    });
  };

  return (
    <Wrapper>
      <Title>Keresés</Title>
      <Form component="form" onSubmit={handleSubmit(onSubmit)}>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow label="Keresés címre vagy szövegre">
              <EuiFieldSearch
                placeholder="Keresés"
                name="query"
                inputRef={register()}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow label="Dátumtól">
              <Controller
                control={control}
                name="from"
                render={({ onChange, value }) => (
                  <EuiDatePicker
                    selected={value}
                    onChange={onChange}
                    showTimeSelect
                    dateFormat="YYYY.MM.DD HH:mm"
                  />
                )}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow label="Dátumig">
              <Controller
                control={control}
                name="to"
                render={({ onChange, value }) => (
                  <EuiDatePicker
                    selected={value}
                    onChange={onChange}
                    showTimeSelect
                    dateFormat="YYYY.MM.DD HH:mm"
                  />
                )}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow hasEmptyLabelSpace>
              <CustomButton color="primary" type="submit" icon="search">
                Keresés
              </CustomButton>
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      </Form>
    </Wrapper>
  );
};

export default AdminSearch;
