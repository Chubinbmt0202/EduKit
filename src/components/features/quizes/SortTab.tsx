import React, { useState, useEffect } from 'react';
import {
    Empty, Card, Button, Input, Tooltip, Popconfirm,
    message, Row, Col, Tag, Alert, List
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined,
    SaveOutlined, CloseOutlined, ContainerOutlined,
    DragOutlined, FolderOpenOutlined
} from '@ant-design/icons';

// --- Interfaces ---
export interface SortingCategory {
    category_name: string;
    items: string[];
}

interface SortTabProps {
    data: SortingCategory[];
    instruction?: string;
    onUpdate?: (newData: SortingCategory[]) => void;
}

// --- Component Con: Editor (Chỉnh sửa Danh mục & Items) ---
const CategoryEditor: React.FC<{
    category: SortingCategory;
    onSave: (newCat: SortingCategory) => void;
    onCancel: () => void;
}> = ({ category, onSave, onCancel }) => {
    const [tempCat, setTempCat] = useState<SortingCategory>({ ...category });
    const [newItemInput, setNewItemInput] = useState<string>('');

    // Thêm item vào danh sách tạm
    const handleAddItem = () => {
        if (!newItemInput.trim()) return;
        if (tempCat.items.includes(newItemInput.trim())) {
            message.warning('Mục này đã tồn tại trong nhóm!');
            return;
        }
        setTempCat({ ...tempCat, items: [...tempCat.items, newItemInput.trim()] });
        setNewItemInput('');
    };

    // Xóa item khỏi danh sách tạm
    const handleRemoveItem = (itemToRemove: string) => {
        setTempCat({ ...tempCat, items: tempCat.items.filter(i => i !== itemToRemove) });
    };

    return (
        <Card
            className="border-blue-400 shadow-lg mb-6 h-full"
            title={category.category_name ? "Chỉnh sửa nhóm" : "Tạo nhóm mới"}
            size="small"
        >
            {/* Tên nhóm */}
            <div className="mb-4">
                <label className="font-semibold block mb-2 text-blue-700">Tên nhóm (Category):</label>
                <Input
                    prefix={<FolderOpenOutlined />}
                    value={tempCat.category_name}
                    onChange={(e) => setTempCat({ ...tempCat, category_name: e.target.value })}
                    placeholder="Ví dụ: Động vật ăn cỏ"
                    className="font-medium"
                />
            </div>

            {/* Danh sách items */}
            <div className="mb-4">
                <label className="font-semibold block mb-2 text-gray-600">Các phần tử trong nhóm:</label>

                <Input.Group compact className="flex mb-3">
                    <Input
                        style={{ width: 'calc(100% - 40px)' }}
                        value={newItemInput}
                        onChange={(e) => setNewItemInput(e.target.value)}
                        onPressEnter={handleAddItem}
                        placeholder="Nhập phần tử rồi nhấn Enter..."
                    />
                    <Button icon={<PlusOutlined />} type="primary" onClick={handleAddItem} />
                </Input.Group>

                <div className="bg-gray-50 p-3 rounded border min-h-[100px] max-h-[200px] overflow-y-auto">
                    {tempCat.items.length === 0 ? (
                        <div className="text-gray-400 text-center italic text-xs mt-2">Chưa có phần tử nào</div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {tempCat.items.map((item, idx) => (
                                <Tag
                                    key={idx}
                                    closable
                                    onClose={() => handleRemoveItem(item)}
                                    color="blue"
                                    className="m-0 text-sm py-1 px-2"
                                >
                                    {item}
                                </Tag>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <Button icon={<CloseOutlined />} onClick={onCancel}>Hủy</Button>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                        if (!tempCat.category_name.trim()) return message.error("Chưa nhập tên nhóm");
                        if (tempCat.items.length === 0) return message.warning("Nhóm nên có ít nhất 1 phần tử");
                        onSave(tempCat);
                    }}
                >
                    Lưu nhóm
                </Button>
            </div>
        </Card>
    );
};

// --- Component Con: Viewer (Hiển thị Cái xô) ---
const CategoryViewer: React.FC<{
    index: number;
    category: SortingCategory;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ category, onEdit, onDelete }) => {
    return (
        <Card
            title={
                <div className="flex items-center text-blue-800">
                    <ContainerOutlined className="mr-2 text-lg" />
                    <span className="truncate" title={category.category_name}>
                        {category.category_name}
                    </span>
                    <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {category.items.length} mục
                    </span>
                </div>
            }
            className="h-full shadow-sm hover:shadow-md transition-shadow group relative"
            headStyle={{ background: '#f0f5ff', borderBottom: '2px solid #adc6ff' }}
            bodyStyle={{ padding: '12px', height: 'calc(100% - 57px)', overflowY: 'auto' }}
        >
            {/* Nút Actions (Hiện khi hover) */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Tooltip title="Sửa nhóm">
                    <Button size="small" type="primary" ghost icon={<EditOutlined />} onClick={onEdit} />
                </Tooltip>
                <Popconfirm
                    title="Xóa nhóm này?"
                    onConfirm={onDelete}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true, size: 'small' }}
                >
                    <Tooltip title="Xóa">
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Popconfirm>
            </div>

            {/* Nội dung các Items */}
            <List
                dataSource={category.items}
                split={false}
                renderItem={(item) => (
                    <div className="bg-white mb-2 p-2 rounded border border-gray-200 shadow-sm flex items-center gap-2 hover:border-blue-300 transition-colors cursor-default">
                        <DragOutlined className="text-gray-300 cursor-move" />
                        <span className="font-medium text-gray-700">{item}</span>
                    </div>
                )}
            />
        </Card>
    );
};

// --- Component Chính ---
const SortTab: React.FC<SortTabProps> = ({ data, instruction, onUpdate }) => {
    const [categories, setCategories] = useState<SortingCategory[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    useEffect(() => {
        if (data) setCategories(data);
    }, [data]);

    const updateParent = (newCats: SortingCategory[]) => {
        setCategories(newCats);
        if (onUpdate) onUpdate(newCats);
    };

    // CRUD
    const handleAddNew = () => {
        setIsCreating(true);
        setEditingIndex(null);
    };

    const handleSaveNew = (newCat: SortingCategory) => {
        const newCats = [...categories, newCat];
        updateParent(newCats);
        setIsCreating(false);
        message.success('Đã thêm nhóm mới');
    };

    const handleSaveEdit = (index: number, updatedCat: SortingCategory) => {
        const newCats = [...categories];
        newCats[index] = updatedCat;
        updateParent(newCats);
        setEditingIndex(null);
        message.success('Đã cập nhật nhóm');
    };

    const handleDelete = (index: number) => {
        const newCats = categories.filter((_, i) => i !== index);
        updateParent(newCats);
        message.success('Đã xóa nhóm');
    };

    const emptyCat: SortingCategory = {
        category_name: '',
        items: []
    };

    return (
        <div className="pb-8">
            {instruction && (
                <Alert
                    message="Yêu cầu"
                    description={instruction}
                    type="info"
                    showIcon
                    className="mb-6"
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 italic">Tổng số: {categories.length} nhóm</span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddNew}
                    disabled={isCreating || editingIndex !== null}
                >
                    Thêm nhóm
                </Button>
            </div>

            {/* Khu vực Grid hiển thị Categories */}
            <Row gutter={[24, 24]} align="stretch">
                {/* Card Tạo mới (Nếu đang bật) */}
                {isCreating && (
                    <Col xs={24} md={12} lg={8}>
                        <div className="animate-fade-in h-full">
                            <CategoryEditor
                                category={emptyCat}
                                onSave={handleSaveNew}
                                onCancel={() => setIsCreating(false)}
                            />
                        </div>
                    </Col>
                )}

                {/* Danh sách các Category */}
                {categories.map((cat, index) => (
                    <Col xs={24} md={12} lg={8} key={index}>
                        {editingIndex === index ? (
                            <div className="animate-fade-in h-full">
                                <CategoryEditor
                                    category={cat}
                                    onSave={(newCat) => handleSaveEdit(index, newCat)}
                                    onCancel={() => setEditingIndex(null)}
                                />
                            </div>
                        ) : (
                            <div className="h-full">
                                <CategoryViewer
                                    index={index}
                                    category={cat}
                                    onEdit={() => {
                                        setEditingIndex(index);
                                        setIsCreating(false);
                                    }}
                                    onDelete={() => handleDelete(index)}
                                />
                            </div>
                        )}
                    </Col>
                ))}
            </Row>

            {categories.length === 0 && !isCreating && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có nhóm phân loại nào."
                >
                    <Button type="dashed" onClick={handleAddNew}>Tạo nhóm đầu tiên</Button>
                </Empty>
            )}
        </div>
    );
};

export default SortTab;