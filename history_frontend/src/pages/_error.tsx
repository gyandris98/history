import React, { FunctionComponent } from 'react';
import Error, { ErrorProps } from 'next/error';

const ErrorWrapper: FunctionComponent<ErrorProps> = ({ statusCode }) => {
  return <Error statusCode={statusCode} />;
};

// @ts-ignore getInitialProps doesn't exist on FunctionComponent
ErrorWrapper.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorWrapper;
