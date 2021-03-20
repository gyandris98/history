import { EuiLoadingSpinner } from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

interface SpinnerProps {}

const Spinner: FunctionComponent<SpinnerProps> = () => {
  return (
    <Container>
      <EuiLoadingSpinner size="xl" />
    </Container>
  );
};

export default Spinner;
