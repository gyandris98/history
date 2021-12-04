import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faThList,
  faPlusCircle,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavItem = styled.div<{ active: boolean }>`
  width: 200px;
  cursor: pointer;
  color: var(--accent);
  border-radius: 5px;
  font-weight: bold;
  padding: 15px;
  margin-bottom: 10px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  ${props =>
    props.active &&
    `
        background-color: #fff;
        box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%), 0 9px 45px 0 rgb(114 119 160 / 12%);
    `}
  &:hover {
    background-color: #fff;
    box-shadow: 0 24px 24px -18px rgb(69 104 129 / 33%),
      0 9px 45px 0 rgb(114 119 160 / 12%);
  }
`;

const Icon = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const navoptions = [
  {
    path: '/',
    link: '/',
    name: 'Áttekintés',
    icon: faThList,
  },
  {
    path: 'users',
    link: '/users',
    name: 'Felhasználók',
    icon: faUsers,
  },
];

const customPages = {
  new: {
    name: 'Új cikk',
    link: '/articles/new',
    icon: faPlusCircle,
  },
  edit: {
    name: 'Szerkesztés',
    link: '/',
    icon: faEdit,
  },
};

interface AdminNavProps {
  path: string;
}

const AdminNav: FunctionComponent<AdminNavProps> = ({ path }) => {
  return (
    <Container>
      {navoptions.map((item, key) => (
        <Link to={item.link} key={key}>
          <NavItem active={path === item.path}>
            <Icon icon={item.icon} /> {item.name}
          </NavItem>
        </Link>
      ))}
      {customPages[path] && (
        <Link to={customPages[path].link}>
          <NavItem active>
            <Icon icon={customPages[path].icon} /> {customPages[path].name}
          </NavItem>
        </Link>
      )}
    </Container>
  );
};

export default AdminNav;
