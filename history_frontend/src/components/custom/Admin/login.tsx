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
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import FancyButton from '../FancyButton';
import { Link } from 'react-router-dom';
import { formatError } from '../../../lib/validation';
import { useHistory } from 'react-router';

const Form = styled(EuiForm)`
  width: 100%;
  max-width: 800px;
`;

const FormRow = styled(EuiFormRow)`
  width: 800px;
`;

const Page = styled.div`
  padding: 14px;
  display: flex;
`;

const ErrorMessage = styled.p`
  color: var(--accent);
  margin-bottom: 0.5rem !important;
`;

interface IFormInput {
  email: string;
  password: string;
}

const formatValidation = formatError('login');

export default function login() {
  const { login } = useAuth();
  const { errors, register, handleSubmit } = useForm<IFormInput>();
  const [error, setError] = useState<string>('');
  //const router = useRouter();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: IFormInput) {
    try {
      setLoading(true);
      const res = await login(data);
      history.push('/');
    } catch (error) {
      setError('Az email vagy jelszó nem megfelelő.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Form component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <EuiText textAlign="center">
            <h1>Bejelentkezés</h1>
          </EuiText>
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

        {error.length > 0 && (
          <FormRow>
            <EuiText textAlign="center">
              <ErrorMessage>{error}</ErrorMessage>
            </EuiText>
          </FormRow>
        )}

        <EuiSpacer />
        <FancyButton fullWidth type="submit" isLoading={loading}>
          Bejelentkezés
        </FancyButton>
        <EuiSpacer />
        <EuiText>
          Nincs még fiókja? <Link to="/register">Regisztráljon</Link>
        </EuiText>
      </Form>
    </Page>
  );
}
