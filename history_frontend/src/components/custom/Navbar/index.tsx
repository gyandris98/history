import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/auth';
import Link from 'next/link';
import {
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiPopover,
  EuiTextColor,
} from '@elastic/eui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faUser,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

const Bar = styled.div`
  background-color: var(--accent);
  color: #fff;
  width: 100%;
  max-width: 1000px;
  margin: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Brand = styled(Image)`
  cursor: pointer;
`;

const AdminLink = styled.div`
  color: #fff;
  margin-left: 20px;
  opacity: 0.6;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const User = styled.div`
  padding: 10px;
  border-radius: 5px;
  border 1px solid #fff;
  cursor: pointer;
  &:hover {
    background-color: #fff;
    color: #000;
  }
`;

const PopoverWrapper = styled.div`
  margin-left: auto;
`;

const ContextMenuItem = styled(EuiContextMenuItem)`
  text-decoration: none !important;
  ${props => props.color && `color: ${props.color};`}
  &:hover {
    background-color: #cccccc !important;
  }
  &:focus {
    background: none !important;
  }
`;

interface NavbarProps {}

const Navbar: FunctionComponent<NavbarProps> = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isPopoverOpen, setPopover] = useState(false);
  const onButtonClick = () => {
    setPopover(!isPopoverOpen);
  };

  const closePopover = () => {
    setPopover(false);
  };
  const handleLogout = () => {
    router.push('/');
    logout();
  };
  const button = user ? (
    <User onClick={onButtonClick}>{user.unique_name}</User>
  ) : null;
  const items = [
    <ContextMenuItem
      key="profile"
      icon={<FontAwesomeIcon icon={faUserCircle} />}
      onClick={() => {
        router.push('/profile');
        closePopover();
      }}>
      Profil
    </ContextMenuItem>,
    <ContextMenuItem
      color="red"
      key="logout"
      icon={<FontAwesomeIcon icon={faSignOutAlt} />}
      onClick={() => {
        closePopover();
        handleLogout();
      }}>
      Kijelentkezés
    </ContextMenuItem>,
  ];
  return (
    <Bar>
      <Brand
        src="/images/logo-inverted.png"
        width="180px"
        height="34px"
        onClick={() => router.push('/')}
      />{' '}
      {user && (
        <Link href="/admin">
          <AdminLink>Admin</AdminLink>
        </Link>
      )}
      {user && (
        <PopoverWrapper>
          <EuiPopover
            id="singlePanel"
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft">
            <EuiContextMenuPanel items={items} hasFocus={false} />
          </EuiPopover>
        </PopoverWrapper>
      )}
    </Bar>
  );
};

export default Navbar;
