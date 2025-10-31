// src/components/CreateQuizModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Progress, Button } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface ProcessingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

// Định nghĩa các bước tiến trình
const processSteps = [
    'Đang chuẩn bị môi trường',
    'Phân tích tài liệu',
    'Tạo câu hỏi',
    'Cấu trúc bộ câu hỏi',
    'Kiểm tra chất lượng đầu ra',
    'Hoàn thiện bộ câu hỏi',
];

const ProcessingModal: React.FC<ProcessingModalProps> = ({ isVisible, onClose }) => {
    const navigate = useNavigate();
    // State để theo dõi bước hiện tại đang xử lý (index)
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    // State để theo dõi trạng thái đã hoàn thành của từng bước (mảng boolean)
    const [completedSteps, setCompletedSteps] = useState(Array(processSteps.length).fill(false));
    // State để theo dõi thanh tiến trình tổng thể
    const [progressPercent, setProgressPercent] = useState(0);
    const [isFinished, setIsFinished] = useState(false); // State mới

    // Effect chạy mỗi khi Modal hiển thị
    useEffect(() => {
        if (isVisible) {
            // Đặt lại trạng thái khi Modal mở
            setCurrentStepIndex(0);
            setCompletedSteps(Array(processSteps.length).fill(false));
            setProgressPercent(0);
        }
    }, [isVisible]);

    // Effect quản lý luồng animation
    useEffect(() => {
        if (!isVisible || currentStepIndex >= processSteps.length) return;

        // Bắt đầu timer cho bước hiện tại
        const timer = setTimeout(() => {
            // 1. Cập nhật trạng thái hoàn thành cho bước hiện tại
            setCompletedSteps(prev => {
                const newCompleted = [...prev];
                newCompleted[currentStepIndex] = true;
                return newCompleted;
            });

            // 2. Tăng thanh tiến trình tổng thể
            setProgressPercent(
                (currentStepIndex + 1) / processSteps.length * 100
            );

            // 3. Chuyển sang bước tiếp theo
            if (currentStepIndex < processSteps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
            } else {
                // Đã hoàn thành tất cả các bước
                setIsFinished(true); // Đánh dấu đã hoàn thành
            }

        }, 2000); // 2 giây cho mỗi bước

        // Cleanup timer khi component unmount hoặc effect chạy lại
        return () => clearTimeout(timer);
    }, [isVisible, currentStepIndex]);


    // Hàm render icon cho từng bước
    const renderIcon = (index: number) => {
        if (completedSteps[index]) {
            // Hoàn thành
            return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />;
        } else if (index === currentStepIndex) {
            // Đang loading
            return <LoadingOutlined spin style={{ color: '#1890ff', fontSize: '18px' }} />;
        } else {
            // Chưa tới
            return <CheckCircleOutlined style={{ color: '#d9d9d9', fontSize: '18px' }} />;
        }
    }

    const handleViewDetails = () => {
        onClose();
        navigate('/folders/quizzes/12345'); // Thay '12345' bằng ID thực tế nếu có
    }

    return (
        <Modal
            closable={false}
            maskClosable={false}
            footer={null}
            title={null}
            open={isVisible}
            onCancel={onClose}
            width={550}
            centered
        >
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <RobotOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                <Title level={3} style={{ margin: '10px 0 20px 0' }}>
                    Chúng tôi đang xử lý yêu cầu của bạn...
                </Title>

                {/* Thanh tiến trình tổng thể */}
                <Progress percent={Math.round(progressPercent)} showInfo={true} style={{ marginBottom: '30px' }} />

                {/* Danh sách các bước tiến trình */}
                <div style={{ textAlign: 'left' }}>
                    {processSteps.map((step, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <Space size="middle">
                                {renderIcon(index)}
                                <Paragraph
                                    style={{
                                        margin: 0,
                                        fontWeight: index <= currentStepIndex ? 'bold' : 'normal',
                                        color: completedSteps[index] ? 'rgba(0, 0, 0, 0.85)' : (index === currentStepIndex ? '#1890ff' : 'rgba(0, 0, 0, 0.45)')
                                    }}
                                >
                                    {step}
                                </Paragraph>
                            </Space>
                        </div>
                    ))}
                </div>

                {/* Nút đóng cho phép người dùng dừng hoặc đóng (tùy chọn) */}
                <Button
                    onClick={handleViewDetails} // Thay đổi hành động khi hoàn thành
                    type="primary"
                    size="large"
                    style={{ marginTop: '30px' }}
                    disabled={!isFinished} // Chỉ cho phép click khi đã hoàn thành
                >
                    Xem Chi Tiết Bộ Câu Hỏi
                </Button>
            </div>
        </Modal>
    );
};

export default ProcessingModal;