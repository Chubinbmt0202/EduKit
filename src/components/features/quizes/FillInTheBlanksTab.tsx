/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Modal, Form, Input, Tooltip, Tag } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
// Giả định dùng thư viện uuid để tạo ID ngẫu nhiên
// import { v4 as uuidv4 } from 'uuid'; 

const { Paragraph, Title } = Typography;
const { TextArea } = Input;

// Định nghĩa kiểu dữ liệu cho FillInTheBlankItem
interface FillInTheBlankItem {
    id: string;
    questionContent: string;
    correctAnswers: string[];
    explanation?: string; // Giải thích chi tiết
}

// Dữ liệu giả lập ban đầu
const initialMockBlanks: FillInTheBlankItem[] = [
    {
        id: 'b1',
        questionContent: "Mặt trời mọc ở phía [Đông] và lặn ở phía [Tây].",
        correctAnswers: ["Đông", "Tây"],
        explanation: "Đây là kiến thức cơ bản về địa lý.",
    },
    {
        id: 'b2',
        questionContent: "Trong phép cộng, khi ta đổi chỗ các số hạng thì [tổng] không thay đổi.",
        correctAnswers: ["tổng"],
        explanation: "Đây là tính chất giao hoán của phép cộng.",
    },
    {
        id: 'b4',
        questionContent: "Trong phép cộng, khi ta đổi chỗ các số hạng thì [tổng] không thay đổi.",
        correctAnswers: ["tổng"],
        explanation: "Đây là tính chất giao hoán của phép cộng.",
    },
];

const FillInTheBlanksTab: React.FC = () => {
    const [questions, setQuestions] = useState<FillInTheBlankItem[]>(initialMockBlanks);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<FillInTheBlankItem | null>(null);
    const [form] = Form.useForm();

    // --- Hàm xử lý: XÓA ---
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa câu hỏi',
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
    const handleEdit = (question: FillInTheBlankItem | null) => {
        setEditingQuestion(question);
        setIsModalVisible(true);

        if (question) {
            // Tách các đáp án thành các trường riêng biệt cho Form
            const initialValues: any = {
                questionContent: question.questionContent,
                explanation: question.explanation,
            };
            question.correctAnswers.forEach((ans, index) => {
                initialValues[`answer_${index}`] = ans;
            });
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    };

    const handleSave = (values: any) => {
        // Lấy tất cả đáp án từ form và lọc bỏ các giá trị trống
        const newCorrectAnswers: string[] = Object.keys(values)
            .filter(key => key.startsWith('answer_') && values[key])
            .map(key => values[key]);

        const newQuestion: FillInTheBlankItem = {
            id: editingQuestion?.id || Math.random().toString(36).substr(2, 9), // Tạo ID ngẫu nhiên đơn giản
            questionContent: values.questionContent,
            correctAnswers: newCorrectAnswers,
            explanation: values.explanation,
        };

        if (editingQuestion) {
            setQuestions(questions.map(q => q.id === newQuestion.id ? newQuestion : q));
        } else {
            setQuestions([newQuestion, ...questions]); // Thêm lên đầu
        }

        setIsModalVisible(false);
    };

    // Hàm render từng câu hỏi
    const renderQuestionCard = (item: FillInTheBlankItem, index: number) => {

        return (
            <Card
                style={{ marginBottom: '15px' }}
                key={item.id}
                className='hover:shadow-lg border-l-4 border-orange-500'
                title={<Paragraph strong className='!mb-0 text-base text-orange-700'>Câu {index + 1}: {item.questionContent}</Paragraph>}
                extra={
                    <Space size="small">
                        <Tag color="orange">Điền từ</Tag>
                        <Tooltip title="Chỉnh sửa">
                            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(item)} />
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(item.id)} />
                        </Tooltip>
                    </Space>
                }
            >

                <div className="bg-gray-50 p-3 rounded-md border border-dashed border-gray-300">
                    <Paragraph strong className='!mb-1 text-sm text-gray-600'>Đáp án cần điền:</Paragraph>
                    <Space wrap>
                        {item.correctAnswers.map((answer, i) => (
                            <Tag key={i} color="success" className='text-base py-1 px-3'>
                                {answer}
                            </Tag>
                        ))}
                    </Space>
                </div>
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
                Thêm Câu Hỏi Điền Từ Mới
            </Button>

            {/* Danh sách Câu hỏi */}
            <div style={{
                maxHeight: 'calc(100vh - 350px)',
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
                {questions.map(renderQuestionCard)}
            </div>

            {/* Modal Chỉnh sửa / Thêm */}
            <Modal
                title={editingQuestion ? "Chỉnh sửa Câu hỏi Điền từ" : "Thêm Câu hỏi Điền từ Mới"}
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
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="questionContent"
                        label="Nội dung Câu hỏi (Đánh dấu chỗ trống bằng ngoặc vuông)"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Ví dụ: Thủ đô của Việt Nam là [Hà Nội]."
                        />
                    </Form.Item>

                    <Paragraph type="secondary" className='!mb-4'>
                        **Lưu ý:** Đặt đáp án đúng vào trong dấu ngoặc vuông **`[ ]`** ngay tại vị trí cần điền trong nội dung câu hỏi.
                    </Paragraph>


                    <Title level={5}>Các Đáp án Đúng</Title>
                    <Paragraph type="secondary" className='!mt-0'>
                        Bạn chỉ cần trích xuất các đáp án đã đánh dấu `[ ]` vào các ô dưới đây.
                    </Paragraph>

                    {/* Dùng Form.List nếu muốn quản lý dynamic list, ở đây dùng 4 trường cố định để đơn giản */}
                    {[0, 1, 2, 3].map(i => (
                        <Form.Item
                            key={i}
                            name={`answer_${i}`}
                            label={`Đáp án ${i + 1}`}
                            className='!mb-2'
                        // Thêm rule required nếu ít nhất 1 đáp án phải có, ở đây ta chấp nhận 0, 1... đáp án
                        >
                            <Input placeholder={`Nhập nội dung đáp án đúng ${i + 1} (VD: Hà Nội)`} />
                        </Form.Item>
                    ))}

                    <Form.Item name="explanation" label="Giải thích Đáp án (Tùy chọn)">
                        <TextArea rows={2} placeholder="Giải thích chi tiết về đáp án đúng" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FillInTheBlanksTab;