import { ReactNode, useMemo, useState } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

export interface DataTableColumn<T> {
  id: string;
  label: ReactNode;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  minWidth?: number;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string | number;
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  emptyState?: ReactNode;
}

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const DataTable = <T,>({
  columns,
  data,
  onRowClick,
  getRowId,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  initialRowsPerPage,
  emptyState,
}: DataTableProps<T>) => {
  const resolvedInitialRowsPerPage = useMemo(() => {
    if (initialRowsPerPage && rowsPerPageOptions.includes(initialRowsPerPage)) {
      return initialRowsPerPage;
    }
    return rowsPerPageOptions[0] ?? 5;
  }, [initialRowsPerPage, rowsPerPageOptions]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(resolvedInitialRowsPerPage);

  const paginatedData = useMemo(() => {
    if (rowsPerPage <= 0) {
      return data;
    }
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextRowsPerPage = Number(event.target.value);
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  };

  const resolveCellContent = (row: T, column: DataTableColumn<T>): ReactNode => {
    if (column.render) {
      return column.render(row);
    }
    const value = (row as Record<string, unknown>)[column.id];
    return (value as ReactNode) ?? null;
  };

  const renderRow = (row: T, index: number) => {
    const key = getRowId ? getRowId(row, index) : index;
    const clickable = Boolean(onRowClick);

    return (
      <TableRow
        key={key}
        hover={clickable}
        onClick={clickable ? () => onRowClick?.(row) : undefined}
        sx={clickable ? { cursor: 'pointer' } : undefined}
      >
        {columns.map((column) => (
          <TableCell key={column.id} align={column.align} sx={column.minWidth ? { minWidth: column.minWidth } : undefined}>
            {resolveCellContent(row, column)}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={column.minWidth ? { minWidth: column.minWidth } : undefined}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  {emptyState ?? (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No data available.
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => renderRow(row, page * rowsPerPage + index))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Paper>
  );
};

export default DataTable;

