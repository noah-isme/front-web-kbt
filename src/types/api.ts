export type ApiResponse<T> = {
  data: T;
  message?: string;
  error?: string;
  meta?: Record<string, unknown>;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;
