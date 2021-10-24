import React from 'react';
import NoSSR from '../noSSR';
import { AppProps } from 'next/app';
// import { authOnlyProps } from '../../lib/auth';
import { NextComponentType, NextPageContext } from 'next';
import styled from 'styled-components';

interface AdminProps {
  Component?: NextComponentType<NextPageContext, any, {}>;
  pageProps?: any;
}

const Wrapper = styled.div`
  background-color: #eff0f4;
`;

export const Admin: React.FC<AdminProps> = ({
  Component,
  pageProps,
  children,
}) => {
  return <NoSSR>{Component ? <Component {...pageProps} /> : children}</NoSSR>;
};

// export const getServerSideProps = authOnlyProps;
