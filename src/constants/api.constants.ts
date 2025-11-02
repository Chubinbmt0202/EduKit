// src/constants/api.constants.ts
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USERS: {
        GET_PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        GET_BY_ID: (id: string) => `/users/${id}`,
    },
    COURSES: {
        LIST: '/courses',
        GET_DETAIL: (id: string) => `/courses/${id}`,
        CREATE: '/courses',
    },
    QUIZ: {
        LIST: '/quizzes',
        GET_DETAIL: (id: string) => `/quizzes/${id}`,
        SUBMIT: (id: string) => `/quizzes/${id}/submit`,
    },
} as const;