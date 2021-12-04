import App from 'next/app';
import Head from 'next/head';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import './app.scss';
import './index.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, loadUser } from '../lib/auth';
import Navbar from '../components/custom/Navbar';

const queryClient = new QueryClient();

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #fafbfd;
  background-color: #eff0f4;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

loadUser();

const EuiApp = ({ Component, pageProps }) => {
  useEffect(() => {
    loadUser();
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Head>
            <title>History</title>
            <link rel="preconnect" href="https://fonts.gstatic.com"></link>
            <link
              href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;800;900&amp;display=swap"
              rel="stylesheet"></link>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#5bbad5"
            />
            <meta name="theme-color" content="#ffffff" />
          </Head>
          <Page>
            <Navbar />
            <Component {...pageProps} />
          </Page>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};

EuiApp.getInitialProps = async appContext => {
  const appProps = await App.getInitialProps(appContext);
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { ...appProps, ...pageProps };
};

export default EuiApp;
