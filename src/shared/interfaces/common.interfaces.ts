// Common interfaces for API responses
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// Common query parameters
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Entity status interface
export interface StatusEntity {
  status?: boolean;
}

// Date range interface for filtering
export interface DateRangeQuery {
  startDate?: Date;
  endDate?: Date;
}
