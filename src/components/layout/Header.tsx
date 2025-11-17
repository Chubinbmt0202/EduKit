/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CrownOutlined,
    UserOutlined,
    BellOutlined,
    LogoutOutlined,
    SettingOutlined,
    HeartFilled,
    LoginOutlined, // Thêm Icon Login
} from '@ant-design/icons';
import { Button, Layout, Avatar, Dropdown, type MenuProps, Badge, Space, List, Tag, message } from 'antd';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng đến trang Login
import { useAuth } from '../../context/AuthContext';
const { Header } = Layout;

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
    const { user, credits, logout } = useAuth();

    // render page when user is logged in or not
    useEffect(() => {
        // render something based on user state
        console.log('User state changed: ', user);
    }, [user]);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            localStorage.removeItem('user');
            logout();
            message.success('Đăng xuất thành công!');
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

    const renderAuthSection = () => {

        if (user) {
            // Hiển thị các mục khi ĐÃ đăng nhập
            return (
                <>
                    {/* Nút Nâng cấp */}
                    <Button type="primary" icon={<CrownOutlined />} className="bg-blue-500 hover:!bg-blue-600 hidden sm:flex items-center">
                        <span className="ml-1">Nâng cấp</span>
                    </Button>

                    {/* Số dư Credit/Kim cương */}
                    <Tag
                        icon={<HeartFilled />}
                        color="red"
                        className="flex items-center cursor-pointer"
                        style={{ padding: '6px 10px', fontSize: '14px', fontWeight: '500' }}
                    >
                        {credits}
                    </Tag>

                    {/* Thông báo */}
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

                    {/* Avatar và Menu Người dùng */}
                    <Dropdown menu={{ items: userMenu, onClick: handleMenuClick }} trigger={['click']}>
                        <Avatar
                            className="cursor-pointer bg-blue-500 flex items-center justify-center"
                            src={user?.picture}
                            icon={!user?.picture ? <UserOutlined /> : undefined}
                        >
                            {!user?.picture ? user?.name.charAt(0).toUpperCase() : null}
                        </Avatar>
                    </Dropdown>
                </>
            );
        } else {
            // Hiển thị nút ĐĂNG NHẬP khi CHƯA đăng nhập
            return (
                <Link to="/login">
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Đăng nhập
                    </Button>
                </Link>
            );
        }
    };

    return (
        <Header
            className="h-16 bg-white"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                padding: '1rem',
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
                    {/* RENDER DỰA TRÊN TRẠNG THÁI ĐĂNG NHẬP */}
                    {renderAuthSection()}
                </Space>
            </div>
        </Header>
    );
};

export default CustomHeader;