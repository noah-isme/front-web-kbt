import { AxiosError } from 'axios';

export interface NormalizedError {
  code?: string | number;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export const normalizeError = (error: unknown): NormalizedError => {
  if (error instanceof AxiosError) {
    const { response } = error;
    if (response) {
      const { data, status } = response;
      // Handle common API error structures
      if (data && typeof data === 'object') {
        if ('message' in data && typeof data.message === 'string') {
          return {
            code: status,
            message: data.message,
            fieldErrors: ('errors' in data && typeof data.errors === 'object') ? (data.errors as Record<string, string[]>) : undefined,
          };
        } else if ('detail' in data && typeof data.detail === 'string') {
          return {
            code: status,
            message: data.detail,
          };
        } else if ('non_field_errors' in data && Array.isArray(data.non_field_errors)) {
          return {
            code: status,
            message: data.non_field_errors.join(', '),
            fieldErrors: data as Record<string, string[]>
          };
        } else if (Object.keys(data).length > 0) {
          // If it's an object with other keys, assume they are field errors
          return {
            code: status,
            message: 'Validation Error',
            fieldErrors: data as Record<string, string[]>
          };
        }
      }
      // Fallback for known HTTP status codes
      switch (status) {
        case 400: return { code: 400, message: 'Bad Request' };
        case 401: return { code: 401, message: 'Unauthorized' };
        case 403: return { code: 403, message: 'Forbidden' };
        case 404: return { code: 404, message: 'Not Found' };
        case 500: return { code: 500, message: 'Internal Server Error' };
        default: return { code: status, message: `Request failed with status ${status}` };
      }
    }
    // Network error or request was cancelled
    if (error.code === 'ERR_NETWORK') {
      return { message: 'Network Error: Please check your internet connection.' };
    }
    if (error.message) {
      return { message: error.message };
    }
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unexpected error occurred.' };
};
