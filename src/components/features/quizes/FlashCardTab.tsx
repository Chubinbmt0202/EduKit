import React, { useState, useEffect } from 'react';
import {
    Empty, Card, Button, Input, Tooltip, Popconfirm,
    message, List, Typography, Tag
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined,
    SaveOutlined, CloseOutlined, BulbOutlined,
    ReadOutlined
} from '@ant-design/icons';

const { Paragraph } = Typography;

// --- Interfaces ---
export interface FlashcardData {
    front: string;
    back: string;
}

interface FlashcardsTabProps {
    data: FlashcardData[];
    title?: string; // Tiêu đề bộ thẻ (nếu có)
    onUpdate?: (newData: FlashcardData[]) => void;
}

// --- Component Con: Editor (Form chỉnh sửa) ---
const FlashcardEditor: React.FC<{
    card: FlashcardData;
    onSave: (newCard: FlashcardData) => void;
    onCancel: () => void;
}> = ({ card, onSave, onCancel }) => {
    const [tempCard, setTempCard] = useState<FlashcardData>({ ...card });

    return (
        <Card
            className="border-indigo-400 shadow-lg mb-6 transform scale-105 transition-transform"
            title={card.front ? "Chỉnh sửa thẻ" : "Thêm thẻ mới"}
            size="small"
            headStyle={{ background: '#f0f5ff', color: '#1d39c4' }}
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* MẶT TRƯỚC */}
                <div className="flex-1 bg-white p-2 rounded">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold">
                        <BulbOutlined /> Mặt trước (Thuật ngữ/Câu hỏi)
                    </div>
                    <Input.TextArea
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        value={tempCard.front}
                        onChange={(e) => setTempCard({ ...tempCard, front: e.target.value })}
                        placeholder="Ví dụ: Hello"
                        className="text-lg font-medium"
                    />
                </div>

                {/* Divider dọc cho desktop */}
                <div className="hidden md:block w-px bg-gray-200 self-stretch mx-2"></div>

                {/* MẶT SAU */}
                <div className="flex-1 bg-white p-2 rounded">
                    <div className="flex items-center gap-2 mb-2 text-purple-600 font-semibold">
                        <ReadOutlined /> Mặt sau (Định nghĩa/Đáp án)
                    </div>
                    <Input.TextArea
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        value={tempCard.back}
                        onChange={(e) => setTempCard({ ...tempCard, back: e.target.value })}
                        placeholder="Ví dụ: Xin chào"
                        className="text-gray-600"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <Button icon={<CloseOutlined />} onClick={onCancel}>Hủy</Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                        if (!tempCard.front.trim() || !tempCard.back.trim()) {
                            return message.error("Vui lòng nhập nội dung cho cả 2 mặt");
                        }
                        onSave(tempCard);
                    }}
                >
                    Lưu thẻ
                </Button>
            </div>
        </Card>
    );
};

// --- Component Con: Viewer (Hiển thị thẻ) ---
const FlashcardViewer: React.FC<{
    index: number;
    card: FlashcardData;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ index, card, onEdit, onDelete }) => {
    return (
        <Card
            hoverable
            // Thêm 'h-full' để Card cao full chiều cao của cột
            // Thêm 'flex flex-col' để quản lý layout bên trong
            className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-indigo-500 group relative overflow-hidden"

            // Quan trọng: Body style phải là flex column và flex: 1 để nó giãn hết cỡ
            bodyStyle={{
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                height: '100%' // Đảm bảo body chiếm toàn bộ height
            }}
        >
            {/* Số thứ tự mờ */}
            <div className="absolute top-2 right-3 text-5xl text-gray-100 font-black pointer-events-none select-none z-0">
                {index + 1}
            </div>

            {/* Nút Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 p-1 rounded backdrop-blur-sm">
                <Tooltip title="Sửa">
                    <Button size="small" type="text" icon={<EditOutlined />} onClick={onEdit} className="text-blue-600" />
                </Tooltip>
                <Popconfirm
                    title="Xóa thẻ này?"
                    onConfirm={onDelete}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true, size: 'small' }}
                >
                    <Tooltip title="Xóa">
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Popconfirm>
            </div>

            {/* --- PHẦN MẶT TRƯỚC (Flex-1 để giãn) --- */}
            <div className="p-5 flex-1 flex flex-col items-center justify-center text-center border-b border-gray-100 bg-white relative z-1">
                <Tag color="indigo" className="mb-3 text-xs font-bold px-2 py-0.5 rounded-full">Mặt trước</Tag>
                <Paragraph
                    // Bỏ ellipsis cố định dòng, để nó tự giãn theo nội dung
                    className="text-xl font-bold text-gray-800 m-0 w-full break-words"
                >
                    {card.front}
                </Paragraph>
            </div>

            {/* --- PHẦN MẶT SAU (Flex-1 để giãn) --- */}
            <div className="p-5 flex-1 flex flex-col items-center justify-center text-center bg-gray-50 relative z-1">
                <Tag color="purple" className="mb-3 text-xs font-bold px-2 py-0.5 rounded-full">Mặt sau</Tag>
                <Paragraph
                    className="text-base text-gray-600 m-0 w-full break-words"
                >
                    {card.back}
                </Paragraph>
            </div>
        </Card>
    );
};

// --- Component Chính ---
const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ data, title, onUpdate }) => {
    const [cards, setCards] = useState<FlashcardData[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    useEffect(() => {
        if (data) setCards(data);
    }, [data]);

    const updateParent = (newCards: FlashcardData[]) => {
        setCards(newCards);
        if (onUpdate) onUpdate(newCards);
    };

    // CRUD Functions
    const handleAddNew = () => {
        setIsCreating(true);
        setEditingIndex(null);
        // Scroll xuống dưới cùng (optional logic)
    };

    const handleSaveNew = (newCard: FlashcardData) => {
        const newCards = [...cards, newCard];
        updateParent(newCards);
        setIsCreating(false);
        message.success('Đã thêm thẻ mới');
    };

    const handleSaveEdit = (index: number, updatedCard: FlashcardData) => {
        const newCards = [...cards];
        newCards[index] = updatedCard;
        updateParent(newCards);
        setEditingIndex(null);
        message.success('Đã cập nhật thẻ');
    };

    const handleDelete = (index: number) => {
        const newCards = cards.filter((_, i) => i !== index);
        updateParent(newCards);
        message.success('Đã xóa thẻ');
    };

    const emptyCard: FlashcardData = { front: '', back: '' };

    return (
        <div className="pb-8">
            <div className="flex justify-between items-end mb-6 border-b pb-4">
                <div>
                    {title && <h3 className="text-lg font-bold text-gray-700 m-0">{title}</h3>}
                    <span className="text-gray-500 italic text-sm">Tổng số: {cards.length} thẻ ghi nhớ</span>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                    disabled={isCreating || editingIndex !== null}
                >
                    Thêm thẻ
                </Button>
            </div>

            {/* Form tạo mới (Luôn hiện ở đầu nếu đang tạo) */}
            {isCreating && (
                <div className="animate-fade-in mb-6">
                    <FlashcardEditor
                        card={emptyCard}
                        onSave={handleSaveNew}
                        onCancel={() => setIsCreating(false)}
                    />
                </div>
            )}

            {/* Form chỉnh sửa (Hiện đè lên list nếu đang sửa) */}
            {editingIndex !== null && (
                <div className="animate-fade-in mb-6">
                    <FlashcardEditor
                        card={cards[editingIndex]}
                        onSave={(updatedCard) => handleSaveEdit(editingIndex, updatedCard)}
                        onCancel={() => setEditingIndex(null)}
                    />
                </div>
            )}

            {cards.length === 0 && !isCreating ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có thẻ ghi nhớ nào."
                >
                    <Button type="dashed" onClick={handleAddNew}>Tạo thẻ đầu tiên</Button>
                </Empty>
            ) : (
                /* Danh sách thẻ (Grid System) */
                <List
                    grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
                    dataSource={cards}
                    renderItem={(item, index) => {
                        // Nếu đang edit thẻ này thì ẩn nó đi trong list (vì đã hiện Editor ở trên)
                        if (editingIndex === index) return null;

                        return (
                            <List.Item>
                                <FlashcardViewer
                                    index={index}
                                    card={item}
                                    onEdit={() => {
                                        setEditingIndex(index);
                                        setIsCreating(false);
                                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên để sửa
                                    }}
                                    onDelete={() => handleDelete(index)}
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default FlashcardsTab;