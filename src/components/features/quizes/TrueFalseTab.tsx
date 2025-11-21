import React, { useState, useEffect } from 'react';
import {
    Empty, Card, Button, Input, Tooltip, Popconfirm,
    message, Radio, Tag, Divider, Typography
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined,
    SaveOutlined, CloseOutlined, CheckCircleFilled,
    CloseCircleFilled
} from '@ant-design/icons';

// --- Interfaces ---
export interface StatementData {
    statement_text: string;
    is_true: boolean;
}

interface TrueFalseTabProps {
    data: StatementData[];
    // Callback để cập nhật dữ liệu lên cha
    onUpdate?: (newData: StatementData[]) => void;
}

// --- Component Con: Form chỉnh sửa (Editor) ---
const StatementEditor: React.FC<{
    item: StatementData;
    onSave: (newItem: StatementData) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const [tempItem, setTempItem] = useState<StatementData>({ ...item });

    return (
        <Card
            className="border-blue-400 shadow-md mb-4"
            title={item.statement_text ? "Chỉnh sửa nhận định" : "Thêm nhận định mới"}
            size="small"
        >
            <div className="mb-4">
                <label className="font-semibold block mb-2">Nội dung nhận định:</label>
                <Input.TextArea
                    rows={2}
                    value={tempItem.statement_text}
                    onChange={(e) => setTempItem({ ...tempItem, statement_text: e.target.value })}
                    placeholder="Nhập nội dung câu khẳng định..."
                />
            </div>

            <div className="mb-4">
                <label className="font-semibold block mb-2">Đáp án đúng là:</label>
                <Radio.Group
                    value={tempItem.is_true}
                    onChange={(e) => setTempItem({ ...tempItem, is_true: e.target.value })}
                    buttonStyle="solid"
                >
                    <Radio.Button value={true} className="!text-green-600 hover:!text-green-700">
                        <CheckCircleFilled className="mr-1" /> ĐÚNG
                    </Radio.Button>
                    <Radio.Button value={false} className="!text-red-600 hover:!text-red-700">
                        <CloseCircleFilled className="mr-1" /> SAI
                    </Radio.Button>
                </Radio.Group>
                <div className="mt-2 text-xs text-gray-400">
                    * Chọn "Đúng" nếu nhận định trên là chính xác, ngược lại chọn "Sai".
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <Button icon={<CloseOutlined />} onClick={onCancel}>Hủy</Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                        if (!tempItem.statement_text.trim()) return message.error("Chưa nhập nội dung");
                        onSave(tempItem);
                    }}
                >
                    Lưu
                </Button>
            </div>
        </Card>
    );
};

// --- Component Con: Hiển thị (Viewer) ---
const StatementViewer: React.FC<{
    index: number;
    item: StatementData;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ index, item, onEdit, onDelete }) => {
    // Xác định màu sắc dựa trên Đúng/Sai
    const themeColor = item.is_true ? 'green' : 'red';
    const Icon = item.is_true ? CheckCircleFilled : CloseCircleFilled;
    const label = item.is_true ? 'ĐÚNG' : 'SAI';

    return (
        <Card
            size="small"
            className={`mb-3 shadow-sm hover:shadow-md transition-all group border-l-4 ${item.is_true ? 'border-l-green-500' : 'border-l-red-500'}`}
            bodyStyle={{ padding: '12px 16px' }}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Icon và Nội dung */}
                <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                        <Icon style={{ fontSize: '24px', color: item.is_true ? '#52c41a' : '#ff4d4f' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 font-bold text-xs uppercase tracking-wide">Câu {index + 1}</span>
                            <Tag color={themeColor} bordered={false} className="font-bold">
                                {label}
                            </Tag>
                        </div>
                        <Typography.Text className="text-base text-gray-800">
                            {item.statement_text}
                        </Typography.Text>
                    </div>
                </div>

                {/* Nút thao tác (Ẩn hiện khi hover) */}
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={onEdit} className="text-blue-600" />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa câu này?"
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
const TrueFalseTab: React.FC<TrueFalseTabProps> = ({ data, onUpdate }) => {
    const [statements, setStatements] = useState<StatementData[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    useEffect(() => {
        if (data) setStatements(data);
    }, [data]);

    const updateParent = (newStatements: StatementData[]) => {
        setStatements(newStatements);
        if (onUpdate) onUpdate(newStatements);
    };

    // CRUD Functions
    const handleAddNew = () => {
        setIsCreating(true);
        setEditingIndex(null);
    };

    const handleSaveNew = (newItem: StatementData) => {
        const newStatements = [...statements, newItem];
        updateParent(newStatements);
        setIsCreating(false);
        message.success('Đã thêm nhận định mới');
    };

    const handleSaveEdit = (index: number, updatedItem: StatementData) => {
        const newStatements = [...statements];
        newStatements[index] = updatedItem;
        updateParent(newStatements);
        setEditingIndex(null);
        message.success('Đã cập nhật');
    };

    const handleDelete = (index: number) => {
        const newStatements = statements.filter((_, i) => i !== index);
        updateParent(newStatements);
        message.success('Đã xóa');
    };

    const emptyStatement: StatementData = {
        statement_text: '',
        is_true: true // Mặc định là Đúng
    };

    return (
        <div className="max-w-4xl mx-auto pb-8">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 italic">Tổng số: {statements.length} câu</span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                    disabled={isCreating || editingIndex !== null}
                >
                    Thêm nhận định
                </Button>
            </div>

            {statements.length === 0 && !isCreating ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có câu hỏi đúng sai nào."
                >
                    <Button type="dashed" onClick={handleAddNew}>Tạo câu đầu tiên</Button>
                </Empty>
            ) : (
                <div className="space-y-2">
                    {statements.map((item, index) => (
                        <div key={index}>
                            {editingIndex === index ? (
                                <StatementEditor
                                    item={item}
                                    onSave={(newItem) => handleSaveEdit(index, newItem)}
                                    onCancel={() => setEditingIndex(null)}
                                />
                            ) : (
                                <StatementViewer
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
                        <div className="animate-fade-in mt-4">
                            <Divider dashed>Nhận định mới</Divider>
                            <StatementEditor
                                item={emptyStatement}
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

export default TrueFalseTab;