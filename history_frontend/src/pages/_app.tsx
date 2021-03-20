import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { FunctionComponent, useEffect } from 'react';
import { EuiErrorBoundary } from '@elastic/eui';
import styled from 'styled-components';
import './app.scss';
import './index.scss';

import Chrome from '../components/chrome';
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
`;

loadUser();

/**
 * Next.js uses the App component to initialize pages. You can override it
 * and control the page initialization. Here use use it to render the
 * `Chrome` component on each page, and apply an error boundary.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-app
 */
const EuiApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    loadUser();
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Head>
            {/* You can override this in other pages - see page-2.tsx for an example */}
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
            {/* <Chrome>
            <EuiErrorBoundary> */}
            <Component {...pageProps} />
            {/* </EuiErrorBoundary>
          </Chrome> */}
          </Page>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};

export default EuiApp;
