import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { User } from '../../types';
import DataTable, { DataTableColumn } from '../common/DataTable';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  const columns: DataTableColumn<User>[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 160,
      render: (row) => <Typography fontWeight={600}>{row.name}</Typography>,
    },
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 160,
      render: (row) => row.phone ?? '-',
    },
    {
      id: 'role',
      label: 'Role',
      render: (row) => (
        <Typography sx={{ textTransform: 'capitalize' }}>{row.role}</Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Edit user">
            <IconButton onClick={() => onEdit(row)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete user">
            <IconButton onClick={() => onDelete(row)} size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      getRowId={(row) => row.id}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  );
};

export default UserTable;
