// src/services/authService.ts
import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants';
import type { LoginRequest, LoginResponse, User } from '../types';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        if (response.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getProfile: async (): Promise<User> => {
        const response = await apiClient.get<User>(API_ENDPOINTS.USERS.GET_PROFILE);
        return response.data;
    },
};