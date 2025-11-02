// src/utils/helpers.ts
export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('vi-VN');
};

export const truncateString = (str: string, length: number): string => {
    return str.length > length ? str.substring(0, length) + '...' : str;
};

export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};