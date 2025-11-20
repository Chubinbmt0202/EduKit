// src/components/CreateQuizModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Progress, Button } from 'antd';
// 🆕 Thêm icon và kiểu dáng mới
import { LoadingOutlined, CheckCircleOutlined, ThunderboltOutlined, CloseCircleOutlined, RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface ProcessingModalProps {
    isVisible: boolean;
    onClose: () => void;
    // 💡 Thêm props để truyền ID của Quiz đã tạo
    quizId?: string;
    // Thêm props trạng thái lỗi thực tế (nếu có)
    hasError?: boolean;
}

// 💡 Màu sắc và thời gian AI/Công nghệ
const PRIMARY_COLOR = '#00BCD4'; // Màu Cyan hiện đại
const ERROR_COLOR = '#FF4D4F';
const STEP_DURATION_MS = 1500; // 1.5 giây cho mỗi bước

// Định nghĩa các bước tiến trình
const processSteps = [
    'Đang kết nối mô hình Gemini',
    'Phân tích ngữ cảnh tài liệu (Mục tiêu, Khái niệm)',
    'Tạo và sàng lọc câu hỏi thô',
    'Chuyển đổi sang định dạng trò chơi (Trắc nghiệm, Nối cặp,...)',
    'Kiểm tra tính chính xác và logic',
    'Hoàn thiện và Lưu trữ kết quả (Firestore)',
];

// Hàm giả lập tạo ra giá trị ngẫu nhiên cho micro-progress
const getMicroProgress = (basePercent: number, stepIndex: number, totalSteps: number) => {
    // Nếu chưa xong bước cuối, trả về tiến trình giả từ basePercent đến basePercent + (100/totalSteps * 0.9)
    if (stepIndex < totalSteps) {
        const stepSize = 100 / totalSteps;
        const start = basePercent;
        const max = start + stepSize;
        // Giả lập tiến trình nhỏ trong khoảng 10% cuối của bước trước
        return Math.min(99, Math.floor(Math.random() * (max - start) * 0.8 + start));
    }
    return 100;
};

const ProcessingModal: React.FC<ProcessingModalProps> = ({ isVisible, onClose, quizId, hasError }) => {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [completedSteps, setCompletedSteps] = useState(Array(processSteps.length).fill(false));
    // Sử dụng state riêng cho micro-progress
    const [microProgress, setMicroProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isError, setIsError] = useState(false); // State lỗi

    // Tính toán tiến trình cố định cho các bước đã hoàn thành
    const baseProgressPercent = (currentStepIndex / processSteps.length) * 100;

    // Effect đặt lại trạng thái khi Modal mở
    useEffect(() => {
        if (isVisible) {
            setCurrentStepIndex(0);
            setCompletedSteps(Array(processSteps.length).fill(false));
            setMicroProgress(0);
            setIsFinished(false);
            // Thiết lập trạng thái lỗi dựa trên props (nếu có lỗi ngay từ đầu)
            setIsError(hasError || false);
        }
    }, [isVisible, hasError]);

    // Effect quản lý luồng animation
    useEffect(() => {
        if (!isVisible || currentStepIndex >= processSteps.length || isFinished || isError) return;

        // Xử lý Micro-Progress Bar (Tạo cảm giác đang làm việc)
        const microProgressInterval = setInterval(() => {
            setMicroProgress(prev => {
                const nextMicroProgress = getMicroProgress(baseProgressPercent, currentStepIndex, processSteps.length);
                if (nextMicroProgress > prev) return nextMicroProgress;
                return prev;
            });
        }, 150);

        // Timer cho bước chính
        const stepTimer = setTimeout(() => {
            // 1. Cập nhật trạng thái hoàn thành cho bước hiện tại
            setCompletedSteps(prev => {
                const newCompleted = [...prev];
                newCompleted[currentStepIndex] = true;
                return newCompleted;
            });

            // 2. Chuyển sang bước tiếp theo
            if (currentStepIndex < processSteps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
            } else {
                // Đã hoàn thành tất cả các bước
                setIsFinished(true);
                setMicroProgress(100); // Đảm bảo thanh tiến trình kết thúc ở 100%
            }

            clearInterval(microProgressInterval); // Dừng micro progress khi bước kết thúc
        }, STEP_DURATION_MS);

        return () => {
            clearTimeout(stepTimer);
            clearInterval(microProgressInterval);
        };
    }, [isVisible, currentStepIndex, isFinished, isError, baseProgressPercent]);

    // Hàm render icon cho từng bước
    const renderIcon = (index: number) => {
        if (isError) {
            // Hiển thị lỗi ngay lập tức
            return <CloseCircleOutlined style={{ color: ERROR_COLOR, fontSize: '18px' }} />;
        }

        if (completedSteps[index]) {
            // Hoàn thành
            return <CheckCircleOutlined style={{ color: PRIMARY_COLOR, fontSize: '18px' }} />;
        } else if (index === currentStepIndex) {
            // Đang loading
            return <LoadingOutlined spin style={{ color: PRIMARY_COLOR, fontSize: '18px' }} />;
        } else {
            // Chưa tới
            return <ThunderboltOutlined style={{ color: '#d9d9d9', fontSize: '18px' }} />;
        }
    }

    const handleViewDetails = () => {
        if (isFinished && quizId) {
            onClose();
            navigate(`/folders/quizzes/${quizId}`);
        } else {
            onClose();
        }
    }

    const modalTitle = isError ? '❌ Xử lý thất bại' : (isFinished ? '✅ Hoàn thành' : '⚙️ AI đang xử lý');
    const titleColor = isError ? ERROR_COLOR : (isFinished ? PRIMARY_COLOR : '#000');
    const robotIcon = isError ? <CloseCircleOutlined style={{ fontSize: '48px', color: ERROR_COLOR }} /> : (isFinished ? <CheckCircleOutlined style={{ fontSize: '48px', color: PRIMARY_COLOR }} /> : <RobotOutlined style={{ fontSize: '48px', color: PRIMARY_COLOR }} />);

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
            // 💡 Thêm style hiện đại (backdrop filter - cần Ant Design v5+)
            styles={{
                mask: { backdropFilter: 'blur(3px)' }
            }}
        >
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                {robotIcon}
                <Title level={3} style={{ margin: '10px 0 20px 0', color: titleColor }}>
                    {modalTitle}
                </Title>
                <Paragraph style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                    {isError ? 'Đã xảy ra lỗi trong quá trình xử lý AI. Vui lòng kiểm tra lại Credits và tài liệu.' : (isFinished ? 'Bộ câu hỏi của bạn đã được tạo thành công và lưu vào thư mục của bạn.' : 'Vui lòng chờ trong giây lát. Hệ thống đang tạo bộ câu hỏi đa dạng từ tài liệu của bạn.')}
                </Paragraph>

                <div style={{ padding: '0 20px' }}>
                    {/* Thanh tiến trình tổng thể (sử dụng microProgress) */}
                    <Progress
                        percent={Math.round(microProgress)}
                        showInfo={true}
                        status={isError ? 'exception' : (isFinished ? 'success' : 'active')}
                        strokeColor={isError ? ERROR_COLOR : PRIMARY_COLOR}
                        style={{ marginBottom: '30px' }}
                    />
                </div>

                {/* Danh sách các bước tiến trình */}
                <div style={{ textAlign: 'left', maxHeight: '200px', overflowY: 'auto', padding: '0 20px' }}>
                    {processSteps.map((step, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <Space size="middle">
                                {renderIcon(index)}
                                <Paragraph
                                    style={{
                                        margin: 0,
                                        fontWeight: index <= currentStepIndex || isFinished ? 'bold' : 'normal',
                                        // 💡 Đổi màu sắc
                                        color: isError ? ERROR_COLOR : (completedSteps[index] || isFinished ? PRIMARY_COLOR : (index === currentStepIndex ? '#000' : 'rgba(0, 0, 0, 0.45)'))
                                    }}
                                >
                                    {step}
                                </Paragraph>
                            </Space>
                        </div>
                    ))}
                    {isError && (
                        <div style={{ marginBottom: '15px' }}>
                            <Space size="middle">
                                <CloseCircleOutlined style={{ color: ERROR_COLOR, fontSize: '18px' }} />
                                <Paragraph style={{ margin: 0, fontWeight: 'bold', color: ERROR_COLOR }}>
                                    Lỗi: Quá trình bị gián đoạn.
                                </Paragraph>
                            </Space>
                        </div>
                    )}
                </div>

                {/* Nút hành động */}
                <Button
                    onClick={handleViewDetails}
                    type={isFinished ? 'primary' : 'default'}
                    danger={isError}
                    size="large"
                    style={{ marginTop: '30px' }}
                    // 💡 Cho phép đóng/xem khi lỗi hoặc hoàn thành
                    disabled={!isFinished && !isError}
                >
                    {isError ? 'Đóng và thử lại' : 'Xem Chi Tiết Bộ Câu Hỏi'}
                </Button>
            </div>
        </Modal>
    );
};

export default ProcessingModal;