// src/constants/app.constants.ts
export const APP_CONFIG = {
    APP_NAME: 'EduKit',
    APP_VERSION: '1.0.0',
    DEFAULT_LOCALE: 'vi',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
} as const;

export const CACHE_KEYS = {
    USER_PROFILE: 'user_profile',
    COURSES_LIST: 'courses_list',
    QUIZZES_LIST: 'quizzes_list',
} as const;