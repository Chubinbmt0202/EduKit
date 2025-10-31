/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type JSX } from 'react';
import { Typography, Card, Collapse, Steps, Tag, Alert, List } from 'antd';
import { BookOutlined, CheckCircleOutlined, SwapOutlined, ClusterOutlined, QuestionCircleFilled, TagsOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;
const { Panel } = Collapse;

// Dữ liệu mô tả các bước hướng dẫn
const guideSections: { key: string; title: string; icon: JSX.Element; color: string; steps: { title: string; content: string | JSX.Element }[] }[] = [
    {
        key: 'mcq',
        title: "1. Trắc nghiệm (Multiple Choice Questions)",
        icon: <QuestionCircleFilled />,
        color: 'blue',
        steps: [
            {
                title: "Bước 1: Nhập Nội dung Câu hỏi",
                content: "Nhập câu hỏi vào trường 'Nội dung Câu hỏi'.",
            },
            {
                title: "Bước 2: Nhập các Lựa chọn",
                content: "Điền tối đa 4 lựa chọn (A, B, C, D) vào các ô tương ứng. Đảm bảo các lựa chọn quan trọng không bị bỏ trống.",
            },
            {
                title: "Bước 3: Xác định Đáp án Đúng",
                content: "Trong Select Box 'Xác định Đáp án Đúng', chọn nội dung của đáp án chính xác (phải khớp hoàn toàn với một trong các lựa chọn A, B, C, D).",
            },
            {
                title: "Bước 4: Thêm Giải thích (Tùy chọn)",
                content: "Thêm giải thích ngắn gọn để giải thích logic tại sao đáp án đó là đúng hoặc các đáp án khác là sai.",
            },
        ],
    },
    {
        key: 'fill',
        title: "2. Điền từ (Fill In The Blanks)",
        icon: <TagsOutlined />,
        color: 'orange',
        steps: [
            {
                title: "Bước 1: Đánh dấu chỗ trống trong câu hỏi",
                content: (
                    <>
                        Nhập câu hỏi và đặt đáp án đúng vào trong dấu ngoặc vuông **`[ ]`** ngay tại vị trí cần điền.<br />
                        <Paragraph type="secondary" className='mt-2'>Ví dụ: Thủ đô của Việt Nam là **`[Hà Nội]`**.</Paragraph>
                    </>
                ),
            },
            {
                title: "Bước 2: Trích xuất Đáp án",
                content: "Nhập lại chính xác nội dung đáp án (không có ngoặc vuông) vào các ô 'Đáp án 1', 'Đáp án 2', v.v. để hệ thống nhận diện.",
            },
        ],
    },
    {
        key: 'matching',
        title: "3. Ghép cặp (Matching)",
        icon: <SwapOutlined />,
        color: 'purple',
        steps: [
            {
                title: "Bước 1: Nhập Tiêu đề Bộ đề",
                content: "Đặt tên cho bộ ghép cặp (Ví dụ: 'Ghép cặp Quốc gia và Thủ đô').",
            },
            {
                title: "Bước 2: Tạo các Cặp A-B",
                content: "Sử dụng 'Thêm Cặp Nối đôi' để tạo các dòng. Nhập Thuật ngữ/Câu hỏi vào Cột A và Định nghĩa/Đáp án vào Cột B. Đảm bảo A và B là một cặp đúng.",
            },
            {
                title: "Lưu ý Quan trọng",
                content: (
                    <Alert
                        message="Hệ thống sẽ tự động xáo trộn các mục trong Cột B khi hiển thị cho học sinh."
                        type="warning"
                        showIcon
                    />
                ),
            },
        ],
    },
    {
        key: 'classification',
        title: "4. Phân loại (Classification)",
        icon: <ClusterOutlined />,
        color: 'gold',
        steps: [
            {
                title: "Bước 1: Cấu hình các Nhóm (Categories)",
                content: "Tạo ít nhất 2 nhóm (Ví dụ: 'Động vật', 'Thực vật'). Đây sẽ là các đích kéo thả.",
            },
            {
                title: "Bước 2: Thêm các Mục cần Phân loại",
                content: "Thêm các mục (Items) cần phân loại (Ví dụ: 'Con Cá', 'Cây Xoài').",
            },
            {
                title: "Bước 3: Gán Nhóm Đúng",
                content: "Đối với mỗi Mục, bạn phải chọn chính xác Nhóm Đúng (Category) mà mục đó thuộc về từ danh sách Select Box.",
            },
        ],
    },
];

const UserGuide: React.FC = () => {
    return (
        <div style={{ height: '100vh', overflowY: 'auto' }}>

            <Title level={3} className='!mb-2'><BookOutlined className='mr-2' /> Hướng dẫn Sử dụng Bộ đề</Title>
            <Paragraph type="secondary" className='!mb-6'>
                Đây là hướng dẫn chi tiết về cách tạo các loại bài tập khác nhau trong hệ thống quản lý bộ đề.
            </Paragraph>

            <Collapse
                accordion
                defaultActiveKey={['mcq']}
                className='shadow-lg'
            >
                {guideSections.map(section => (
                    <Panel
                        key={section.key}
                        header={<Title level={4} className='!mb-0'><Tag color={section.color} className='text-lg py-1 px-3'>{section.icon} {section.title}</Tag></Title>}
                        className='bg-white'
                    >
                        <Steps
                            direction="vertical"
                            size="small"
                            current={section.steps.length}
                            status="process"
                            items={section.steps.map((step) => ({
                                title: <Paragraph strong className='!mb-0 text-md'>{step.title}</Paragraph>,
                                description: <div className='pb-4'>{step.content}</div>,
                                icon: <CheckCircleOutlined style={{ color: section.color }} />
                            }))}
                        />
                    </Panel>
                ))}
            </Collapse>

            {/* Hướng dẫn chung */}
            <Card title="Hướng dẫn Chung" className='shadow-lg mt-6' style={{ marginTop: '24px' }}>
                <Paragraph strong>Quy trình Lưu và Xuất bản:</Paragraph>
                <List size="small" bordered={false}>
                    <List.Item>Sau khi hoàn thành, nhấn nút "Lưu Câu Hỏi/Bộ Đề" trong Modal để lưu vào danh sách.</List.Item>
                    <List.Item>Bộ đề đã lưu sẽ hiển thị trong danh sách chính của Tab.</List.Item>
                    <List.Item>Nhấn "Xuất bản Bộ đề" ở phía trên cùng để công khai toàn bộ các bài tập đã tạo.</List.Item>
                </List>
            </Card>

        </div>
    );
};

export default UserGuide;