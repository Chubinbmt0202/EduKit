/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Typography, Space, Card, Timeline, Tag, Table } from 'antd';
import {
    HistoryOutlined,
    CheckCircleOutlined,
    EditOutlined,
    PlusOutlined,
    SendOutlined,
    SettingOutlined,
    CloseCircleOutlined,
    WarningOutlined
} from '@ant-design/icons';

const { Paragraph, Title } = Typography;

// Định nghĩa kiểu dữ liệu
interface ActivityLog {
    id: string;
    timestamp: string;
    action: string;
    module: string;
    details: string;
    status: 'success' | 'warning' | 'error';
}

// Dữ liệu giả lập
const initialLogData: ActivityLog[] = [
    { id: 'l1', timestamp: '31/10/2025 14:50', action: 'Đăng nhập thành công', module: 'Hệ thống', details: 'Từ IP: 192.168.1.1', status: 'success' },
    { id: 'l2', timestamp: '31/10/2025 14:45', action: 'Chỉnh sửa câu hỏi', module: 'Trắc nghiệm', details: 'Câu hỏi ID: 1', status: 'success' },
    { id: 'l3', timestamp: '31/10/2025 14:40', action: 'Tạo mới bộ đề', module: 'Ghép cặp', details: 'Bộ đề: Thủ đô & Quốc gia', status: 'success' },
    { id: 'l4', timestamp: '31/10/2025 14:35', action: 'Gửi phản hồi', module: 'Hỗ trợ', details: 'Loại: Báo cáo lỗi', status: 'warning' },
    { id: 'l5', timestamp: '31/10/2025 14:30', action: 'Xóa câu hỏi', module: 'Điền từ', details: 'Câu hỏi ID: b2', status: 'error' },
    { id: 'l6', timestamp: '31/10/2025 14:20', action: 'Xuất bản bộ đề', module: 'Trắc nghiệm', details: 'Thành công, 20 câu', status: 'success' },
];

const ActivityHistory: React.FC = () => {
    const [logData] = useState(initialLogData);

    const getStatusTag = (status: ActivityLog['status']) => {
        switch (status) {
            case 'success':
                return <Tag color="green" icon={<CheckCircleOutlined />}>Thành công</Tag>;
            case 'warning':
                return <Tag color="gold" icon={<WarningOutlined />}>Cảnh báo</Tag>;
            case 'error':
                return <Tag color="red" icon={<CloseCircleOutlined />}>Lỗi</Tag>;
            default:
                return null;
        }
    };

    const getTimelineIcon = (action: string) => {
        if (action.includes('Tạo') || action.includes('Thêm')) return <PlusOutlined />;
        if (action.includes('Chỉnh sửa')) return <EditOutlined />;
        if (action.includes('Xuất bản')) return <SendOutlined />;
        if (action.includes('Đăng nhập')) return <HistoryOutlined />;
        if (action.includes('Gửi phản hồi')) return <WarningOutlined />;
        if (action.includes('Xóa')) return <CloseCircleOutlined style={{ color: 'red' }} />;
        return <SettingOutlined />;
    };

    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 150,
            sorter: (a: ActivityLog, b: ActivityLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Chi tiết',
            dataIndex: 'details',
            key: 'details',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: getStatusTag,
        },
    ];

    // Sử dụng Table thay vì Timeline để dễ dàng quản lý (sắp xếp, tìm kiếm)
    return (
        <div style={{ overflowY: 'auto' }}>

            <Title level={3} className='!mb-2'><HistoryOutlined className='mr-2' /> Lịch sử Hoạt động</Title>
            <Paragraph type="secondary" className='!mb-6'>
                Xem lại các hoạt động đã thực hiện trên hệ thống của bạn (tạo, sửa, xóa, đăng nhập...).
            </Paragraph>

            <Card
                title={<Space><SettingOutlined /> Nhật ký Hoạt động Chi tiết</Space>}
                className='shadow-lg'
            >
                <Table
                    columns={columns}
                    dataSource={logData.map(log => ({ ...log, key: log.id }))}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 700 }} // Cho phép cuộn ngang trên màn hình nhỏ
                    className='custom-table-history'
                />
            </Card>

            {/* Phần Timeline (ví dụ minh họa trực quan) - Tùy chọn */}
            <Card title={<Space><HistoryOutlined /> Dòng thời gian trực quan</Space>} style={{ marginTop: '20px' }} className='shadow-lg mt-6'>
                <Timeline
                    mode="left"
                    items={logData.slice(0, 5).map(log => ({ // Chỉ hiển thị 5 mục gần nhất trên timeline
                        dot: getTimelineIcon(log.action),
                        color: log.status === 'success' ? 'green' : (log.status === 'error' ? 'red' : 'blue'),
                        children: (
                            <div>
                                <Paragraph strong className='!mb-0'>{log.action} <Tag color="blue">{log.module}</Tag></Paragraph>
                                <Paragraph type="secondary" className='!mb-0 text-sm'>{log.details}</Paragraph>
                                <Paragraph type="secondary" className='!mb-0 text-xs'>{log.timestamp}</Paragraph>
                            </div>
                        ),
                    }))}
                />
            </Card>
        </div>
    );
};

export default ActivityHistory;