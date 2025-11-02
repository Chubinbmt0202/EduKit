/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
import { API_CONFIG } from '../constants/api.constants';
import type { ApiResponse } from '../types';

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    async get<T>(url: string): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
        });
        return response.json();
    }

    async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'PUT',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'DELETE',
            headers: API_CONFIG.HEADERS,
        });
        return response.json();
    }
}

export const apiClient = new ApiService();