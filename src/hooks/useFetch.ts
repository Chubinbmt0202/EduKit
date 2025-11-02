// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import { apiClient } from '../services';
// import type { ApiResponse } from '../types';

export const useFetch = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<T>(url);
                if (response.success) {
                    setData(response.data);
                } else {
                    setError(response.message || 'Lỗi tải dữ liệu');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};