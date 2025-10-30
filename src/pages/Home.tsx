// src/pages/Home.tsx

import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
    return (
        <Card title="🏠 Trang Chủ" >
            <Title level={4}>Chào mừng đến với Edukit!</Title>
            <Paragraph>
                Đây là khu vực nội dung chính của ứng dụng. Mọi nội dung của trang chủ sẽ được hiển thị tại đây.
            </Paragraph>
            <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-700">Hãy bắt đầu tạo Bộ đề và quản lý tài liệu của bạn.</p>
            </div>
        </Card>

    );
};

export default Home;