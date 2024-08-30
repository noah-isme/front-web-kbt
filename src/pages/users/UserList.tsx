import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { User } from "../../types/UserTypes";
import { UserService } from "../../api/UserService";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUsers();
        setUsers(response);
        console.log(response);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <Button
        component={RouterLink}
        to="/user/new"
        variant="contained"
        color="primary"
        style={{ marginBottom: "20px" }}
      >
        Add New User
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.ID}>
                <TableCell>{user.ID}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    component={RouterLink}
                    to={`/user/edit/${user.ID}`}
                    variant="outlined"
                    color="primary"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserList;
