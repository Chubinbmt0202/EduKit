
import React from 'react';
import { Modal, Typography, Button, Divider } from 'antd';
import { ExclamationCircleOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface InsufficientFundsModalProps {
    /**
     * Trạng thái hiển thị của Modal
     */
    isVisible: boolean;
    /**
     * Hàm xử lý khi Modal bị đóng (ví dụ: nhấn Esc hoặc click nút Hủy)
     */
    onClose: () => void;
    /**
     * Hàm xử lý khi người dùng nhấn nút Nạp tiền (Simulated action)
     */
    onNavigateToTopUp: () => void;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({ isVisible, onClose, onNavigateToTopUp }) => {
    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            footer={null}
            width={400}
            centered
            maskClosable={true}
            closable={true}
        >
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '15px' }} />

                <Title level={3} style={{ marginBottom: '10px' }}>
                    Tài khoản không đủ!
                </Title>

                <Paragraph style={{ marginBottom: '20px' }}>
                    Tuyệt vời! Bạn chỉ cần thêm <strong>2000 VNĐ </strong> (ít hơn một cốc trà đá) để tạo ngay bộ câu hỏi độc quyền, <strong> tiết kiệm 2 giờ soạn thảo!</strong> Nạp tiền và nhận thành quả trong <strong>{30}</strong> giây.
                </Paragraph>

                <Divider style={{ margin: '15px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button
                        onClick={onClose}
                        size="large"
                        style={{ width: '45%' }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        onClick={onNavigateToTopUp}
                        size="large"
                        icon={<DollarCircleOutlined />}
                        style={{ width: '45%' }}
                    >
                        Nạp tiền ngay
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default InsufficientFundsModal;