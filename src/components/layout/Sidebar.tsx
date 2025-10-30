import React from 'react';
import { Link } from 'react-router-dom';
import {
    UserOutlined,
    HistoryOutlined,
    FolderOpenOutlined,
    BookOutlined,
    CommentOutlined,
    // ⭐ ICONS MỚI ĐƯỢC THÊM
    SettingOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

interface CustomSidebarProps {
    collapsed: boolean;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ collapsed }) => {
    return (
        <Sider
            width={250}
            className="!bg-white border-r border-gray-200"
            trigger={null}
            collapsible
            collapsed={collapsed}
            // Style cố định vị trí
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 20, // Đảm bảo Sider nằm trên các nội dung khác
            }}
        >
            {/* KHU VỰC LOGO */}
            <div className={`p-2 mb-4 h-16 text-center transition-opacity duration-100`}>
                <h1 >
                    Logo
                </h1>
            </div>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    // --- NHÓM CHỨC NĂNG CHÍNH ---
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: <Link to="/">Trang chủ</Link>,
                    },
                    {
                        key: '4',
                        icon: <FolderOpenOutlined />,
                        label: <Link to="/folders">Bộ đề đã tạo</Link>,
                    },
                    {
                        type: 'divider', // Dùng để phân chia nhóm chức năng
                    },
                    // --- NHÓM HỖ TRỢ & CÀI ĐẶT ---
                    {
                        key: '3',
                        icon: <HistoryOutlined />,
                        label: <Link to="/history">Lịch sử</Link>,
                    },
                    {
                        key: '5',
                        icon: <BookOutlined />,
                        label: <Link to="/guides">Hướng dẫn sử dụng</Link>,
                    },
                    // ⭐ MỤC MỚI: HỖ TRỢ
                    {
                        key: 'help',
                        icon: <QuestionCircleOutlined />,
                        label: <Link to="/support">Hỗ trợ & FAQ</Link>,
                    },
                    {
                        key: '6',
                        icon: <CommentOutlined />,
                        label: <Link to="/feedback">Phản hồi và góp ý</Link>,
                    },
                    {
                        type: 'divider',
                    },
                    // ⭐ MỤC MỚI: CÀI ĐẶT
                    {
                        key: 'settings',
                        icon: <SettingOutlined />,
                        label: <Link to="/settings">Tài khoản của bạn</Link>,
                    },
                ]}
            />
        </Sider>
    );
};

export default CustomSidebar;