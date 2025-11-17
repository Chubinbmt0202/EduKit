/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
    picture: string;
}

interface AuthContextType {
    user: User | null;
    credits: number;
    login: (userData: User, userCredits: number) => void;
    logout: () => void;
    setCredits: (newCredits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hàm tiện ích để lấy dữ liệu user từ LocalStorage
const getInitialUser = (): User | null => {
    const storedUser = localStorage.getItem('user');
    try {
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
        return null;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(getInitialUser());
    const [credits, setCredits] = useState<number>(0);

    const userId = user?.id;

    // 1. Tải Credits ban đầu khi User thay đổi (Sau khi app load hoặc đăng nhập)
    useEffect(() => {
        if (!userId) {
            setCredits(0);
            return;
        }

        const fetchCredits = async () => {
            try {
                // Sử dụng endpoint bảo mật chỉ lấy credits của người đang đăng nhập
                // Yêu cầu bạn đã sửa route backend thành GET /api/users/credits (không có :userId)
                const response = await axios.get(`http://localhost:5000/api/users/credits`, {
                    withCredentials: true
                });

                if (typeof response.data.credits === 'number') {
                    setCredits(response.data.credits);
                }
            } catch (error) {
                console.error("Error fetching user credits from API:", error);
                setCredits(0);
            }
        };

        fetchCredits();
    }, [userId]); // Chạy lại khi user (đăng nhập/đăng xuất) thay đổi

    const login = (userData: User, userCredits: number) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setCredits(userCredits);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setCredits(0);
    };

    return (
        <AuthContext.Provider value={{ user, credits, login, logout, setCredits }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook để sử dụng Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};