import { Alert, AlertTitle } from '@mui/material';

const ErrorState = ({ title = 'Something went wrong', message }: { title?: string; message: string }) => (
  <Alert severity="error" sx={{ my: 2 }}>
    <AlertTitle>{title}</AlertTitle>
    {message}
  </Alert>
);

export default ErrorState;
