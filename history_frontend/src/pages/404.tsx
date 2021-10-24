import React, { Fragment, FunctionComponent } from 'react';
import { EuiEmptyPrompt } from '@elastic/eui';
import Link from 'next/link';
import FancyButton from './../components/custom/FancyButton/index';

const NotFoundPage: FunctionComponent = () => (
  <EuiEmptyPrompt
    iconType="editorStrike"
    title={<h2>Itt nincs semmi.</h2>}
    body={
      <Fragment>
        <p>Ez az oldal nem létezik.</p>
      </Fragment>
    }
    actions={
      <Link href="/">
        <FancyButton>Vissza a főoldalra</FancyButton>
      </Link>
    }
  />
);

export default NotFoundPage;
