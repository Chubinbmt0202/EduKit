import React, { useMemo } from 'react'; // Import useMemo
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import {
    UserOutlined,
    HistoryOutlined,
    FolderOpenOutlined,
    BookOutlined,
    CommentOutlined,
    QuestionCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

interface CustomSidebarProps {
    collapsed: boolean;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ collapsed }) => {
    const location = useLocation();
    const getSelectedKey = useMemo(() => {
        const path = location.pathname;
        const pathKeyMap: { [key: string]: string } = {
            '/': '1',
            '/folders': '4',
            '/history': '3',
            '/UserGuide': '5',
            '/support': 'help',
            '/feedback': '6',
            '/user-profile': 'user-profile',
        };
        const key = pathKeyMap[path] || '';
        if (!key && path.startsWith('/folders')) {
            return ['4'];
        }
        return [key || '1'];

    }, [location.pathname]); // Phụ thuộc vào thay đổi path

    return (
        <Sider
            width={250}
            className="!bg-white border-r border-gray-200"
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 20,
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
                // ⭐ BƯỚC 3: Thay thế defaultSelectedKeys bằng selectedKeys ⭐
                // và truyền giá trị đã tính toán dựa trên URL
                selectedKeys={getSelectedKey}
                items={[
                    // --- NHÓM CHỨC NĂNG CHÍNH ---
                    {
                        key: '1',
                        icon: <HomeOutlined />,
                        label: <Link to="/">Tạo bộ đề</Link>,
                    },
                    {
                        key: '4',
                        icon: <FolderOpenOutlined />,
                        label: <Link to="/folders">Quản lý bộ đề</Link>,
                    },
                    {
                        type: 'divider',
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
                        label: <Link to="/UserGuide">Hướng dẫn sử dụng</Link>,
                    },
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
                        key: 'user-profile',
                        icon: <UserOutlined />,
                        label: <Link to="/user-profile">Tài khoản của bạn</Link>,
                    },
                ]}
            />
        </Sider>
    );
};

export default CustomSidebar;