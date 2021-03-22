import React, { FunctionComponent, useEffect } from 'react';
import { contextAuth, handleUserResponseRefresh } from '../../lib/auth';

interface AuthenticatedProps {
  token: string;
  refreshToken: any;
}

const Authenticated: FunctionComponent<AuthenticatedProps> = ({
  children,
  token,
  refreshToken,
}) => {
  useEffect(() => {
    handleUserResponseRefresh({ accessToken: token, refreshToken });
  }, []);
  return <>{children}</>;
};

export const getServerSideProps = async context => {
  const notLoggedIn = await contextAuth(context);
  if (!notLoggedIn.token) return notLoggedIn;

  return {
    props: notLoggedIn,
  };
};

export default Authenticated;
