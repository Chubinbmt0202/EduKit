// src/components/features/quizes/SourceDocumentViewer.tsx
import React from 'react';
import { Card, Button, Space, Pagination } from 'antd';
import {
    SearchOutlined, PrinterOutlined, DownloadOutlined, FullscreenOutlined,
} from '@ant-design/icons';
import { Panel } from "react-resizable-panels";

interface SourceDocumentViewerProps {
    documentContent: string;
}

const SourceDocumentViewer: React.FC<SourceDocumentViewerProps> = ({ documentContent }) => {
    return (
        <Panel defaultSize={40} minSize={35} maxSize={60}>
            <div className='pr-4'>
                <Card size="small" >

                    {/* Toolbar */}
                    <div className='flex justify-between items-center pb-3 mb-3 border-b border-gray-200'>
                        <Space>
                            <Button icon={<SearchOutlined />} />
                        </Space>
                        <Space>
                            <Pagination simple current={1} total={50} pageSize={10} size="small" />
                        </Space>
                        <Space>
                            <Button icon={<PrinterOutlined />} />
                            <Button icon={<DownloadOutlined />} />
                            <Button icon={<FullscreenOutlined />} />
                        </Space>
                    </div>

                    {/* Nội dung tài liệu */}
                    <div className='mt-3 h-full overflow-y-auto' style={{ maxHeight: 'calc(100vh - 250px)' }}>
                        <pre style={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            lineHeight: '1.7',
                            color: '#333'
                        }}>
                            {documentContent.trim()}
                        </pre>
                    </div>
                </Card>
            </div>
        </Panel>
    );
};

export default SourceDocumentViewer;