// src/components/common/Loading.tsx
import React from 'react';
import { Spin } from 'antd';

interface LoadingProps {
    fullScreen?: boolean;
    message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen, message }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
                <Spin size="large" tip={message || 'Đang tải...'} />
            </div>
        );
    }

    return <Spin size="large" tip={message || 'Đang tải...'} />;
};