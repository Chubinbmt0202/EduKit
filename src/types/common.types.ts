/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/common.types.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    statusCode: number;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}