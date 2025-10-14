import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: _, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    // You can also log error messages to an error reporting service here
    // logErrorToMyService(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 500 }}>
            <Typography variant="h4" component="h1" gutterBottom color="error">
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry, but an unexpected error has occurred. Please try reloading the page.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReload}>
              Reload Page
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 3, textAlign: 'left', bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Error Details:
                </Typography>
                <Typography variant="body2" color="error" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mt: 1 }}>
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
