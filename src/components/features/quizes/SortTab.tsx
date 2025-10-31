/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Modal, Form, Input, Tooltip, Tag, List, Select } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, ClusterOutlined, TagOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Định nghĩa kiểu dữ liệu
interface Category {
    id: string;
    name: string;
}

interface ClassificationItem {
    id: string;
    text: string;
    correctCategoryId: string;
}

interface ClassificationSet {
    id: string;
    title: string;
    categories: Category[];
    items: ClassificationItem[];
    explanation?: string;
}

// Dữ liệu giả lập ban đầu
const initialMockClassification: ClassificationSet[] = [
    {
        id: 'c1',
        title: "Phân loại Động vật và Thực vật",
        categories: [
            { id: 'cat1', name: "Động vật" },
            { id: 'cat2', name: "Thực vật" },
            { id: 'cat3', name: "Nấm" },
        ],
        items: [
            { id: 'i1', text: "Cây Xoài", correctCategoryId: 'cat2' },
            { id: 'i2', text: "Con Cá", correctCategoryId: 'cat1' },
            { id: 'i3', text: "Cây Lúa", correctCategoryId: 'cat2' },
            { id: 'i4', text: "Con Chim", correctCategoryId: 'cat1' },
            { id: 'i5', text: "Con Vịt", correctCategoryId: 'cat1' },
            { id: 'i6', text: "Nấm Rơm", correctCategoryId: 'cat3' },
        ],
        explanation: "Các mục được phân loại dựa trên nhóm sinh vật của chúng.",
    },
];

const SortTab: React.FC = () => {
    const [sets, setSets] = useState<ClassificationSet[]>(initialMockClassification);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSet, setEditingSet] = useState<ClassificationSet | null>(null);
    const [form] = Form.useForm();

    // --- Hàm xử lý: XÓA Bộ đề ---
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa bộ đề Phân loại',
            content: 'Bạn có chắc chắn muốn xóa toàn bộ bộ phân loại này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                setSets(sets.filter(set => set.id !== id));
            },
        });
    };

    // --- Hàm xử lý: CHỈNH SỬA / THÊM Bộ đề ---
    const handleEdit = (set: ClassificationSet | null) => {
        setEditingSet(set);
        setIsModalVisible(true);

        if (set) {
            const initialValues: any = {
                title: set.title,
                explanation: set.explanation,
                categories: set.categories.map(c => ({ name: c.name, id: c.id })),
                items: set.items.map(i => ({ text: i.text, correctCategoryId: i.correctCategoryId }))
            };
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
            // Thiết lập giá trị mặc định cho 2 nhóm và 4 mục
            form.setFieldsValue({
                categories: [{ name: 'Nhóm 1' }, { name: 'Nhóm 2' }],
                items: [{}, {}, {}, {}]
            });
        }
    };

    // --- Hàm xử lý: LƯU Bộ đề ---
    const handleSave = (values: any) => {
        // 1. Chuẩn bị Categories với ID (giữ ID cũ hoặc tạo mới)
        const currentCategories = editingSet?.categories || [];
        const newCategories: Category[] = (values.categories || [])
            .filter((cat: any) => cat.name)
            .map((cat: any, index: number) => ({
                id: currentCategories[index]?.id || `cat${Math.random().toString(36).substr(2, 4)}`,
                name: cat.name,
            }));

        if (newCategories.length < 2) {
            Modal.error({ title: 'Lỗi', content: 'Bộ phân loại phải có ít nhất 2 nhóm.' });
            return;
        }

        // 2. Chuẩn bị Items
        const newItems: ClassificationItem[] = (values.items || [])
            .filter((item: any) => item.text && item.correctCategoryId)
            .map((item: any, index: number) => ({
                id: editingSet?.items[index]?.id || `i${Math.random().toString(36).substr(2, 4)}`,
                text: item.text,
                correctCategoryId: item.correctCategoryId,
            }));

        if (newItems.length === 0) {
            Modal.error({ title: 'Lỗi', content: 'Bộ phân loại phải có ít nhất một mục hợp lệ.' });
            return;
        }

        const newSet: ClassificationSet = {
            id: editingSet?.id || Math.random().toString(36).substr(2, 9),
            title: values.title,
            categories: newCategories,
            items: newItems,
            explanation: values.explanation,
        };

        if (editingSet) {
            setSets(sets.map(s => s.id === newSet.id ? newSet : s));
        } else {
            setSets([newSet, ...sets]);
        }

        setIsModalVisible(false);
    };


    // Hàm render từng bộ phân loại
    const renderClassificationCard = (item: ClassificationSet, index: number) => {
        return (
            <Card
                key={item.id}
                className='mb-4 shadow-lg border-l-4 border-gold-500' // Gold color cho tab này
                title={<Paragraph strong className='!mb-0 text-base text-gold-700'>Bộ Phân loại {index + 1}: {item.title}</Paragraph>}
                extra={
                    <Space size="small">
                        <Tag color="gold">Phân loại</Tag>
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
                {/* Hiển thị các mục phân loại theo nhóm */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${item.categories.length > 0 ? item.categories.length : 1}, 1fr)` }}>
                    {item.categories.map(category => (
                        <div key={category.id} className="p-3 border-2 border-dashed border-gray-400 rounded-lg">
                            <Paragraph strong className='!mb-2 text-base text-center text-gold-600 border-b border-gray-300 pb-2'>
                                <ClusterOutlined className='mr-2' />{category.name}
                            </Paragraph>
                            <List
                                size="small"
                                dataSource={item.items.filter(i => i.correctCategoryId === category.id)}
                                renderItem={(classificationItem) => (
                                    <List.Item className='justify-center bg-white border border-gray-300 rounded-md p-2 mb-2 shadow-sm'>
                                        <TagOutlined className='mr-2 text-gold-500' /> {classificationItem.text}
                                    </List.Item>
                                )}
                            />
                        </div>
                    ))}
                </div>

                {item.explanation && (
                    <div className='mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md'>
                        <Paragraph strong className='!mb-1'><ClusterOutlined className="mr-2 text-yellow-500" />Giải thích chung:</Paragraph>
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
                Thêm Bộ Phân Loại Mới
            </Button>

            {/* Danh sách Bộ đề */}
            <div style={{
                maxHeight: 'calc(100vh - 320px)',
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
                {sets.map(renderClassificationCard)}
            </div>

            {/* Modal Chỉnh sửa / Thêm */}
            <Modal
                title={editingSet ? "Chỉnh sửa Bộ Phân loại" : "Thêm Bộ Phân loại Mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Lưu Bộ Đề
                    </Button>,
                ]}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item name="title" label="Tiêu đề Bộ Phân loại" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bộ phân loại' }]}>
                        <Input placeholder="Ví dụ: Phân loại Động vật và Thực vật" />
                    </Form.Item>

                    <Form.Item name="explanation" label="Giải thích chung (Tùy chọn)">
                        <TextArea rows={2} placeholder="Giải thích về tiêu chí phân loại" />
                    </Form.Item>

                    <Title level={5}>1. Cấu hình các Nhóm (Categories)</Title>

                    {/* Danh sách các Nhóm (Categories) */}
                    <Form.List name="categories">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Paragraph strong className='!mb-0'>{index + 1}.</Paragraph>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Thiếu tên Nhóm' }]}
                                            className='!mb-0'
                                        >
                                            <Input placeholder={`Tên Nhóm ${index + 1} (Ví dụ: Động vật)`} style={{ width: 300 }} />
                                        </Form.Item>
                                        <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className='mb-4'>
                                    Thêm Nhóm/Danh mục
                                </Button>
                            </>
                        )}
                    </Form.List>

                    <Title level={5}>2. Các Mục cần Phân loại (Items)</Title>

                    {/* Danh sách các Mục (Items) */}
                    <Form.List name="items">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Paragraph strong className='!mb-0'>{index + 1}.</Paragraph>

                                        {/* Input Mục */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'text']}
                                            rules={[{ required: true, message: 'Thiếu nội dung Mục' }]}
                                            className='!mb-0'
                                        >
                                            <Input placeholder="Nội dung mục (Ví dụ: Cây Xoài)" style={{ width: 250 }} />
                                        </Form.Item>

                                        {/* Chọn Nhóm Đúng */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'correctCategoryId']}
                                            rules={[{ required: true, message: 'Chọn nhóm đúng' }]}
                                            className='!mb-0'
                                        >
                                            <Select placeholder="Chọn Nhóm đúng" style={{ width: 180 }}>
                                                {/* Watch Categories để cập nhật Options */}
                                                <Form.Item noStyle shouldUpdate>
                                                    {() => {
                                                        const categories = form.getFieldValue('categories') || [];
                                                        // Sử dụng ID thực tế của Category nếu có, nếu không dùng name tạm thời
                                                        return categories
                                                            .filter((c: any) => c.name)
                                                            .map((c: any, cIndex: number) => (
                                                                <Option key={c.id || `temp-${cIndex}`} value={c.id || `temp-${cIndex}`}>
                                                                    {c.name}
                                                                </Option>
                                                            ));
                                                    }}
                                                </Form.Item>
                                            </Select>
                                        </Form.Item>

                                        <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm Mục cần Phân loại
                                </Button>
                            </>
                        )}
                    </Form.List>

                </Form>
            </Modal>
        </div>
    );
};

export default SortTab;