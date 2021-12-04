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
import { Link } from 'react-router-dom';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import FancyButton from '../FancyButton';
import { formatError } from '../../../lib/validation';
import { useHistory } from 'react-router-dom';

const Page = styled.div`
  padding: 14px;
  display: flex;
`;

const Form = styled(EuiForm)`
  width: 100%;
  max-width: 800px;
`;

const FormRow = styled(EuiFormRow)`
  width: 800px;
`;

const ErrorMessage = styled.p`
  color: var(--accent);
  margin-bottom: 0.5rem !important;
`;

interface IFormInput {
  name: string;
  email: string;
  password: string;
}

const formatValidation = formatError('register');

export default function register() {
  const { register: registerFn } = useAuth();
  const { errors, register, handleSubmit } = useForm<IFormInput>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function onSubmit(data: IFormInput) {
    try {
      setLoading(true);
      const res = await registerFn(data);
      history.push('/');
    } catch (error) {
      setError('Regisztráció sikertelen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
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

        <EuiSpacer />
        {error.length > 0 && (
          <FormRow>
            <EuiText textAlign="center">
              <ErrorMessage>{error}</ErrorMessage>
            </EuiText>
          </FormRow>
        )}
        <FancyButton fullWidth type="submit" isLoading={loading}>
          Regisztráció
        </FancyButton>
        <EuiSpacer />
        <EuiText>
          Van már fiókja? <Link to="/login">Lépjen be</Link>
        </EuiText>
      </Form>
    </Page>
  );
}
