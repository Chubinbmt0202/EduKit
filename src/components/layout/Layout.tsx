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

    // Chiều rộng của Sider khi không/có collapse
    const siderWidth = 250;
    const collapsedWidth = 80; // Ant Design default

    return (
        <Layout style={{ minHeight: '100vh', flexDirection: 'row' }}>
            {/* 1. Sidebar cố định */}
            <CustomSidebar
                collapsed={collapsed}
            />

            {/* 2. Div giữ chỗ cho Sider (quan trọng khi Sider fixed) */}
            <div style={{ width: collapsed ? collapsedWidth : siderWidth, flexShrink: 0, transition: 'all 0.2s' }} />

            {/* 3. Layout chính (Header + Content) */}
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