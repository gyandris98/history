import {
  EuiButton,
  EuiFieldText,
  EuiFieldPassword,
  EuiForm,
  EuiFormRow,
  EuiPage,
  EuiText,
  EuiLink,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';
import React, { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { FieldError, useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import FancyButton from '../FancyButton';
import { formatError } from '../../../lib/validation';
import { useHistory } from 'react-router-dom';

const Form = styled(EuiForm)`
  width: 100%;
  max-width: 800px;
`;

const FormRow = styled(EuiFormRow)`
  width: 800px;
`;

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

const formatValidation = formatError('register');

export default function register() {
  const { login, register: registerFn } = useAuth();
  const { errors, register, handleSubmit } = useForm<IFormInput>();
  const [loading, setLoading] = useState(false);
  //const router = useRouter();
  const history = useHistory();

  async function onSubmit(data: IFormInput) {
    try {
      setLoading(true);
      const res = await registerFn(data);
      history.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <EuiPage>
      <Form component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <EuiText textAlign="center">
            <h1>Regisztráció</h1>
          </EuiText>
        </FormRow>

        <FormRow
          label="Teljes név"
          isInvalid={!!errors.name}
          error={formatValidation({ error: errors.name, field: 'name' })}>
          <EuiFieldText
            name="name"
            inputRef={register({
              minLength: 2,
              maxLength: 64,
              required: true,
            })}
            isInvalid={!!errors.name}
            fullWidth
          />
        </FormRow>

        <FormRow
          label="Email cím"
          isInvalid={!!errors.email}
          error={formatValidation({ error: errors.email, field: 'email' })}>
          <EuiFieldText
            name="email"
            inputRef={register({
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              required: true,
            })}
            isInvalid={!!errors.email}
            fullWidth
          />
        </FormRow>

        <FormRow
          label="Jelszó"
          isInvalid={!!errors.password}
          error={formatValidation({
            error: errors.password,
            field: 'password',
          })}>
          <EuiFieldPassword
            name="password"
            inputRef={register({
              minLength: 5,
              maxLength: 32,
              required: true,
            })}
            isInvalid={!!errors.password}
            fullWidth
          />
        </FormRow>

        {/* <EuiButton color="secondary" type="submit">
            Bejelentkezés
          </EuiButton> */}
        <EuiSpacer />
        <FancyButton fullWidth type="submit" isLoading={loading}>
          Regisztráció
        </FancyButton>
        <EuiSpacer />
        <EuiText>
          Van már fiókja? <Link href="/login">Lépjen be</Link>
        </EuiText>
      </Form>
    </EuiPage>
  );
}
