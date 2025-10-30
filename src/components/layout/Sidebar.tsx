import React from 'react';
import { Link } from 'react-router-dom';
import {
    UserOutlined,
    SearchOutlined,
    HistoryOutlined,
    FolderOpenOutlined,
    BookOutlined,
    CommentOutlined
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
        >
            {/* KHU VỰC LOGO 
            1. Đặt padding và chiều cao cố định cho div bọc (ví dụ: h-16 ~ 64px, tương đương chiều cao Header)
            2. Sử dụng class 'invisible' (ẩn nội dung nhưng giữ không gian) hoặc 'opacity-0' (ẩn mờ) 
               khi bị collapsed. Sử dụng 'block' và 'visible' khi không collapsed.
            */}
            <div className={`p-2 mb-4 h-16 text-center transition-opacity duration-100`}>
                <h1 >
                    Logo
                </h1>
            </div>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined />,
                        label: <Link to="/">Trang chủ</Link>,
                    },
                    {
                        key: '2',
                        icon: <SearchOutlined />,
                        label: <Link to="/search">Tìm kiếm</Link>,
                    },
                    {
                        key: '3',
                        icon: <HistoryOutlined />,
                        label: <Link to="/history">Lịch sử</Link>,
                    },
                    {
                        key: '4',
                        icon: <FolderOpenOutlined />,
                        label: <Link to="/folders">Bộ đề đã tạo</Link>,
                    },
                    {
                        key: '5',
                        icon: <BookOutlined />,
                        label: <Link to="/guides">Hướng dẫn sử dụng</Link>,
                    },
                    {
                        key: '6',
                        icon: <CommentOutlined />,
                        label: <Link to="/feedback">Phản hồi và góp ý</Link>,
                    },
                ]}
            />
        </Sider>
    );
};

export default CustomSidebar;