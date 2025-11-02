// src/constants/routes.ts
export const ROUTES = {
    HOME: '/',
    STUDENT: '/student',
    SEARCH: '/search',
    HISTORY: '/history',
    FOLDERS: '/folders',
    FOLDERS_QUIZZES: (id: string) => `/folders/quizzes/${id}`,
    GUIDES: '/guides',
    FEEDBACK: '/feedback',
    USER_PROFILE: '/user-profile',
    RECHARGE: '/recharge',
    NOT_FOUND: '*',
} as const;