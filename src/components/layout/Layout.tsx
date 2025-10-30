import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import CustomSidebar from './Sidebar';
import CustomHeader from './Header';

const { Content } = Layout;

// Component Layout tổng hợp tất cả
const CustomLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <CustomSidebar
                collapsed={collapsed}
            />
            <Layout>
                <CustomHeader
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    colorBgContainer={colorBgContainer}
                />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}

                </Content>
            </Layout>
        </Layout >
    );
};

export default CustomLayout;