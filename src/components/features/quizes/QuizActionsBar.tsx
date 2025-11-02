// src/components/features/quizes/QuizActionsBar.tsx
import React from 'react';
import { Button, Space, Tag } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface QuizActionsBarProps {
    // Thêm các props cần thiết, ví dụ như tiêu đề quiz hoặc trạng thái loading
    quizTitle?: string;
    onPublish: () => void;
}

const QuizActionsBar: React.FC<QuizActionsBarProps> = ({
    quizTitle = "Bộ đề: TOÁN - Bảng Cộng Qua 10",
    onPublish
}) => {
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
                onClick={onPublish}
            >
                Xuất bản Bộ đề
            </Button>
        </div>
    );
};

export default QuizActionsBar;