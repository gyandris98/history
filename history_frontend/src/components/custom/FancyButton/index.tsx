import { EuiLoadingSpinner } from '@elastic/eui';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface LoginButtonProps {
  fullWidth?: boolean;
  fill?: boolean;
  isLoading?: boolean;
}

const Button = styled.button<{ fullWidth: boolean; fill: boolean }>`
  text-decoration: none;
  font-family: 'Montserrat', sans serif;
  font-size: 16px;
  ${props => props.fullWidth && `width: 100%;`}
  ${props =>
    props.fill
      ? `
        background-color: var(--accent);
        color: #fff;
        &:hover {
            background-color: darken(var(--accent), 20%)
        }
        `
      : `
        border: 1px solid var(--accent);
        color: var(--accent);
        &:hover {
            background-color: var(--accent);
            color: #fff;
        }
  `}
  padding: 15px;
  border-radius: 30px;
`;

const FancyButton: FunctionComponent<
  LoginButtonProps & React.HTMLProps<HTMLButtonElement>
> = props => {
  const { isLoading } = props;
  return (
    <Button {...props}>
      {isLoading ? <EuiLoadingSpinner size="l" /> : props.children}
    </Button>
  );
};

export default FancyButton;
