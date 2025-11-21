import React, { useState, useEffect } from 'react';
import {
    Empty, Card, Radio, Tag, Space, Button, Input,
    Tooltip, Popconfirm, message, Divider
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined,
    SaveOutlined, CloseOutlined, CheckCircleOutlined
} from '@ant-design/icons';

// --- Interfaces ---
export interface QuestionData {
    question_text: string;
    options: string[];
    correct_answer_index: number;
}

interface MultipleChoiceTabProps {
    data: QuestionData[];
    // Callback để báo cho component cha cập nhật lại dữ liệu gốc (nếu cần)
    onUpdate?: (newData: QuestionData[]) => void;
}

// --- Component Con: Form chỉnh sửa câu hỏi ---
const QuestionEditor: React.FC<{
    question: QuestionData;
    onSave: (newQ: QuestionData) => void;
    onCancel: () => void;
}> = ({ question, onSave, onCancel }) => {
    const [tempQ, setTempQ] = useState<QuestionData>({ ...question });

    // Xử lý thay đổi nội dung câu hỏi
    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTempQ({ ...tempQ, question_text: e.target.value });
    };

    // Xử lý thay đổi nội dung đáp án
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...tempQ.options];
        newOptions[index] = value;
        setTempQ({ ...tempQ, options: newOptions });
    };

    // Thêm phương án mới
    const addOption = () => {
        setTempQ({ ...tempQ, options: [...tempQ.options, ''] });
    };

    // Xóa phương án
    const removeOption = (index: number) => {
        if (tempQ.options.length <= 2) {
            message.warning('Câu hỏi trắc nghiệm cần ít nhất 2 phương án!');
            return;
        }
        const newOptions = tempQ.options.filter((_, i) => i !== index);

        // Điều chỉnh lại index đáp án đúng nếu cần
        let newCorrectIndex = tempQ.correct_answer_index;
        if (index === tempQ.correct_answer_index) newCorrectIndex = 0; // Reset về A nếu xóa đúng đáp án
        else if (index < tempQ.correct_answer_index) newCorrectIndex -= 1;

        setTempQ({ ...tempQ, options: newOptions, correct_answer_index: newCorrectIndex });
    };

    return (
        <Card className="border-blue-400 shadow-md mb-4" title="Chỉnh sửa câu hỏi">
            <div className="mb-4">
                <label className="font-semibold block mb-2">Nội dung câu hỏi:</label>
                <Input.TextArea
                    rows={2}
                    value={tempQ.question_text}
                    onChange={handleQuestionChange}
                    placeholder="Nhập câu hỏi..."
                />
            </div>

            <div className="mb-4">
                <label className="font-semibold block mb-2">Các phương án (Chọn tròn để đánh dấu đáp án đúng):</label>
                <Radio.Group
                    className="w-full flex flex-col gap-3"
                    value={tempQ.correct_answer_index}
                    onChange={(e) => setTempQ({ ...tempQ, correct_answer_index: e.target.value })}
                >
                    {tempQ.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <Radio value={idx} />
                            <Input
                                value={opt}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                placeholder={`Phương án ${String.fromCharCode(65 + idx)}`}
                                status={opt.trim() === '' ? 'error' : ''}
                            />
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                type="text"
                                onClick={() => removeOption(idx)}
                                disabled={tempQ.options.length <= 2}
                            />
                        </div>
                    ))}
                </Radio.Group>
                <Button type="dashed" block icon={<PlusOutlined />} onClick={addOption} className="mt-3">
                    Thêm phương án
                </Button>
            </div>

            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <Button icon={<CloseOutlined />} onClick={onCancel}>Hủy</Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                        if (!tempQ.question_text.trim()) return message.error("Chưa nhập câu hỏi");
                        if (tempQ.options.some(o => !o.trim())) return message.error("Không được để trống phương án");
                        onSave(tempQ);
                    }}
                >
                    Lưu
                </Button>
            </div>
        </Card>
    );
};

// --- Component Con: Hiển thị câu hỏi (Read-only) ---
const QuestionViewer: React.FC<{
    index: number;
    item: QuestionData;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ index, item, onEdit, onDelete }) => {
    return (
        <Card
            title={
                <div className="flex items-start gap-2 whitespace-normal">
                    <Tag color="blue" className="mt-1 shrink-0">Câu {index + 1}</Tag>
                    <span className="text-base font-medium">{item.question_text}</span>
                </div>
            }
            size="small"
            className="shadow-sm hover:shadow-md transition-all group mb-4"
            extra={
                <Space className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={onEdit} className="text-blue-600" />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa câu hỏi này?"
                        onConfirm={onDelete}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            }
        >
            <div className="flex flex-col gap-3 mt-2">
                {item.options.map((opt, idx) => {
                    const isCorrect = idx === item.correct_answer_index;
                    return (
                        <div
                            key={idx}
                            className={`
                                px-4 py-2 rounded-lg border flex items-center transition-colors
                                ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}
                            `}
                        >
                            <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center mr-3 border text-xs font-bold
                                ${isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-gray-500 border-gray-300'}
                            `}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className={`flex-1 ${isCorrect ? 'font-medium text-green-800' : 'text-gray-700'}`}>
                                {opt}
                            </span>
                            {isCorrect && <CheckCircleOutlined className="text-green-500 ml-2" />}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

// --- Component Chính ---
const MultipleChoiceTab: React.FC<MultipleChoiceTabProps> = ({ data, onUpdate }) => {
    // Local state để quản lý CRUD ngay lập tức trên giao diện
    const [questions, setQuestions] = useState<QuestionData[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    // Sync với props data khi mới load
    useEffect(() => {
        if (data) {
            setQuestions(data);
        }
    }, [data]);

    // Helper cập nhật lên component cha
    const updateParent = (newQuestions: QuestionData[]) => {
        setQuestions(newQuestions);
        if (onUpdate) {
            onUpdate(newQuestions);
        }
    };

    // 1. CREATE
    const handleAddNew = () => {
        setIsCreating(true);
        setEditingIndex(null); // Đảm bảo không edit câu khác khi đang tạo mới
    };

    const handleSaveNew = (newQ: QuestionData) => {
        const newQuestions = [...questions, newQ];
        updateParent(newQuestions);
        setIsCreating(false);
        message.success('Đã thêm câu hỏi mới');
    };

    // 2. UPDATE
    const handleSaveEdit = (index: number, updatedQ: QuestionData) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQ;
        updateParent(newQuestions);
        setEditingIndex(null);
        message.success('Đã lưu thay đổi');
    };

    // 3. DELETE
    const handleDelete = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        updateParent(newQuestions);
        message.success('Đã xóa câu hỏi');
    };

    const emptyQuestionTemplate: QuestionData = {
        question_text: '',
        options: ['', '', '', ''],
        correct_answer_index: 0
    };

    return (
        <div className="max-w-4xl mx-auto pb-8">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 italic">Tổng số: {questions.length} câu hỏi</span>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew} disabled={isCreating || editingIndex !== null}>
                    Thêm câu hỏi
                </Button>
            </div>

            {questions.length === 0 && !isCreating ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có câu hỏi nào."
                >
                    <Button type="dashed" onClick={handleAddNew}>Tạo câu hỏi đầu tiên</Button>
                </Empty>
            ) : (
                <div className="space-y-4">
                    {/* Danh sách câu hỏi hiện có */}
                    {questions.map((item, index) => (
                        <div key={index}>
                            {editingIndex === index ? (
                                <QuestionEditor
                                    question={item}
                                    onSave={(newQ) => handleSaveEdit(index, newQ)}
                                    onCancel={() => setEditingIndex(null)}
                                />
                            ) : (
                                <QuestionViewer
                                    index={index}
                                    item={item}
                                    onEdit={() => {
                                        setEditingIndex(index);
                                        setIsCreating(false);
                                    }}
                                    onDelete={() => handleDelete(index)}
                                />
                            )}
                        </div>
                    ))}

                    {/* Form tạo mới nằm cuối danh sách */}
                    {isCreating && (
                        <div className="animate-fade-in">
                            <Divider dashed>Câu hỏi mới</Divider>
                            <QuestionEditor
                                question={emptyQuestionTemplate}
                                onSave={handleSaveNew}
                                onCancel={() => setIsCreating(false)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultipleChoiceTab;