/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Modal, Typography, Space, Button, Radio, Tag, notification, Divider, Card } from 'antd';
import { CheckOutlined, CloseOutlined, ArrowRightOutlined, StarFilled, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Định nghĩa kiểu cho gói nạp
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
    { id: 2, title: "Gói Tiêu chuẩn", amount: 49000, credits: 50, bonus: 5, tag: "Phổ biến" }, // 50+5 Credit
    { id: 3, title: "Gói Cao cấp", amount: 99000, credits: 100, bonus: 15, tag: "Giá trị nhất" }, // 100+15 Credit
];

const COST_PER_DOWNLOAD = 2000; // 2000 VNĐ cho 1 lượt tải

interface UpgradePlanModalProps {
    visible: boolean;
    onClose: () => void;
    onRecharge: (option: RechargeOption) => void;
}

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ visible, onClose, onRecharge }) => {
    const [selectedOption, setSelectedOption] = useState<number>(RECHARGE_OPTIONS[0].id);

    // Xử lý khi chọn gói
    const handleRecharge = () => {
        const selected = RECHARGE_OPTIONS.find(opt => opt.id === selectedOption);
        if (selected) {
            onRecharge(selected);
            notification.info({
                message: 'Chuyển đến Thanh toán',
                description: `Bạn đã chọn gói ${selected.title}. Hệ thống đang chuyển đến cổng thanh toán...`,
            });
            onClose();
        }
    };

    // --- RENDERER CHO TÍNH NĂNG VÀ GÓI ---

    const renderFeature = (text: string, isPro: boolean) => (
        <Space key={text} className="w-full justify-between py-1">
            <Paragraph className='!mb-0 text-base font-medium' style={{ color: isPro ? '#000' : '#475569' }}>
                {text}
            </Paragraph>
            {isPro ?
                <Tag icon={<StarFilled />} color="gold" className='font-semibold'>PRO</Tag> :
                <CheckOutlined className="text-green-500 text-lg font-bold" />
            }
        </Space>
    );

    const renderProFeature = (text: string) => (
        <Space key={text} className="w-full py-1">
            <StarFilled className="text-gold-500 text-lg font-bold" />
            <Paragraph className='!mb-0 text-base font-semibold text-gray-800'>{text}</Paragraph>
        </Space>
    );

    const renderRechargeOption = (option: RechargeOption) => (
        <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all relative ${selectedOption === option.id ? 'border-red-500 bg-red-50 shadow-lg' : 'border-gray-200 hover:border-red-200'
                }`}
            onClick={() => setSelectedOption(option.id)}
        >
            {option.tag && (
                <Tag color="red" className="absolute top-[-10px] right-[-10px] text-xs font-bold shadow-md">
                    {option.tag.toUpperCase()}
                </Tag>
            )}
            <div className="flex justify-between items-center">
                <Radio checked={selectedOption === option.id} className="mr-2">
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
                        Nhận ngay: <span className='font-bold text-lg text-yellow-700'>{option.credits} Credit</span>
                    </Paragraph>
                </Space>
                {option.bonus && option.bonus > 0 && (
                    <Tag color="magenta" className='font-bold text-sm'>
                        + {option.bonus} BONUS!
                    </Tag>
                )}
            </div>
            <Paragraph type="secondary" className='mt-2 text-xs'>
                Tương đương {Math.round((option.amount / (option.credits + (option.bonus || 0))) || 0).toLocaleString('vi-VN')}₫ / Credit. Tiết kiệm hơn!
            </Paragraph>
        </div>
    );

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            width={850}
            footer={null}
            closeIcon={<CloseOutlined style={{ fontSize: '18px' }} />}
            centered
        >
            <div className="p-4">
                <Title level={3} className='text-center !mb-1 text-red-600'>
                    <ThunderboltOutlined className='mr-2' /> Nâng Cấp Sức Mạnh Bộ Đề
                </Title>
                <Paragraph type="secondary" className='text-center !mb-6 text-lg'>
                    Khai phá tiềm năng tạo và phân tích với các tính năng độc quyền.
                </Paragraph>

                {/* THÔNG TIN CREDIT VÀ CHI PHÍ */}
                <Card className='shadow-lg mb-8 border-l-4 border-yellow-500'>
                    <Space size={20} className='w-full justify-around'>
                        <div className='text-center'>
                            <Title level={4} className='!mb-0 text-2xl text-red-600'>
                                1 Credit
                            </Title>
                            <Paragraph className='!mb-0'>
                                Tương đương: <span className='font-bold text-lg text-green-600'>1.000 VNĐ</span>
                            </Paragraph>
                        </div>
                        <Divider type="vertical" style={{ height: '60px' }} />
                        <div className='text-center'>
                            <Title level={4} className='!mb-0 text-2xl text-blue-600'>
                                1 Lượt Tải
                            </Title>
                            <Paragraph className='!mb-0'>
                                Chi phí: <span className='font-bold text-lg text-red-600'>{COST_PER_DOWNLOAD / 1000} Credit</span> ({COST_PER_DOWNLOAD.toLocaleString('vi-VN')}₫)
                            </Paragraph>
                        </div>
                        <Divider type="vertical" style={{ height: '60px' }} />
                        <div className='text-center'>
                            <Title level={4} className='!mb-0 text-2xl'>
                                Nạp tối thiểu
                            </Title>
                            <Paragraph className='!mb-0'>
                                <span className='font-bold text-lg text-green-600'>10.000 VNĐ</span> (10 Credit)
                            </Paragraph>
                        </div>
                    </Space>
                </Card>

                {/* SO SÁNH TÍNH NĂNG */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Cột 1: Tính năng Miễn phí */}
                    <Card size="small" title={<Title level={5} className='!mb-0 text-blue-600'>Gói Miễn phí (Free)</Title>} className='border-l-4 border-blue-400'>
                        <div className="space-y-2">
                            {renderFeature("Tạo câu hỏi trắc nghiệm (MCQ)", false)}
                            {renderFeature("Lưu tối đa 50 câu hỏi", false)}
                            {renderFeature("Xuất bản bộ đề cơ bản (PDF)", false)}
                        </div>
                    </Card>

                    {/* Cột 2: Tính năng PRO (Chỉ khi có Credit) */}
                    <Card size="small" title={<Title level={5} className='!mb-0 text-red-600'><StarFilled className='mr-1' /> Gói PRO (Có Credit)</Title>} className='border-l-4 border-red-400'>
                        <div className="space-y-2">
                            {renderProFeature("Mở khóa 6 loại câu hỏi (Ghép cặp, Phân loại, v.v.)")}
                            {renderProFeature("Phân tích sâu hơn hiệu suất học sinh (AI-Powered Analytics)")}
                            {renderProFeature("Xuất bản không giới hạn & tùy chỉnh nâng cao")}
                            {renderProFeature("Hỗ trợ xuất file Excel/Word (Export to DOC/XLSX)")}
                            {renderProFeature("Bộ lọc tìm kiếm và sắp xếp nâng cao")}
                        </div>
                    </Card>
                </div>

                <Divider>Chọn Gói Nạp Tiền</Divider>

                {/* TÙY CHỌN NẠP TIỀN */}
                <div className="space-y-4 mb-6">
                    {RECHARGE_OPTIONS.map(renderRechargeOption)}
                </div>

                {/* Nút Chọn Gói */}
                <Button
                    type="primary"
                    size="large"
                    block
                    className="h-14 font-bold text-lg rounded-xl bg-red-600 hover:bg-red-700"
                    onClick={handleRecharge}
                >
                    <ArrowRightOutlined /> NẠP TIỀN NGAY (Gói {RECHARGE_OPTIONS.find(opt => opt.id === selectedOption)?.amount.toLocaleString('vi-VN')}₫)
                </Button>

            </div>
        </Modal>
    );
};

export default UpgradePlanModal;