import React, { useState, useEffect } from 'react';
import {
    Empty, Card, Button, Input, Tooltip, Popconfirm,
    message, Tag, Alert, Divider
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined,
    SaveOutlined, CloseOutlined, SwapRightOutlined,
    UngroupOutlined
} from '@ant-design/icons';

// --- Interfaces ---
export interface MatchingPair {
    item_a: string;
    item_b: string;
}

interface MatchingTabProps {
    data: MatchingPair[];
    instruction?: string; // Hướng dẫn làm bài (nếu có)
    onUpdate?: (newData: MatchingPair[]) => void;
}

// --- Component Con: Editor (Form chỉnh sửa) ---
const MatchingEditor: React.FC<{
    pair: MatchingPair;
    onSave: (newPair: MatchingPair) => void;
    onCancel: () => void;
}> = ({ pair, onSave, onCancel }) => {
    const [tempPair, setTempPair] = useState<MatchingPair>({ ...pair });

    return (
        <Card
            className="border-blue-400 shadow-md mb-4"
            title={pair.item_a || pair.item_b ? "Chỉnh sửa cặp ghép nối" : "Thêm cặp ghép nối mới"}
            size="small"
        >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Vế A */}
                <div className="flex-1 w-full">
                    <label className="font-semibold block mb-1 text-blue-600">Cột A (Nguồn):</label>
                    <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        value={tempPair.item_a}
                        onChange={(e) => setTempPair({ ...tempPair, item_a: e.target.value })}
                        placeholder="Nhập nội dung vế trái..."
                        className="bg-blue-50 border-blue-200"
                    />
                </div>

                {/* Icon liên kết */}
                <div className="shrink-0 text-gray-400 hidden md:block pt-6">
                    <SwapRightOutlined style={{ fontSize: '24px' }} />
                </div>

                {/* Vế B */}
                <div className="flex-1 w-full">
                    <label className="font-semibold block mb-1 text-orange-600">Cột B (Đích):</label>
                    <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        value={tempPair.item_b}
                        onChange={(e) => setTempPair({ ...tempPair, item_b: e.target.value })}
                        placeholder="Nhập nội dung vế phải..."
                        className="bg-orange-50 border-orange-200"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <Button icon={<CloseOutlined />} onClick={onCancel}>Hủy</Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                        if (!tempPair.item_a.trim() || !tempPair.item_b.trim()) {
                            return message.error("Vui lòng nhập đầy đủ cả hai vế");
                        }
                        onSave(tempPair);
                    }}
                >
                    Lưu
                </Button>
            </div>
        </Card>
    );
};

// --- Component Con: Viewer (Hiển thị) ---
const MatchingViewer: React.FC<{
    index: number;
    pair: MatchingPair;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ index, pair, onEdit, onDelete }) => {
    return (
        <Card
            size="small"
            className="mb-3 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-indigo-500"
            bodyStyle={{ padding: '12px' }}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Nội dung Cặp */}
                <div className="flex-1 flex flex-col md:flex-row items-center gap-4">

                    {/* Bên trái */}
                    <div className="flex-1 w-full bg-blue-50 p-3 rounded border border-blue-100 relative">
                        <Tag className="absolute -top-2 -left-2" color="blue">A{index + 1}</Tag>
                        <span className="text-gray-800 font-medium">{pair.item_a}</span>
                    </div>

                    {/* Mũi tên kết nối */}
                    <div className="text-indigo-400 shrink-0">
                        <SwapRightOutlined style={{ fontSize: '20px' }} />
                    </div>

                    {/* Bên phải */}
                    <div className="flex-1 w-full bg-orange-50 p-3 rounded border border-orange-100 relative">
                        <Tag className="absolute -top-2 -right-2" color="orange">B{index + 1}</Tag>
                        <span className="text-gray-800 font-medium">{pair.item_b}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={onEdit} className="text-blue-600" />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa cặp này?"
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
const MatchingTab: React.FC<MatchingTabProps> = ({ data, instruction, onUpdate }) => {
    const [pairs, setPairs] = useState<MatchingPair[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    useEffect(() => {
        if (data) setPairs(data);
    }, [data]);

    const updateParent = (newPairs: MatchingPair[]) => {
        setPairs(newPairs);
        if (onUpdate) onUpdate(newPairs);
    };

    // CRUD Functions
    const handleAddNew = () => {
        setIsCreating(true);
        setEditingIndex(null);
    };

    const handleSaveNew = (newPair: MatchingPair) => {
        const newPairs = [...pairs, newPair];
        updateParent(newPairs);
        setIsCreating(false);
        message.success('Đã thêm cặp ghép nối');
    };

    const handleSaveEdit = (index: number, updatedPair: MatchingPair) => {
        const newPairs = [...pairs];
        newPairs[index] = updatedPair;
        updateParent(newPairs);
        setEditingIndex(null);
        message.success('Đã cập nhật');
    };

    const handleDelete = (index: number) => {
        const newPairs = pairs.filter((_, i) => i !== index);
        updateParent(newPairs);
        message.success('Đã xóa');
    };

    const emptyPair: MatchingPair = {
        item_a: '',
        item_b: ''
    };

    return (
        <div className="max-w-4xl mx-auto pb-8">
            {instruction && (
                <Alert
                    message="Yêu cầu đề bài"
                    description={instruction}
                    type="info"
                    showIcon
                    className="mb-6"
                    icon={<UngroupOutlined />}
                />
            )}

            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 italic">Tổng số: {pairs.length} cặp</span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                    disabled={isCreating || editingIndex !== null}
                >
                    Thêm cặp nối
                </Button>
            </div>

            {pairs.length === 0 && !isCreating ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có dữ liệu ghép nối."
                >
                    <Button type="dashed" onClick={handleAddNew}>Tạo cặp đầu tiên</Button>
                </Empty>
            ) : (
                <div className="space-y-2">
                    {pairs.map((pair, index) => (
                        <div key={index}>
                            {editingIndex === index ? (
                                <MatchingEditor
                                    pair={pair}
                                    onSave={(newPair) => handleSaveEdit(index, newPair)}
                                    onCancel={() => setEditingIndex(null)}
                                />
                            ) : (
                                <MatchingViewer
                                    index={index}
                                    pair={pair}
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
                        <div className="animate-fade-in mt-4">
                            <Divider dashed>Cặp ghép nối mới</Divider>
                            <MatchingEditor
                                pair={emptyPair}
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

export default MatchingTab;