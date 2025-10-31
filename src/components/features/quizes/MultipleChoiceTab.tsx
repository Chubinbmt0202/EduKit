/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Radio, Tag, Modal, Form, Input, Select, Tooltip, Collapse } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
// import { v4 as uuidv4 } from 'uuid'; // Giả định dùng thư viện uuid

const { Paragraph, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

// Định nghĩa kiểu dữ liệu cho Question
interface MCQItem {
    id: string;
    question: string;
    options: string[];
    correct: string; // Nội dung đáp án đúng
    explanation?: string; // Thêm giải thích
}

// Dữ liệu giả lập ban đầu
const initialMockMCQ: MCQItem[] = [
    {
        id: '1',
        question: "Trong phép tính 9 + 4 = 13, số 4 đã được tách thành bao nhiêu và bao nhiêu theo Cách 1?",
        options: ["1 và 3", "2 và 2", "1 và 4", "3 và 1"],
        correct: "1 và 3",
        explanation: "Để cộng 9 với 4, ta tách 4 thành 1 và 3. Lấy 9 cộng 1 bằng 10, sau đó lấy 10 cộng 3 bằng 13.",
    },
    {
        id: '2',
        question: "Để tính nhanh 20 + 7 + 3, bạn nên nhóm các số nào?",
        options: ["(20 + 7)", "(20 + 3)", "(7 + 3)", "Không cần nhóm"],
        correct: "(7 + 3)",
        explanation: "Quy tắc tính nhanh là nhóm các số có tổng là số tròn chục. Ở đây, (7 + 3 = 10) là hợp lý nhất.",
    },
    {
        id: '3',
        question: "Để tính nhanh 20 + 7 + 3, bạn nên nhóm các số nào?",
        options: ["(20 + 7)", "(20 + 3)", "(7 + 3)", "Không cần nhóm"],
        correct: "(7 + 3)",
        explanation: "Quy tắc tính nhanh là nhóm các số có tổng là số tròn chục. Ở đây, (7 + 3 = 10) là hợp lý nhất.",
    },
];

const MultipleChoiceTab: React.FC = () => {
    const [questions, setQuestions] = useState<MCQItem[]>(initialMockMCQ);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<MCQItem | null>(null);
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
    const handleEdit = (question: MCQItem | null) => {
        setEditingQuestion(question);
        setIsModalVisible(true);

        if (question) {
            // Thiết lập giá trị cho Form khi chỉnh sửa
            form.setFieldsValue({
                question: question.question,
                correct_option: question.correct,
                explanation: question.explanation, // Thêm dòng này để load giải thích
                option_0: question.options[0] || '',
                option_1: question.options[1] || '',
                option_2: question.options[2] || '',
                option_3: question.options[3] || '',
            });
        } else {
            form.resetFields();
        }
    };

    const handleSave = (values: any) => {
        const newOptions = [values.option_0, values.option_1, values.option_2, values.option_3].filter(Boolean);

        const newQuestion: MCQItem = {
            id: editingQuestion?.id || Math.random().toString(36).substr(2, 9), // Tạo ID ngẫu nhiên đơn giản
            question: values.question,
            options: newOptions,
            correct: values.correct_option,
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
    const renderQuestionCard = (item: MCQItem) => {
        return (
            <Card
                key={item.id}
                style={{
                    marginBottom: '10px',
                }}
                className='mb-4 hover:shadow-lg transition-shadow'
                title={<span className='font-semibold'>Câu {item.id}: {item.question}</span>}
                extra={

                    <Space size="small">

                        <Tag color="geekblue">Mức độ: Dễ</Tag>

                        {/* Nút Chỉnh sửa: Đổi sang type="primary" hoặc style */}
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                type="primary" // Thay đổi type để có màu nền xanh mặc định
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => handleEdit(item)}
                            />
                        </Tooltip>

                        {/* Nút Xóa: Giữ nguyên danger để có màu đỏ */}
                        <Tooltip title="Xóa">
                            <Button
                                type="primary" // Thay đổi type="primary" 
                                danger // Giữ danger để làm nổi bật màu đỏ
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={() => handleDelete(item.id)}
                            />
                        </Tooltip>
                    </Space >
                }
            >
                {/* Dùng Flexbox để chia layout */}
                < div className={`flex flex-col ${item.explanation ? 'lg:flex-row' : ''} lg:space-x-4`}>

                    {/* Cột 1: Đáp án (Luôn chiếm 100% trên mobile, 50% trên desktop nếu có giải thích) */}
                    < div className={`${item.explanation ? 'lg:w-1/2' : 'w-full'} mb-4 lg:mb-0`}>
                        <Radio.Group value={item.correct} className='mt-2 w-full'>
                            <Space direction="vertical" className='w-full'>
                                {item.options.map((opt, i) => {
                                    const isCorrect = opt === item.correct;
                                    return (
                                        <div
                                            key={i}
                                            className={`p-2 rounded-md transition-all flex items-center w-full ${isCorrect ? 'bg-green-50 border border-green-300' : 'hover:bg-gray-50'}`}
                                        >
                                            <Radio
                                                value={opt}
                                                disabled
                                                style={{ color: isCorrect ? 'green' : undefined, fontWeight: 'bold' }}
                                            >
                                                <span className='mr-2 font-semibold'>{String.fromCharCode(65 + i)}.</span>
                                                {opt}
                                            </Radio>
                                            {isCorrect && <CheckCircleFilled className="text-green-500 ml-auto" />}
                                        </div>
                                    );
                                })}
                            </Space>
                        </Radio.Group>
                    </div >

                    {/* Cột 2: Giải thích (Chỉ hiển thị nếu có, chiếm 50% trên desktop) */}
                    {
                        item.explanation && (
                            <div className='lg:w-1/2'>
                                <Collapse bordered={false} defaultActiveKey={['1']} className='bg-white'>
                                    <Panel
                                        header={<Space><CheckCircleOutlined className="text-blue-500" /> Giải thích đáp án</Space>}
                                        key="1"
                                        className='!border-t-0' // Loại bỏ đường viền trên đầu Panel
                                    >
                                        <Paragraph className='bg-blue-50 p-3 rounded-md !mb-0'>{item.explanation}</Paragraph>
                                    </Panel>
                                </Collapse>
                            </div>
                        )
                    }
                </div >
            </Card >
        );
    };

    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            {/* Nút Thêm */}
            <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => handleEdit(null)}
                className='mb-6'
            >
                Thêm Câu Hỏi Thủ Công
            </Button>

            {/* Danh sách Câu hỏi */}
            <div style={{
                maxHeight: 'calc(100vh - 300px)', // Giới hạn chiều cao và cho phép cuộn
                overflowY: 'auto',
                paddingRight: '10px' // Để tạo khoảng trống cho thanh cuộn
            }}>
                {questions.map(renderQuestionCard)}
            </div>

            {/* Modal Chỉnh sửa / Thêm (Giữ nguyên) */}
            <Modal
                title={editingQuestion ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi Trắc nghiệm Mới"}
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
                    initialValues={{
                        question: editingQuestion?.question || '',
                        correct_option: editingQuestion?.correct || '',
                        explanation: editingQuestion?.explanation || '',
                        option_0: editingQuestion?.options[0] || '',
                        option_1: editingQuestion?.options[1] || '',
                        option_2: editingQuestion?.options[2] || '',
                        option_3: editingQuestion?.options[3] || '',
                    }}
                >
                    <Form.Item name="question" label="Nội dung Câu hỏi" rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}>
                        <TextArea rows={3} placeholder="Ví dụ: Ai là người đặt tên cho Trí tuệ nhân tạo?" />
                    </Form.Item>

                    <Form.Item name="explanation" label="Giải thích Đáp án (Tùy chọn)">
                        <TextArea rows={2} placeholder="Giải thích chi tiết về đáp án đúng" />
                    </Form.Item>

                    <Title level={5}>Các Lựa Chọn và Đáp án Đúng</Title>

                    {/* Input cho 4 lựa chọn */}
                    {[0, 1, 2, 3].map(i => (
                        <Space key={i} align="start" className='w-full mb-3'>
                            <Paragraph strong>{String.fromCharCode(65 + i)}.</Paragraph>
                            <Form.Item
                                name={`option_${i}`}
                                rules={[{ required: true, message: 'Lựa chọn không được trống' }]}
                                className='flex-grow !mb-0'
                            >
                                <Input placeholder={`Lựa chọn ${String.fromCharCode(65 + i)}`} />
                            </Form.Item>
                        </Space>
                    ))}

                    {/* Chọn đáp án đúng */}
                    <Form.Item name="correct_option" label="Xác định Đáp án Đúng" rules={[{ required: true, message: 'Vui lòng xác định đáp án đúng' }]}>
                        <Select placeholder="Chọn nội dung của đáp án chính xác">
                            {/* Dùng Form Watch hoặc cập nhật động khi các option input thay đổi */}
                            <Form.Item noStyle shouldUpdate={(prevValues, curValues) =>
                                prevValues.option_0 !== curValues.option_0 ||
                                prevValues.option_1 !== curValues.option_1 ||
                                prevValues.option_2 !== curValues.option_2 ||
                                prevValues.option_3 !== curValues.option_3
                            }>
                                {() => {
                                    const options = [
                                        form.getFieldValue('option_0'),
                                        form.getFieldValue('option_1'),
                                        form.getFieldValue('option_2'),
                                        form.getFieldValue('option_3'),
                                    ];
                                    return options.map((optContent, i) => {
                                        if (!optContent) return null;
                                        return (
                                            <Option key={i} value={optContent}>
                                                {String.fromCharCode(65 + i)}. {optContent}
                                            </Option>
                                        );
                                    });
                                }}
                            </Form.Item>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default MultipleChoiceTab;