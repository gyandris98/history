import {
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiPage,
  EuiText,
  EuiSpacer,
  EuiFieldPassword,
} from '@elastic/eui';
import React, { FunctionComponent, useRef } from 'react';
import FancyButton from '../../../components/custom/FancyButton';
import { useAuth } from '../../../lib/auth';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { formatError } from '../../../lib/validation';
import CustomButton from '../CustomButton';

export interface IPasswordInput {
  newPassword: string;
  again: string;
}

interface PasswordProps {
  onSubmit: (data: IPasswordInput) => void;
}

const Wrapper = styled.div`
  border-radius: 50px;
  padding: 50px;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  background: #fff;
`;

const Form = styled(EuiForm)`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormRow = styled(EuiFormRow)`
  width: 800px;
`;

const formatValidation = formatError('password');

const Password: FunctionComponent<PasswordProps> = ({ onSubmit }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    errors,
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<IPasswordInput>();
  const newPassword = useRef({});
  newPassword.current = watch('newPassword', '');

  const submit = (data: IPasswordInput) => {
    reset();
    onSubmit(data);
  };

  return (
    <Wrapper>
      <Form component="form" onSubmit={handleSubmit(submit)}>
        <FormRow>
          <EuiText textAlign="center">
            <h1>Jelszó</h1>
          </EuiText>
        </FormRow>
        <FormRow
          label="Új jelszó"
          isInvalid={!!errors.newPassword}
          error={formatValidation({
            error: errors.newPassword,
            field: 'newPassword',
          })}>
          <EuiFieldPassword
            name="newPassword"
            inputRef={register({
              minLength: 5,
              maxLength: 32,
              required: true,
            })}
            isInvalid={!!errors.newPassword}
            fullWidth
          />
        </FormRow>
        <FormRow
          label="Új jelszó megerősítése"
          isInvalid={!!errors.again}
          error={formatValidation({
            error: errors.again,
            field: 'again',
          })}>
          <EuiFieldPassword
            name="again"
            inputRef={register({
              minLength: 5,
              maxLength: 32,
              required: true,
              validate: value =>
                value === newPassword.current || 'A jelszavak nem egyeznek meg',
            })}
            isInvalid={!!errors.again}
            fullWidth
          />
        </FormRow>
        <EuiSpacer />
        <CustomButton color="primary" type="submit" icon="save">
          Megváltoztatás
        </CustomButton>
      </Form>
    </Wrapper>
  );
};

export default Password;
