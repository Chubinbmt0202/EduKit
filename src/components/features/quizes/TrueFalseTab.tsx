/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Modal, Form, Input, Tooltip, Tag, Radio } from 'antd';
import {
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    QuestionCircleOutlined
} from '@ant-design/icons';

const { Paragraph } = Typography;
const { TextArea } = Input;

// Định nghĩa kiểu dữ liệu
interface TrueFalseItem {
    id: string;
    question: string;       // Câu phát biểu
    correctAnswer: boolean; // true = Đúng, false = Sai
    explanation?: string;   // Giải thích chi tiết
}

// Dữ liệu giả lập ban đầu
const initialMockTrueFalse: TrueFalseItem[] = [
    {
        id: 'tf1',
        question: "Trái đất quay quanh Mặt trời.",
        correctAnswer: true,
        explanation: "Đây là sự thật cơ bản trong hệ mặt trời.",
    },
    {
        id: 'tf2',
        question: "Nước đóng băng ở 0 độ C.",
        correctAnswer: true,
        explanation: "Nước tinh khiết đóng băng ở nhiệt độ 0 độ C dưới áp suất tiêu chuẩn.",
    },
    {
        id: 'tf3',
        question: "Cá là loài lưỡng cư.",
        correctAnswer: false,
        explanation: "Cá là loài cá (fish), lưỡng cư (amphibian) bao gồm ếch, cóc.",
    },
];

const TrueFalseTab: React.FC = () => {
    const [questions, setQuestions] = useState<TrueFalseItem[]>(initialMockTrueFalse);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<TrueFalseItem | null>(null);
    const [form] = Form.useForm();

    // --- Hàm xử lý: XÓA ---
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa câu hỏi Đúng/Sai',
            content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                setQuestions(questions.filter(q => q.id !== id));
            },
        });
    };

    // --- Hàm xử lý: CHỈNH SỬA / THÊM ---
    const handleEdit = (question: TrueFalseItem | null) => {
        setEditingQuestion(question);
        setIsModalVisible(true);

        if (question) {
            // Chuyển boolean sang chuỗi 'true'/'false' để Radio.Group nhận giá trị
            form.setFieldsValue({
                question: question.question,
                correctAnswer: question.correctAnswer ? 'true' : 'false',
                explanation: question.explanation,
            });
        } else {
            form.resetFields();
        }
    };

    // --- Hàm xử lý: LƯU ---
    const handleSave = (values: any) => {
        const newQuestion: TrueFalseItem = {
            id: editingQuestion?.id || Math.random().toString(36).substr(2, 9),
            question: values.question,
            // Chuyển chuỗi 'true'/'false' từ Form về boolean
            correctAnswer: values.correctAnswer === 'true',
            explanation: values.explanation,
        };

        if (editingQuestion) {
            setQuestions(questions.map(q => q.id === newQuestion.id ? newQuestion : q));
        } else {
            setQuestions([newQuestion, ...questions]);
        }

        setIsModalVisible(false);
    };

    // Hàm render từng câu hỏi
    const renderQuestionCard = (item: TrueFalseItem, index: number) => {
        const isTrue = item.correctAnswer;
        const color = isTrue ? 'green' : 'red';
        const answerText = isTrue ? 'Đúng' : 'Sai';
        const AnswerIcon = isTrue ? CheckCircleFilled : CloseCircleFilled;

        return (
            <Card
                key={item.id}
                style={{ marginBottom: '10px' }}
                className='mb-4 hover:shadow-lg border-l-4 border-green-500' // Màu Green
                title={<Paragraph strong className='!mb-0 text-base text-green-700'>Câu {index + 1}:</Paragraph>}
                extra={
                    <Space size="small">
                        <Tag color="green">Đúng/Sai</Tag>
                        <Tooltip title="Chỉnh sửa">
                            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(item)} />
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(item.id)} />
                        </Tooltip>
                    </Space>
                }
                bodyStyle={{ padding: '12px 24px' }}
            >
                {/* Nội dung câu phát biểu */}
                <div className="mb-3 p-3 bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <Paragraph className='text-lg !mb-0'>{item.question}</Paragraph>
                </div>

                {/* Đáp án */}
                <div className='flex items-center space-x-3'>
                    <Paragraph strong className='!mb-0 text-md'>Đáp án đúng:</Paragraph>
                    <Tag icon={<AnswerIcon />} color={color} className='text-base py-1 px-3'>
                        {answerText}
                    </Tag>
                </div>


                {item.explanation && (
                    <div className='mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-md'>
                        <Paragraph strong className='!mb-1'><QuestionCircleOutlined className="mr-2 text-green-500" />Giải thích:</Paragraph>
                        <Paragraph className='!mb-0 text-sm'>{item.explanation}</Paragraph>
                    </div>
                )}
            </Card>
        );
    };

    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => handleEdit(null)}
                className='mb-6'
            >
                Thêm Câu Hỏi Đúng/Sai Mới
            </Button>

            {/* Danh sách Câu hỏi */}
            <div style={{
                maxHeight: 'calc(100vh - 330px)',
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
                {questions.map(renderQuestionCard)}
            </div>

            {/* Modal Chỉnh sửa / Thêm */}
            <Modal
                title={editingQuestion ? "Chỉnh sửa Câu hỏi Đúng/Sai" : "Thêm Câu hỏi Đúng/Sai Mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Lưu Câu Hỏi
                    </Button>,
                ]}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="question"
                        label="Câu phát biểu"
                        rules={[{ required: true, message: 'Vui lòng nhập câu phát biểu' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Ví dụ: Cá là loài lưỡng cư."
                        />
                    </Form.Item>

                    <Form.Item
                        name="correctAnswer"
                        label="Đáp án Đúng"
                        rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng' }]}
                    >
                        {/* Lưu giá trị là chuỗi 'true' hoặc 'false' */}
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="true">
                                <CheckCircleOutlined className='mr-1' /> Đúng
                            </Radio.Button>
                            <Radio.Button value="false">
                                <CloseCircleFilled className='mr-1' /> Sai
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="explanation" label="Giải thích Đáp án (Tùy chọn)">
                        <TextArea rows={2} placeholder="Giải thích chi tiết tại sao đáp án lại là Đúng hoặc Sai" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TrueFalseTab;