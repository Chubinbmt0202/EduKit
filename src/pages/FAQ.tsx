/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Typography, Space, Card, Collapse, List, Tag, Button } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined, UserOutlined, MailOutlined, PhoneOutlined, HeartOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;
const { Panel } = Collapse;

// Định nghĩa kiểu dữ liệu (nếu cần dùng Type/Interface riêng)
interface FAQItem {
    question: string;
    answer: string;
}

// Dữ liệu giả lập cho FAQ
const faqData: FAQItem[] = [
    {
        question: "1. Làm cách nào để thêm một câu hỏi trắc nghiệm mới?",
        answer: "Bạn chuyển đến tab 'Trắc nghiệm', nhấn nút 'Thêm Câu Hỏi Thủ Công' màu xanh dương, sau đó điền nội dung câu hỏi, các lựa chọn và xác định đáp án đúng trong Modal hiện ra.",
    },
    {
        question: "2. Tôi có thể chỉnh sửa các bộ đề đã tạo không?",
        answer: "Có. Trên mỗi Card của bộ đề (Trắc nghiệm, Điền từ, Ghép cặp...), bạn sẽ thấy biểu tượng Chỉnh sửa (EditOutlined). Nhấn vào đó để mở Modal chỉnh sửa.",
    },
    {
        question: "3. Các tab 'Điền từ', 'Ghép cặp' và 'Phân loại' hoạt động như thế nào?",
        answer: "Mỗi tab có cách thức tạo nội dung khác nhau. Ví dụ: 'Điền từ' yêu cầu bạn đánh dấu đáp án bằng ngoặc vuông [], 'Ghép cặp' yêu cầu bạn nhập cặp A-B, và 'Phân loại' yêu cầu bạn tạo các Nhóm trước.",
    },
    {
        question: "4. Làm sao để 'Xuất bản Bộ đề'?",
        answer: "Chức năng xuất bản hiện tại là giả lập. Trong ứng dụng thực tế, nút 'Xuất bản Bộ đề' (màu xanh lá cây) sẽ kích hoạt quá trình lưu trữ và công khai bộ đề cho học sinh.",
    },
];

// Đổi tên component từ 'SupportAndFAQTab' thành 'SupportAndFAQPage' 
// nếu bạn muốn sử dụng nó như một trang độc lập trong routing của React
const SupportAndFAQPage: React.FC = () => {
    return (
        <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
            <Title level={3} className='!mb-4'>Trung tâm Hỗ trợ & Câu hỏi Thường gặp (FAQ) ❓</Title>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cột 1 & 2: FAQ */}
                <div className="lg:col-span-2">
                    <Card
                        title={<Space><QuestionCircleOutlined className='text-blue-500' /> Câu hỏi Thường gặp (FAQ)</Space>}
                        className='shadow-lg border-t-4 border-blue-400'
                        bodyStyle={{ padding: '0px' }}
                    >
                        <Collapse accordion bordered={false} defaultActiveKey={['1']} className='bg-white'>
                            {faqData.map((item, index) => (
                                <Panel
                                    header={<Paragraph strong className='!mb-0'>{item.question}</Paragraph>}
                                    key={String(index + 1)}
                                    className='border-b border-gray-100'
                                >
                                    <Paragraph className='p-2 bg-gray-50 rounded-md border-l-4 border-gray-300'>
                                        {item.answer}
                                    </Paragraph>
                                </Panel>
                            ))}
                        </Collapse>
                    </Card>
                </div>

                {/* Cột 3: Thông tin Hỗ trợ */}
                <div className="lg:col-span-1">
                    <Card
                        title={<Space><InfoCircleOutlined className='text-gray-500' /> Thông tin Hỗ trợ</Space>}
                        className='shadow-lg border-t-4 border-gray-400'
                    >
                        <List itemLayout="horizontal" className='!p-0'>
                            <List.Item className='!p-0 !py-2'>
                                <List.Item.Meta
                                    avatar={<UserOutlined className='text-xl text-gray-600' />}
                                    title={<Paragraph strong className='!mb-0'>Đội ngũ Kỹ thuật</Paragraph>}
                                    description={<Paragraph type="secondary" className='!mb-0'>Sẵn sàng hỗ trợ 24/7</Paragraph>}
                                />
                            </List.Item>
                            <List.Item className='!p-0 !py-2'>
                                <List.Item.Meta
                                    avatar={<MailOutlined className='text-xl text-red-500' />}
                                    title={<Paragraph strong className='!mb-0'>Email Hỗ trợ</Paragraph>}
                                    description={<a href="mailto:support@quizapp.vn">support@quizapp.vn</a>}
                                />
                            </List.Item>
                            <List.Item className='!p-0 !py-2'>
                                <List.Item.Meta
                                    avatar={<PhoneOutlined className='text-xl text-green-500' />}
                                    title={<Paragraph strong className='!mb-0'>Đường dây nóng</Paragraph>}
                                    description={<a href="tel:19001234">0812-345-678</a>}
                                />
                            </List.Item>
                            <List.Item className='!p-0 !py-2'>
                                <Button type="default" icon={<HeartOutlined />} block className='mt-2'>
                                    Gửi phản hồi
                                </Button>
                            </List.Item>
                        </List>
                    </Card>

                    <Card
                        title={<Space><Tag color="blue">Phiên bản 1.0</Tag></Space>}
                        className='shadow-lg mt-4'
                        bodyStyle={{ padding: '12px 24px' }}
                    >
                        <Paragraph className='!mb-0'>
                            Ứng dụng quản lý Bộ đề<br />
                            Phiên bản: <Tag color="processing">v1.0.0-beta</Tag>
                        </Paragraph>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SupportAndFAQPage;