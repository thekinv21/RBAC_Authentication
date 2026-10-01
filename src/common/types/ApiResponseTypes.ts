export type TPaginationMeta = {
  total: number;
  count: number;
  offset: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

type TBaseApiResponse = {
  statusCode: number;
  timestamp: string;
};

export interface TApiResponse<T = unknown> extends TBaseApiResponse {
  success: true;
  data: T | null;
}

export interface TApiPaginatedResponse<T = unknown> extends TBaseApiResponse {
  success: true;
  data: T[];
  meta: TPaginationMeta;
}

export type TApiErrorDetail = {
  property?: string;
  message: string;
};

export interface TApiErrorResponse extends TBaseApiResponse {
  success: false;
  error: string;
  message: string;
  errors?: TApiErrorDetail[];
  path: string;
}
