/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Layout } from 'antd';
import HeaderQuiz from '../component/headerQuiz';
import FooterQuiz from '../component/footerQuiz';
import SidebarQuiz from '../component/sidebarQuize';
// Component Layout tổng hợp tất cả
const CustomLayoutQuiz: React.FC<{ children: React.ReactNode }> = () => {


    return (
        <Layout style={{ minHeight: '100vh', flexDirection: 'row' }}>
            <Layout style={{ flex: 1, backgroundColor: '#ffffffff' }}>
                <HeaderQuiz />
                <SidebarQuiz />
                <FooterQuiz />
            </Layout>
        </Layout >
    );
};

export default CustomLayoutQuiz;