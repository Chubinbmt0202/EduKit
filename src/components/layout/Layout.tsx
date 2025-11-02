/* eslint-disable react-refresh/only-export-components */
/*
 * File: chubinbmt0202/edukit/EduKit-632165e1b9a4407a0f06213c87701ba0223a5e13/src/components/layout/Layout.tsx
 */
import React, { useState, createContext, useContext } from 'react';
import { Layout, theme } from 'antd';
import CustomSidebar from './Sidebar';
import CustomHeader from './Header';

const { Content } = Layout;

// ⭐ BƯỚC 1: Định nghĩa Layout Context ⭐
interface LayoutContextProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const LayoutContext = createContext<LayoutContextProps>({
    collapsed: false,
    setCollapsed: () => { },
});

export const useLayoutContext = () => useContext(LayoutContext);


// ⭐ BƯỚC 2: Component Provider quản lý state ⭐
const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    // Ant Design default widths
    const siderWidth = 250;
    const collapsedWidth = 80;

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Giá trị Context
    const contextValue = { collapsed, setCollapsed };

    return (
        <LayoutContext.Provider value={contextValue}>
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
            </Layout>
        </LayoutContext.Provider>
    );
};


// Component Layout tổng hợp tất cả
const CustomLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Sử dụng LayoutProvider mới
    return <LayoutProvider>{children}</LayoutProvider>;
};

export default CustomLayout;