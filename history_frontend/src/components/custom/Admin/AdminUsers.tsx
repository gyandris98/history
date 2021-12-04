import {
  EuiSelect,
  EuiOverlayMask,
  EuiConfirmModal,
  EuiBasicTable,
} from '@elastic/eui';
import { useRouter } from 'next/router';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import usersAPI, { IUser, roleOptions } from '../../../api/users';
import { useAuth } from '../../../lib/auth';
import AdminLayout from '../../layouts/AdminLayout';
import styled from 'styled-components';
import CustomButton from '../CustomButton';
import Spinner from '../Spinner';

interface AdminUsersProps {}

const Wrapper = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
`;

const DeleteButton = styled(CustomButton)`
  margin-top: 20px;
`;

const AdminUsers: FunctionComponent<AdminUsersProps> = () => {
  const { user } = useAuth();
  if (!user) return null;
  const router = useRouter();
  const [items, setItems] = useState<IUser[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const query = useQuery(['users', { pageNumber, pageSize }], async _ => {
    const data = await usersAPI.fetchUsers({ pageNumber, pageSize });
    setItems(data.users);
    setPageNumber(data.pageNumber);
    setTotalCount(data.totalCount);
    setPageSize(pageSize);
    return data;
  });

  useEffect(() => {
    if (query.error) {
      router.push('/login');
    }
  }, [query.error]);

  const closeDeleteModal = () => {
    setDeleteOpen(false);
  };
  const onDelete = async () => {
    const ids = selectedItems.map(item => item.id);
    try {
      await usersAPI.deleteUsers(ids);
      setSelectedItems([]);
      setItems(items => items.filter(item => !ids.includes(item.id)));
      closeDeleteModal();
    } catch (error) {}
  };

  const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
  const onSelectionChange = selectedItems => {
    setSelectedItems(selectedItems);
  };

  const selection = {
    onSelectionChange: onSelectionChange,
    initialSelected: selectedItems,
    selectable: _ => true,
  };

  const onTableChange = async ({ page }) => {
    setPageNumber(page.index + 1);
    setPageSize(page.size);
  };

  const onRoleSelectChange = async (e, item) => {
    try {
      const user = await usersAPI.changeRole(item.id, e.target.value);
      setItems(prev => prev.map(item => (item.id === user.id ? user : item)));
    } catch (error) {}
  };

  const columns = [
    {
      field: 'name',
      name: 'Név',
    },
    {
      field: 'email',
      name: 'Email',
    },
    {
      field: 'role',
      name: 'Hozzáférés',
      render: (role, item) =>
        user.role === 'Admin' ? (
          <EuiSelect
            options={roleOptions}
            value={role.name}
            onChange={e => onRoleSelectChange(e, item)}
          />
        ) : (
          role.title
        ),
    },
  ];

  const getRowProps = item => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: () => {},
    };
  };

  const getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      className: 'customCellClass',
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
    };
  };
  const pagination = {
    pageIndex: pageNumber - 1,
    pageSize,
    totalItemCount: totalCount,
    pageSizeOptions: [10, 20, 50],
  };
  return (
    <AdminLayout path="users">
      {deleteOpen && (
        <EuiOverlayMask>
          <EuiConfirmModal
            title={`Felhasználók törlése`}
            onCancel={closeDeleteModal}
            onConfirm={onDelete}
            cancelButtonText="Mégse"
            confirmButtonText="Törlés"
            buttonColor="danger"
            defaultFocusedButton="confirm">
            <p>
              {selectedItems.length} felhasználót törölni fogunk a rendszerből.
            </p>
            <p>Biztosan ki akarja törölni őket?</p>
          </EuiConfirmModal>
        </EuiOverlayMask>
      )}
      <Wrapper>
        {items.length === 0 ? (
          <Spinner />
        ) : (
          <EuiBasicTable
            items={items}
            rowHeader="Név"
            columns={columns}
            rowProps={getRowProps}
            cellProps={getCellProps}
            pagination={pagination}
            onChange={onTableChange}
            selection={selection}
            isSelectable={true}
            itemId="id"
          />
        )}
        <style jsx>
          {`
            .customCellClass {
              font-size: 16px;
            }
          `}
        </style>
        {selectedItems.length > 0 && (
          <DeleteButton
            color="danger"
            icon="delete"
            onClick={() => setDeleteOpen(true)}>
            Törlés
          </DeleteButton>
        )}
      </Wrapper>
    </AdminLayout>
  );
};

export default AdminUsers;
