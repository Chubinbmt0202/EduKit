
import React from 'react';
import { Modal, Typography, Button, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
interface LoginNotiModalProps {
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

const LoginNotiModal: React.FC<LoginNotiModalProps> = ({ isVisible, onClose, onNavigateToTopUp }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        onNavigateToTopUp();
        navigate('/login');
    };

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
                    Đăng nhập để tiếp tục!
                </Title>

                <Paragraph style={{ marginBottom: '20px' }}>
                    Đăng nhập chưa tới 1 phút để sử dụng tất cả các tính năng của EduKit.
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
                        onClick={handleNavigate}
                        size="large"
                        style={{ width: '45%' }}
                    >
                        Đăng nhập ngay
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default LoginNotiModal;