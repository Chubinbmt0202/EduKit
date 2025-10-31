import React from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CrownOutlined,
    UserOutlined,
    BellOutlined,
} from '@ant-design/icons';
import { Button, Layout, Avatar } from 'antd';

const { Header } = Layout;

interface CustomHeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    colorBgContainer: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ collapsed, setCollapsed }) => {
    return (
        <Header
            // Đảm bảo Header full width và có chiều cao cố định
            className="h-16"
            // ⭐ CHỈNH SỬA TẠI ĐÂY: Cố định Header ở trên cùng
            style={{
                padding: 0,
                background: 'white',
                position: 'sticky', // Hoặc 'fixed'
                top: 0,
                zIndex: 10, // Đảm bảo nó nằm trên Content
            }}
        >
            {/* Sử dụng FLEXBOX để chia thành 2 phần: Trái (Collapse) và Phải (Các nút tính năng) */}
            <div className="flex justify-between items-center h-full px-4">

                {/* 1. KHU VỰC BÊN TRÁI: Nút Collapse */}
                <div className="flex items-center">
                    <Button
                        type="text"
                        className="focus:outline-none hover:!bg-transparent active:!bg-transparent hover:!border-transparent"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 50,
                            height: 50,
                            outline: 'none',
                        }}
                    />
                </div>

                {/* 2. KHU VỰC BÊN PHẢI: Các nút tính năng (Nâng cấp, Email, Bell, Avatar) */}
                <div className="flex items-center space-x-4 mr-6">

                    {/* Nút Nâng cấp (Upgrade Button) */}
                    <Button style={{ outline: 'none', padding: '18px 12px' }} type="primary" size="small" className="bg-blue-500 hover:!bg-blue-600 flex items-center space-x-1">
                        <CrownOutlined /> Nâng cấp
                    </Button>

                    {/* Chuông thông báo (Bell Icon) - Dùng Button loại text để không có viền */}
                    <Button
                        style={{ outline: 'none' }}
                        type="text"
                        icon={<BellOutlined />}
                        className="focus:outline-none hover:!bg-gray-100 active:!bg-gray-200"
                    />

                    {/* Avatar (Có thể dùng ảnh hoặc ký tự) */}
                    <Avatar
                        className="cursor-pointer bg-blue-500"
                        icon={<UserOutlined />}
                        alt="User"
                    />
                </div>

            </div>
        </Header>
    );
};

export default CustomHeader;