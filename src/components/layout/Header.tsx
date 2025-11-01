import React from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CrownOutlined,
    UserOutlined,
    BellOutlined,
    LogoutOutlined,
    SettingOutlined,
    HeartFilled, // ⭐ 1. Thêm icon kim cương
} from '@ant-design/icons';
import { Button, Layout, Avatar, Dropdown, type MenuProps, Badge, Space, List, Tag } from 'antd';

const { Header } = Layout;

// --- Giả lập dữ liệu ---
// Trong ứng dụng thực tế, dữ liệu này sẽ đến từ API hoặc state management
const currentUser = {
    name: 'Chubinbmt0202',
    avatarUrl: null,
    diamondBalance: 0, // ⭐ 2. Thêm số dư kim cương cho người dùng
};
const notificationCount = 5;
const notifications = [
    'Bạn có một bài tập mới.',
    'Thông báo bảo trì hệ thống vào 3h sáng.',
    'Chào mừng bạn đến với EduKit!',
];

interface CustomHeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ collapsed, setCollapsed }) => {

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            console.log('Logging out...');
        }
    };

    const userMenu: MenuProps['items'] = [
        { key: 'profile', label: 'Hồ sơ của tôi', icon: <UserOutlined /> },
        { key: 'settings', label: 'Cài đặt', icon: <SettingOutlined /> },
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
    ];

    const notificationDropdownContent = (
        <div className="bg-white shadow-lg rounded-lg border border-gray-300" style={{ width: 300 }}>
            <List
                header={<div className="font-bold px-4">Thông báo</div>}
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item style={{ padding: '1rem' }} className="px-4 hover:bg-gray-50 cursor-pointer">
                        {item}
                    </List.Item>
                )}
                footer={<div className="text-center"><a href="#" className="text-blue-500">Xem tất cả</a></div>}
            />
        </div>
    );

    return (
        <Header
            className="h-16 px-4 bg-white"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: '#fff',
                borderBottom: '1px solid #f0f0f0',
            }}
        >
            <div className="flex justify-between items-center h-full">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px', width: 50, height: 50 }}
                />

                <Space size="middle" align="center">
                    {/* ⭐ 3. LOGIC HIỂN THỊ KIM CƯƠNG */}
                    <Button type="primary" icon={<CrownOutlined />} className="bg-blue-500 hover:!bg-blue-600 hidden sm:flex items-center">
                        <span className="ml-1">Nâng cấp</span>
                    </Button>
                    {currentUser.diamondBalance > -1 && (
                        <Tag
                            icon={<HeartFilled />}
                            color="red"
                            className="flex items-center cursor-pointer"
                            style={{ padding: '6px 10px', fontSize: '14px', fontWeight: '500' }}
                        >
                            {/* Định dạng số cho dễ đọc, ví dụ: 1,250 */}
                            {currentUser.diamondBalance.toLocaleString()}
                        </Tag>
                    )}
                    <Dropdown dropdownRender={() => notificationDropdownContent} trigger={['click']}>
                        <Badge count={notificationCount} offset={[-5, 8]}>
                            <Button
                                type="text"
                                shape="circle"
                                icon={<BellOutlined style={{ fontSize: '18px' }} />}
                                size="large"
                            />
                        </Badge>
                    </Dropdown>

                    <Dropdown menu={{ items: userMenu, onClick: handleMenuClick }} trigger={['click']}>
                        <Avatar
                            className="cursor-pointer bg-blue-500 flex items-center justify-center"
                            src={currentUser.avatarUrl}
                            icon={!currentUser.avatarUrl ? <UserOutlined /> : undefined}
                        >
                            {!currentUser.avatarUrl ? currentUser.name.charAt(0).toUpperCase() : null}
                        </Avatar>
                    </Dropdown>
                </Space>
            </div>
        </Header>
    );
};

export default CustomHeader;