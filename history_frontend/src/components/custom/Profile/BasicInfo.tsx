import {
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiPage,
  EuiText,
  EuiSpacer,
} from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import FancyButton from '../../../components/custom/FancyButton';
import { useAuth } from '../../../lib/auth';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { formatError } from '../../../lib/validation';
import CustomButton from '../CustomButton';

export interface IBasicInfoInput {
  name: string;
  email: string;
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

interface BasicInfoProps {
  onSubmit: (data: IBasicInfoInput) => void;
  loading: boolean;
}

const prettyValidation = formatError('profile');
console.log(prettyValidation);

const BasicInfo: FunctionComponent<BasicInfoProps> = ({
  onSubmit,
  loading = false,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    errors: infoErrors,
    register: infoRegister,
    handleSubmit: infoHandleSubmit,
  } = useForm<IBasicInfoInput>({
    defaultValues: {
      email: user.email,
      name: user.unique_name,
    },
  });
  return (
    <Wrapper>
      <Form component="form" onSubmit={infoHandleSubmit(onSubmit)}>
        <FormRow>
          <EuiText textAlign="center">
            <h1>Profil</h1>
          </EuiText>
        </FormRow>
        <FormRow
          label="Teljes név"
          isInvalid={!!infoErrors.name}
          error={prettyValidation({
            error: infoErrors.name,
            field: 'name',
          })}>
          <EuiFieldText
            name="name"
            inputRef={infoRegister({
              minLength: 2,
              maxLength: 64,
              required: true,
            })}
            isInvalid={!!infoErrors.name}
            fullWidth
          />
        </FormRow>
        <FormRow
          label="Email cím"
          isInvalid={!!infoErrors.email}
          error={prettyValidation({
            error: infoErrors.email,
            field: 'email',
          })}>
          <EuiFieldText
            name="email"
            inputRef={infoRegister({
              pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              required: true,
            })}
            isInvalid={!!infoErrors.email}
            fullWidth
          />
        </FormRow>
        <EuiSpacer />
        <CustomButton
          type="submit"
          color="primary"
          icon="save"
          loading={loading}>
          Mentés
        </CustomButton>
      </Form>
    </Wrapper>
  );
};

export default BasicInfo;
