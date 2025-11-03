/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/features/quizes/QuizActionsBar.tsx
import React, { useState } from 'react';
import { Button, Space, Tag } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type { User } from '../../../types/user.types';
import LoginNotiModal from '../lectures/LoginNotiModal';

interface QuizActionsBarProps {
    // Thêm các props cần thiết, ví dụ như tiêu đề quiz hoặc trạng thái loading
    quizTitle?: string;
    onPublish: () => void;
}

const QuizActionsBar: React.FC<QuizActionsBarProps> = ({
    quizTitle = "Bộ đề: TOÁN - Bảng Cộng Qua 10"
}) => {
    const [isVisibleLoginNoti, setIsVisibleLoginNoti] = useState(false);
    const [user] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Failed to parse user data from localStorage", e);
            return null;
        }
    });

    const handlePublish = () => {
        if (!user) {
            setIsVisibleLoginNoti(true);
            return;
        }
    }
    return (
        <div className="flex justify-between items-center mb-4">
            <Space size="large">
                <Tag color="blue" style={{ fontSize: '16px', padding: '4px 8px' }}>
                    {quizTitle}
                </Tag>
            </Space>
            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handlePublish}
            >
                Xuất bản Bộ đề
            </Button>

            <LoginNotiModal isVisible={isVisibleLoginNoti} onClose={() => setIsVisibleLoginNoti(false)} onNavigateToTopUp={function (): void {
                throw new Error('Function not implemented.');
            }} />
        </div>
    );
};

export default QuizActionsBar;