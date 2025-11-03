// src/components/features/quizes/MultipleChoiceEditModal.tsx (Phiên bản đã chỉnh sửa)
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Typography, Space, Modal, Form, Input, Radio } from 'antd'; // Import ModalFuncProps nếu cần
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

interface MCQItem {
    id: string;
    question: string;
    options: string[];
    correct: string;
    explanation?: string;
}

interface MultipleChoiceEditModalProps {
    isModalVisible: boolean;
    editingQuestion: MCQItem | null;
    onClose: () => void;
    onSave: (question: MCQItem) => void;
}

const MultipleChoiceEditModal: React.FC<MultipleChoiceEditModalProps> = ({
    isModalVisible,
    editingQuestion,
    onClose,
    onSave,
}) => {
    const [form] = Form.useForm();

    // Sử dụng useEffect để đồng bộ dữ liệu của Form với editingQuestion khi Modal mở
    React.useEffect(() => {
        // ... (Logic đồng bộ hóa dữ liệu) ...
    }, [editingQuestion, form, isModalVisible]);

    // Xử lý khi Form submit
    const handleFormSubmit = (values: any) => {
        const newOptions = [values.option_0, values.option_1, values.option_2, values.option_3].filter(Boolean);

        // Kiểm tra nếu đáp án đúng được chọn
        if (!values.correct_option) {
            Modal.error({ title: 'Lỗi', content: 'Vui lòng chọn đáp án đúng.' });
            return;
        }

        // Đáp án đúng giờ là index, cần lấy nội dung từ values
        const correctIndex = parseInt(values.correct_option, 10);
        const correctContent = newOptions[correctIndex];

        if (!correctContent) {
            Modal.error({ title: 'Lỗi', content: 'Đáp án đúng được chọn không hợp lệ.' });
            return;
        }

        const newQuestion: MCQItem = {
            id: editingQuestion?.id || Math.random().toString(36).substr(2, 9),
            question: values.question,
            options: newOptions,
            correct: correctContent, // Lưu nội dung đáp án đúng
            explanation: values.explanation,
        };

        onSave(newQuestion);
    };

    return (
        <Modal
            title={editingQuestion ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi Trắc nghiệm Mới"}
            open={isModalVisible}
            onCancel={onClose}
            centered={true}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    Lưu Câu Hỏi
                </Button>,
            ]}
            width={800}
        >
            <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 10 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="question"
                        label="Nội dung Câu hỏi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
                    >
                        <TextArea rows={3} placeholder="Ví dụ: Ai là người đặt tên cho Trí tuệ nhân tạo?" />
                    </Form.Item>

                    <Form.Item name="explanation" label="Giải thích Đáp án (Tùy chọn)">
                        <TextArea rows={2} placeholder="Giải thích chi tiết về đáp án đúng" />
                    </Form.Item>

                    <Title level={5}>Các Lựa Chọn và Xác định Đáp án Đúng</Title>

                    {/* ⭐ Thẻ bao ngoài cho Radio Group và Inputs ⭐ */}
                    <Form.Item
                        name="correct_option"
                        label="Đáp án Đúng"
                        rules={[{ required: true, message: 'Vui lòng chọn một đáp án đúng.' }]}
                    >
                        <Radio.Group className='w-full'>
                            {[0, 1, 2, 3].map(i => (
                                <Space key={i} align="start" className='w-full mb-3'>
                                    {/* Radio Button */}
                                    <Radio
                                        value={i}
                                        className='flex-shrink-0'
                                    >
                                        <CheckCircleOutlined className='mr-1' /> {String.fromCharCode(65 + i)}.
                                    </Radio>

                                    {/* Input cho lựa chọn */}
                                    <Form.Item
                                        name={`option_${i}`}
                                        rules={[{ required: i < 2, message: 'Lựa chọn không được trống' }]}
                                        className='flex-grow !mb-0'
                                    >
                                        <Input placeholder={`Nội dung lựa chọn ${String.fromCharCode(65 + i)}`} />
                                    </Form.Item>
                                </Space>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    {/* Giữ lại Input Options ban đầu, nhưng di chuyển vào Form.Item của Radio Group */}
                </Form>
            </div>
        </Modal>
    );
};

export default MultipleChoiceEditModal;