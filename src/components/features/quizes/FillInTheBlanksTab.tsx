import React, { useState, useEffect } from 'react';
import {
    Empty, Card, Button, Input, Tooltip, Popconfirm,
    message, Tag, Divider, Alert
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined,
    SaveOutlined, CloseOutlined
} from '@ant-design/icons';


// --- Interfaces ---
export interface SentenceData {
    sentence_with_blank: string;
    answer: string;
}

interface FillInTheBlanksTabProps {
    data: SentenceData[];
    onUpdate?: (newData: SentenceData[]) => void;
}

// --- Helper: Render câu văn với highlight ---
const renderSentenceWithHighlight = (sentence: string, answer: string | null) => {
    const parts = sentence.split('___');

    if (parts.length === 1) {
        return <span>{sentence}</span>;
    }

    return (
        <span>
            {parts.map((part, i) => (
                <React.Fragment key={i}>
                    {part}
                    {i < parts.length - 1 && (
                        <span className="inline-block border-b-2 border-blue-500 text-blue-600 font-bold px-2 mx-1 bg-blue-50 rounded-t-sm min-w-[40px] text-center">
                            {answer || '___'}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </span>
    );
};

// --- Component Con: Editor ---
const FillBlankEditor: React.FC<{
    item: SentenceData;
    onSave: (newItem: SentenceData) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const [tempItem, setTempItem] = useState<SentenceData>({ ...item });

    return (
        <Card
            className="border-blue-400 shadow-md mb-4"
            title={item.answer ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi điền từ"}
            size="small"
        >
            <Alert
                message="Hướng dẫn"
                description="Sử dụng 3 dấu gạch dưới '___' để đánh dấu vị trí cần điền từ trong câu."
                type="info"
                showIcon
                className="mb-4 text-xs"
            />

            <div className="mb-4">
                <label className="font-semibold block mb-2">Câu văn (chứa `___`):</label>
                <Input.TextArea
                    rows={2}
                    value={tempItem.sentence_with_blank}
                    onChange={(e) => setTempItem({ ...tempItem, sentence_with_blank: e.target.value })}
                    placeholder="Ví dụ: Con mèo đang ___ trên mái nhà."
                    className={!tempItem.sentence_with_blank.includes('___') ? 'border-orange-300' : ''}
                />
                {!tempItem.sentence_with_blank.includes('___') && tempItem.sentence_with_blank.length > 0 && (
                    <div className="text-orange-500 text-xs mt-1">
                        * Cảnh báo: Câu văn chưa có ký tự '___' để làm chỗ trống.
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="font-semibold block mb-2">Đáp án đúng:</label>
                <Input
                    value={tempItem.answer}
                    onChange={(e) => setTempItem({ ...tempItem, answer: e.target.value })}
                    placeholder="Ví dụ: ngủ"
                    prefix={<Tag color="blue">Đáp án</Tag>}
                />
            </div>

            <div className="bg-gray-50 p-3 rounded border border-dashed border-gray-300 mb-4">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Xem trước:</div>
                <div className="text-base text-gray-700">
                    {renderSentenceWithHighlight(tempItem.sentence_with_blank, tempItem.answer)}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <Button icon={<CloseOutlined />} onClick={onCancel}>Hủy</Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                        if (!tempItem.sentence_with_blank.trim()) return message.error("Chưa nhập câu văn");
                        if (!tempItem.answer.trim()) return message.error("Chưa nhập đáp án");
                        if (!tempItem.sentence_with_blank.includes('___')) {
                            message.warning("Đã tự động thêm '___' vào cuối câu vì bạn quên nhập.");
                            tempItem.sentence_with_blank += " ___";
                        }
                        onSave(tempItem);
                    }}
                >
                    Lưu
                </Button>
            </div>
        </Card>
    );
};

// --- Component Con: Viewer ---
const FillBlankViewer: React.FC<{
    index: number;
    item: SentenceData;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ index, item, onEdit, onDelete }) => {
    return (
        <Card
            size="small"
            className="mb-3 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag color="purple">Câu {index + 1}</Tag>
                    </div>
                    <div className="text-base p-3 bg-gray-50 rounded border border-gray-100">
                        {renderSentenceWithHighlight(item.sentence_with_blank, item.answer)}
                    </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>
            </div>
        </Card>
    );
};

// --- Component Chính ---
const FillInTheBlanksTab: React.FC<FillInTheBlanksTabProps> = ({ data, onUpdate }) => {
    const [sentences, setSentences] = useState<SentenceData[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    useEffect(() => {
        if (data) setSentences(data);
    }, [data]);

    const updateParent = (newSentences: SentenceData[]) => {
        setSentences(newSentences);
        if (onUpdate) onUpdate(newSentences);
    };

    // CRUD
    const handleAddNew = () => {
        setIsCreating(true);
        setEditingIndex(null);
    };

    const handleSaveNew = (newItem: SentenceData) => {
        const newSentences = [...sentences, newItem];
        updateParent(newSentences);
        setIsCreating(false);
        message.success('Đã thêm câu hỏi mới');
    };

    const handleSaveEdit = (index: number, updatedItem: SentenceData) => {
        const newSentences = [...sentences];
        newSentences[index] = updatedItem;
        updateParent(newSentences);
        setEditingIndex(null);
        message.success('Đã cập nhật câu hỏi');
    };

    const handleDelete = (index: number) => {
        const newSentences = sentences.filter((_, i) => i !== index);
        updateParent(newSentences);
        message.success('Đã xóa câu hỏi');
    };

    const emptyItem: SentenceData = {
        sentence_with_blank: '',
        answer: ''
    };

    return (
        <div className="max-w-4xl mx-auto pb-8">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 italic">Tổng số: {sentences.length} câu</span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                    disabled={isCreating || editingIndex !== null}
                >
                    Thêm câu hỏi
                </Button>
            </div>

            {sentences.length === 0 && !isCreating ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có dữ liệu điền từ."
                >
                    <Button type="dashed" onClick={handleAddNew}>Tạo câu hỏi đầu tiên</Button>
                </Empty>
            ) : (
                <div className="space-y-4">
                    {sentences.map((item, index) => (
                        <div key={index}>
                            {editingIndex === index ? (
                                <FillBlankEditor
                                    item={item}
                                    onSave={(newItem) => handleSaveEdit(index, newItem)}
                                    onCancel={() => setEditingIndex(null)}
                                />
                            ) : (
                                <FillBlankViewer
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

                    {isCreating && (
                        <div className="animate-fade-in">
                            <Divider dashed>Câu hỏi mới</Divider>
                            <FillBlankEditor
                                item={emptyItem}
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

export default FillInTheBlanksTab;