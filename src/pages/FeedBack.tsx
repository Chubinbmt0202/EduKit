/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Typography, Form, Input, Button, Radio, notification } from 'antd';
import { WarningOutlined, SendOutlined, SmileOutlined, MehOutlined, FrownOutlined, HeartOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;
const { TextArea } = Input;


const FeedbackPage: React.FC = () => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Hàm xử lý: GỬI PHẢN HỒI ---
    const handleSendFeedback = async () => {
        setIsSubmitting(true);

        // Mô phỏng quá trình gửi dữ liệu lên server (khoảng 1 giây)
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);

        // Hiển thị thông báo thành công
        notification.success({
            message: 'Gửi Phản hồi Thành công!',
            description: 'Cảm ơn bạn đã đóng góp ý kiến. Chúng tôi đã nhận được và sẽ xem xét sớm nhất.',
            icon: <SendOutlined style={{ color: '#52c41a' }} />,
        });

        // Xóa form sau khi gửi thành công
        form.resetFields();
    };

    return (
        // Tăng padding và thêm màu nền cho cảm giác một trang độc lập
        <div style={{ padding: 16, overflowY: 'auto' }}>

            <Title level={3} className='!mb-2'>Phản hồi & Góp ý của bạn 💬</Title>
            <Paragraph type="secondary" className='!mb-6'>
                Giúp chúng tôi cải thiện chất lượng sản phẩm bằng cách gửi đề xuất hoặc báo cáo lỗi.
            </Paragraph>

            {/* Giới hạn chiều rộng của Form cho trang */}
            <div style={{ margin: '0 auto' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSendFeedback}
                >
                    {/* Loại Phản hồi */}
                    <Form.Item
                        name="type"
                        label={<Paragraph strong className='!mb-0'>1. Phân loại nội dung bạn muốn gửi:</Paragraph>}
                        rules={[{ required: true, message: 'Vui lòng chọn loại phản hồi' }]}
                        initialValue={'suggestion'}
                    >
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="suggestion"><SendOutlined className='mr-1' /> Đề xuất/Góp ý</Radio.Button>
                            <Radio.Button value="bug"><WarningOutlined className='mr-1' /> Báo cáo Lỗi (Bug)</Radio.Button>
                            <Radio.Button value="praise"><HeartOutlined className='mr-1' /> Khen ngợi/Động viên</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {/* Mức độ Hài lòng (Logic điều kiện) */}
                    <Form.Item noStyle shouldUpdate>
                        {() => {
                            const feedbackType = form.getFieldValue('type');
                            if (feedbackType !== 'bug') {
                                return (
                                    <Form.Item
                                        name="rating"
                                        label={<Paragraph strong className='!mb-0'>2. Mức độ hài lòng chung:</Paragraph>}
                                        rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
                                        initialValue={'good'}
                                    >
                                        <Radio.Group>
                                            <Radio.Button value="good"><SmileOutlined className='text-green-500 mr-1' /> Rất tốt</Radio.Button>
                                            <Radio.Button value="average"><MehOutlined className='text-yellow-500 mr-1' /> Bình thường</Radio.Button>
                                            <Radio.Button value="poor"><FrownOutlined className='text-red-500 mr-1' /> Chưa tốt</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                );
                            }
                            return null;
                        }}
                    </Form.Item>


                    {/* Tiêu đề Phản hồi */}
                    <Form.Item
                        name="title"
                        label={<Paragraph strong className='!mb-0'>3. Tiêu đề tóm tắt:</Paragraph>}
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tóm tắt' }]}
                    >
                        <Input placeholder="Ví dụ: Lỗi không thể lưu tab Điền từ" />
                    </Form.Item>

                    {/* Chi tiết Phản hồi */}
                    <Form.Item
                        name="details"
                        label={<Paragraph strong className='!mb-0'>4. Chi tiết nội dung:</Paragraph>}
                        rules={[{ required: true, message: 'Vui lòng nhập chi tiết nội dung' }]}
                    >
                        <TextArea rows={5} placeholder="Mô tả chi tiết vấn đề hoặc đề xuất của bạn. Nếu là lỗi, hãy cho biết các bước để tái hiện." />
                    </Form.Item>

                    {/* Thông tin liên hệ */}
                    <Form.Item
                        name="contact"
                        label={<Paragraph strong className='!mb-0'>5. Thông tin liên hệ (Email/SĐT - Tùy chọn):</Paragraph>}
                    >
                        <Input placeholder="Để chúng tôi có thể liên hệ lại nếu cần" />
                    </Form.Item>


                </Form>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    icon={<SendOutlined />}
                    loading={isSubmitting}
                    className='mt-6'
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Phản hồi và Góp ý'}
                </Button>
            </div>
        </div>
    );
};

export default FeedbackPage;