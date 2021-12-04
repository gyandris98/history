import { EuiFlexGroup, EuiFlexItem, EuiGlobalToastList } from '@elastic/eui';
import React, { FunctionComponent, useState } from 'react';
import { handleUserResponse, useAuth } from '../lib/auth';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import BasicInfo from '../components/custom/Profile/BasicInfo';
import { IBasicInfoInput } from './../components/custom/Profile/BasicInfo';
import Password from '../components/custom/Profile/Password';
import { IPasswordInput } from './../components/custom/Profile/Password';
import usersAPI from '../api/users';

interface IFormInput {
  name: string;
  email: string;
}

const Page = styled.div`
  margin-top: 50px;
`;

interface profileProps {}

const prefabToasts = {
  infoConfirmed: {
    title: 'Siker',
    color: 'success',
    iconType: 'check',
    text: <p>Az adatainak mentése sikeres volt</p>,
  },
  passwordConfirmed: {
    title: 'Siker',
    color: 'success',
    iconType: 'check',
    text: <p>A jelszavának megváltoztatása sikeres volt</p>,
  },
  infoError: {
    title: 'Hiba',
    color: 'danger',
    iconType: 'alert',
    text: <p>Az adatainak mentése sikertelen volt</p>,
  },
  passwordError: {
    title: 'Hiba',
    color: 'danger',
    iconType: 'alert',
    text: <p>A jelszavának megváltoztatása sikertelen volt</p>,
  },
};

const profile: FunctionComponent<profileProps> = () => {
  const { user } = useAuth();
  if (!user) return null;
  const [toasts, setToasts] = useState([]);
  const [infoLoading, setInfoLoading] = useState(false);
  const removeToast = removedToast => {
    setToasts(toasts.filter(toast => toast.id !== removedToast.id));
  };

  const onBasicInfoSubmit = async (data: IBasicInfoInput) => {
    setInfoLoading(true);
    try {
      const token = await usersAPI.changeInfo(
        data.name,
        data.email,
        user.token
      );
      setToasts(prev => [...prev, prefabToasts.infoConfirmed]);
      await handleUserResponse(token);
    } catch (error) {
      setToasts(prev => [...prev, prefabToasts.infoError]);
    } finally {
      setInfoLoading(false);
    }
  };
  const onPasswordSubmit = async (data: IPasswordInput) => {
    try {
      await usersAPI.changePassword(data.newPassword, user.token);
      setToasts(prev => [...prev, prefabToasts.passwordConfirmed]);
    } catch (error) {
      setToasts(prev => [...prev, prefabToasts.passwordError]);
    }
  };

  return (
    <Page>
      <EuiFlexGroup direction="row">
        <EuiFlexItem>
          <BasicInfo onSubmit={onBasicInfoSubmit} loading={infoLoading} />
        </EuiFlexItem>
        <EuiFlexItem>
          <Password onSubmit={onPasswordSubmit} />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={removeToast}
        toastLifeTimeMs={6000}
      />
    </Page>
  );
};

export default profile;
