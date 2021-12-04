import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSave,
  faSearch,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { EuiLoadingSpinner } from '@elastic/eui';

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'primary' | 'danger';
  icon?: 'delete' | 'save' | 'new' | 'search';
  width?: 'normal' | 'wide';
  loading?: boolean;
}

const icons = {
  delete: faTrash,
  save: faSave,
  new: faPlus,
  search: faSearch,
};

const widthData = {
  normal: 60,
  wide: 140,
};

const Button = styled.button<{ padding: number }>`
  position: relative;
  text-decoration: none;
  font-family: 'Montserrat';
  min-width: 160px;
  height: 38px;
  padding: 10px ${props => props.padding}px;
  border-radius: 5px;
  text-align: center;
  color: #fff;
  max-width: fit-content;
  box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
    0 9px 45px 0 rgb(114 119 160 / 12%);
  background-color: ${props => {
    switch (props.color) {
      case 'primary':
        return `var(--accent)`;
      case 'danger':
        return `var(--danger)`;
    }
  }};
`;

const Icon = styled(FontAwesomeIcon)<{ hover?: boolean }>`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translate(-50%, -50%);
  line-height: 2.5;
  font-size: 20px;
  opacity: 0;
  transition: all 0.3s;
  ${props => props.hover && `top: 50%; opacity: 1;`}
`;

const Text = styled.span<{ hover?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  transition: all 0.3s;
  ${props => props.hover && `top: 30px; opacity: 0;`}
`;

const CustomButton: FunctionComponent<CustomButtonProps> = props => {
  const [hover, setHover] = useState(false);
  const width = widthData[props.width || 'normal'];
  
  return props.loading ? (
    <Button
      {...props}
      padding={width}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <EuiLoadingSpinner size="l" />
    </Button>
  ) : (
    <Button
      {...props}
      padding={width}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {props.icon && <Icon icon={icons[props.icon]} hover={hover} />}
      <Text hover={hover}>{props.children}</Text>
    </Button>
  );
};

export default CustomButton;
