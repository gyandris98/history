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
} from '@elastic/eui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faSignOutAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import Search from '../Search/Search';

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
  margin-left: 20px;
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

const IconContainer = styled.div<{ open?: boolean }>`
  font-size: 20px;
  margin-left: auto;
  padding: 10px;
  border-radius: 100%;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  ${props =>
    props.open &&
    `
  background: #fff;
  color: var(--accent);
  `}
  &:hover {
    background: #fff;
    color: var(--accent);
    ${props =>
      props.open &&
      `
      opacity: 0.8;
    `}
  }
`;

interface NavbarProps {}

const Navbar: FunctionComponent<NavbarProps> = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isPopoverOpen, setPopover] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  const searchClick = () => {
    setSearchOpen(prev => !prev);
  };

  const closeSearch = () => {
    setSearchOpen(false);
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
    <>
      <Bar>
        <Link href="/">
          <Brand src="/images/logo-inverted.png" width="180px" height="34px" />
        </Link>{' '}
        {user && (
          <Link href="/admin">
            <AdminLink>Admin</AdminLink>
          </Link>
        )}
        <IconContainer onClick={searchClick} open={searchOpen}>
          <FontAwesomeIcon icon={faSearch} />
        </IconContainer>
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
      {searchOpen && <Search close={closeSearch} />}
    </>
  );
};

export default Navbar;
