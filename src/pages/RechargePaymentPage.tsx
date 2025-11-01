/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import {
    Typography, Space, Card, Button, Radio, Tag, notification, Divider, Form, Input, Select, Descriptions, Steps, Row, Col
} from 'antd';
import {
    ThunderboltOutlined, CreditCardOutlined, CheckCircleOutlined, DollarOutlined, SolutionOutlined, TagsOutlined, ShoppingCartOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// --- 1. CẤU TRÚC DỮ LIỆU ---

interface RechargeOption {
    id: number;
    title: string;
    amount: number;         // Số tiền VNĐ
    credits: number;        // Số Credit nhận được
    bonus?: number;         // Credit khuyến mãi
    tag?: string;           // Tag nổi bật (Hot, Best Value)
}

// Dữ liệu Gói nạp (Tối thiểu 10.000 VNĐ)
const RECHARGE_OPTIONS: RechargeOption[] = [
    { id: 1, title: "Gói Khởi động", amount: 10000, credits: 10, bonus: 0 },
    { id: 2, title: "Gói Tiêu chuẩn", amount: 49000, credits: 50, bonus: 5, tag: "Phổ biến" },
    { id: 3, title: "Gói Cao cấp", amount: 99000, credits: 100, bonus: 15, tag: "Giá trị nhất" },
    { id: 4, title: "Gói VIP Pro", amount: 199000, credits: 200, bonus: 40, tag: "VIP" },
];

const COST_PER_DOWNLOAD = 2000; // 2000 VNĐ cho 1 lượt tải

const RechargePaymentPage: React.FC = () => {
    // 0: Chọn Gói, 1: Thông tin & Thanh toán, 2: Hoàn tất
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedOptionId, setSelectedOptionId] = useState<number>(RECHARGE_OPTIONS[0].id);
    const [isProcessing, setIsProcessing] = useState(false);
    const [form] = Form.useForm();

    const selectedOption = useMemo(() => RECHARGE_OPTIONS.find(opt => opt.id === selectedOptionId), [selectedOptionId]);

    // --- 2. HÀM XỬ LÝ ĐIỀU HƯỚNG BƯỚC ---

    const next = () => {
        // Chỉ chuyển bước nếu đã chọn gói
        if (selectedOption) {
            setCurrentStep(currentStep + 1);
        } else {
            notification.warning({ message: 'Vui lòng chọn một gói nạp tiền.' });
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    // --- 3. HÀM RENDERER GÓI NẠP ---

    const renderRechargeOption = (option: RechargeOption) => (
        <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all relative ${selectedOptionId === option.id ? 'border-red-500 bg-red-50 shadow-lg' : 'border-gray-200 hover:border-red-200'
                }`}
            onClick={() => setSelectedOptionId(option.id)}
        >
            {option.tag && (
                <Tag color="red" className="absolute top-[-10px] right-[-10px] text-xs font-bold shadow-md">
                    {option.tag.toUpperCase()}
                </Tag>
            )}
            <div className="flex justify-between items-center">
                <Radio checked={selectedOptionId === option.id} className="mr-2">
                    <span className="text-lg font-bold text-gray-800">{option.title}</span>
                </Radio>
                <div className="text-2xl font-extrabold text-red-600">
                    {option.amount.toLocaleString('vi-VN')}₫
                </div>
            </div>
            <Divider className='!my-2' />
            <div className='flex justify-between items-center'>
                <Space direction="horizontal">
                    <ThunderboltOutlined className='text-xl text-yellow-600' />
                    <Paragraph className='!mb-0 text-base'>
                        Tổng Credit: <span className='font-bold text-lg text-yellow-700'>{option.credits + (option.bonus || 0)} Credit</span>
                    </Paragraph>
                </Space>
                {option.bonus && option.bonus > 0 && (
                    <Tag color="magenta" className='font-bold text-sm'>
                        + {option.bonus} BONUS!
                    </Tag>
                )}
            </div>
        </div>
    );

    // --- 4. XỬ LÝ THANH TOÁN (STEP 1) ---

    const handlePayment = async () => {
        if (!selectedOption) return;

        setIsProcessing(true);
        // Mô phỏng quá trình xử lý thanh toán
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);

        // Chuyển sang bước Hoàn tất
        setCurrentStep(2);

        notification.success({
            message: 'Thanh toán Thành công!',
            description: `Bạn đã nạp thành công ${selectedOption.amount.toLocaleString('vi-VN')} VNĐ. Tổng cộng ${selectedOption.credits + (selectedOption.bonus || 0)} Credit đã được cộng vào tài khoản.`,
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            duration: 8,
        });

        // Không reset fields ngay, để người dùng xem lại thông tin (nếu cần)
    };

    if (!selectedOption && currentStep < 2) {
        // Nếu không tìm thấy gói và chưa ở bước hoàn tất (chỉ xảy ra nếu dữ liệu bị lỗi)
        return <div className='p-8'>Không tìm thấy gói nạp tiền.</div>;
    }


    // --- NỘI DUNG CỦA CÁC BƯỚC ---

    // Step 0: Chọn Gói Nạp
    const step0Content = (
        <Card title={<Space><ShoppingCartOutlined className='text-red-500' /> Chọn Gói Nạp Credit</Space>} className='shadow-lg'>
            <div className="space-y-4">
                {RECHARGE_OPTIONS.map(renderRechargeOption)}
            </div>
            <Paragraph type="secondary" className='mt-4 text-sm'>
                Chi phí 1 lượt tải bộ đề PRO là **{COST_PER_DOWNLOAD.toLocaleString('vi-VN')} VNĐ** ({COST_PER_DOWNLOAD / 1000} Credit).
            </Paragraph>
            <Divider />
            <div className="flex justify-end">
                <Button
                    type="primary"
                    size="large"
                    disabled={!selectedOption}
                    onClick={next}
                >
                    Tiếp tục đến Thanh toán <CreditCardOutlined />
                </Button>
            </div>
        </Card>
    );

    // Step 1: Xác nhận & Thanh toán
    const step1Content = selectedOption && (
        <Form
            form={form}
            layout="vertical"
            onFinish={handlePayment}
            initialValues={{ paymentMethod: "bank_transfer" }}
        >
            <Row gutter={24}>
                {/* CỘT TRÁI (Thông tin khách hàng) */}
                <Col xs={24} lg={14}>
                    <Card title={<Space><SolutionOutlined className='text-blue-500' /> Thông tin Thanh toán</Space>} className='shadow-lg mb-6'>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập Họ và tên' }]}
                                >
                                    <Input placeholder="Nguyễn Văn A" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email liên hệ"
                                    rules={[{ required: true, message: 'Vui lòng nhập Email' }, { type: 'email', message: 'Email không hợp lệ' }]}
                                >
                                    <Input placeholder="email@domain.com" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại' }]}
                        >
                            <Input placeholder="090..." />
                        </Form.Item>
                        <Form.Item
                            name="paymentMethod"
                            label="Phương thức Thanh toán"
                            rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                        >
                            <Select placeholder="Chọn phương thức thanh toán">
                                <Option value="credit_card"><CreditCardOutlined /> Thẻ Tín dụng / Ghi nợ</Option>
                                <Option value="bank_transfer"><SolutionOutlined /> Chuyển khoản Ngân hàng (VietQR)</Option>
                                <Option value="e_wallet"><TagsOutlined /> Ví điện tử (Momo, ZaloPay)</Option>
                            </Select>
                        </Form.Item>
                    </Card>
                </Col>

                {/* CỘT PHẢI (Tóm tắt đơn hàng) */}
                <Col xs={24} lg={10}>
                    <Card title={<Space><CreditCardOutlined className='text-green-500' /> Tóm tắt Đơn hàng</Space>} className='shadow-lg sticky top-8'>

                        <Descriptions bordered column={1} size="small" className='mb-4'>
                            <Descriptions.Item label="Gói đã chọn">
                                <Tag color="red" className='text-base'>{selectedOption.title}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số Credit cơ bản">{selectedOption.credits}</Descriptions.Item>
                            <Descriptions.Item label="Credit khuyến mãi">
                                {selectedOption.bonus ? <Tag color="magenta">+{selectedOption.bonus}</Tag> : '0'}
                            </Descriptions.Item>
                            <Descriptions.Item label="TỔNG CREDIT NHẬN">
                                <Paragraph strong className='!mb-0 text-xl text-yellow-700'>
                                    {selectedOption.credits + (selectedOption.bonus || 0)} Credit
                                </Paragraph>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider className='!mt-4 !mb-4' />

                        <div className='flex justify-between items-center text-xl font-bold mb-4'>
                            <span>TỔNG CỘNG:</span>
                            <span className='text-red-600'>
                                {selectedOption.amount.toLocaleString('vi-VN')}₫
                            </span>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            icon={<CheckCircleOutlined />}
                            loading={isProcessing}
                            className='h-14 font-bold text-lg bg-red-600 hover:bg-red-700'
                        >
                            {isProcessing ? 'Đang xử lý...' : `THANH TOÁN ${selectedOption.amount.toLocaleString('vi-VN')}₫`}
                        </Button>

                        <div className="mt-4 flex justify-between">
                            <Button onClick={prev} className='w-full'>
                                Quay lại Chọn Gói
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Form>
    );

    // Step 2: Hoàn tất
    const step2Content = (
        <Card className='shadow-lg text-center p-8'>
            <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
            <Title level={3} className='mt-4 text-green-600'>Giao dịch Thành công!</Title>
            <Paragraph className='text-lg'>
                Hệ thống đã nhận được thanh toán. Tổng cộng **{(selectedOption?.credits || 0) + (selectedOption?.bonus || 0)} Credit** đã được cộng vào tài khoản của bạn.
            </Paragraph>
            <Paragraph type="secondary">
                Email xác nhận và chi tiết giao dịch đã được gửi đến địa chỉ email bạn đã cung cấp.
            </Paragraph>
            <Divider />
            <Button
                type="primary"
                size="large"
                onClick={() => {
                    setCurrentStep(0);
                    setSelectedOptionId(RECHARGE_OPTIONS[0].id); // Quay lại gói mặc định
                    form.resetFields(); // Reset form
                }}
            >
                Về Trang Chủ / Nạp Thêm
            </Button>
        </Card>
    );

    // Mảng nội dung theo bước
    const stepContents = [
        step0Content,
        step1Content,
        step2Content
    ];

    return (
        <div style={{ padding: 32, height: '100vh', overflowY: 'auto', backgroundColor: '#f0f2f5' }}>

            <Title level={3} className='!mb-2 text-red-600'><DollarOutlined className='mr-2' /> Trang Thanh toán & Nạp Credit</Title>
            <Paragraph type="secondary" className='!mb-8'>
                Hoàn tất 3 bước đơn giản để nhận Credit và sử dụng các tính năng PRO.
            </Paragraph>

            <Steps
                current={currentStep}
                items={[
                    { title: 'Chọn Gói Nạp', icon: <ShoppingCartOutlined /> },
                    { title: 'Thông tin & Thanh toán', icon: <CreditCardOutlined /> },
                    { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
                ]}
                className='mb-8'
            />

            {/* Hiển thị nội dung của bước hiện tại */}
            <div className="steps-content">
                {stepContents[currentStep]}
            </div>

        </div>
    );
};

export default RechargePaymentPage;