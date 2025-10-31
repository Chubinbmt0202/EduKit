/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Modal, Form, Input, Tooltip, Tag, List } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, IdcardOutlined, SwapOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;
const { TextArea } = Input;

// Định nghĩa kiểu dữ liệu
interface Flashcard {
    id: string;
    front: string; // Mặt trước
    back: string;  // Mặt sau
}

interface FlashcardSet {
    id: string;
    title: string; // Tiêu đề bộ thẻ
    cards: Flashcard[]; // Danh sách các thẻ
    explanation?: string; // Giải thích chung
}

// Dữ liệu giả lập ban đầu
const initialMockFlashcards: FlashcardSet[] = [
    {
        id: 'fc1',
        title: "Từ vựng tiếng Anh: Động vật",
        cards: [
            { id: 'c1', front: "Dog", back: "Con chó" },
            { id: 'c2', front: "Cat", back: "Con mèo" },
            { id: 'c3', front: "Fish", back: "Con cá" },
        ],
        explanation: "Các từ vựng cơ bản về động vật.",
    }
];

const FlashcardTab: React.FC = () => {
    const [sets, setSets] = useState<FlashcardSet[]>(initialMockFlashcards);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
    const [form] = Form.useForm();

    // --- Hàm xử lý: XÓA Bộ thẻ ---
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa bộ Thẻ ghi nhớ',
            content: 'Bạn có chắc chắn muốn xóa toàn bộ bộ thẻ này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                setSets(sets.filter(set => set.id !== id));
            },
        });
    };

    // --- Hàm xử lý: CHỈNH SỬA / THÊM Bộ thẻ ---
    const handleEdit = (set: FlashcardSet | null) => {
        setEditingSet(set);
        setIsModalVisible(true);

        if (set) {
            // Thiết lập giá trị cho Form khi chỉnh sửa
            const initialValues: any = {
                title: set.title,
                explanation: set.explanation,
                cards: set.cards.map(card => ({ front: card.front, back: card.back }))
            };
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
            // Thiết lập giá trị mặc định cho 3 thẻ trống
            form.setFieldsValue({ cards: [{}, {}, {}] });
        }
    };

    // --- Hàm xử lý: LƯU Bộ thẻ ---
    const handleSave = (values: any) => {
        // Lọc bỏ các thẻ trống và tạo ID
        const validCards: Flashcard[] = (values.cards || [])
            .filter((card: any) => card.front && card.back)
            .map((card: any, index: number) => ({
                id: editingSet?.cards[index]?.id || Math.random().toString(36).substr(2, 9) + index,
                front: card.front,
                back: card.back,
            }));

        if (validCards.length === 0) {
            Modal.error({ title: 'Lỗi', content: 'Bộ thẻ phải có ít nhất một thẻ hợp lệ (cả mặt trước và sau).' });
            return;
        }

        const newSet: FlashcardSet = {
            id: editingSet?.id || Math.random().toString(36).substr(2, 9),
            title: values.title,
            cards: validCards,
            explanation: values.explanation,
        };

        if (editingSet) {
            setSets(sets.map(s => s.id === newSet.id ? newSet : s));
        } else {
            setSets([newSet, ...sets]); // Thêm lên đầu
        }

        setIsModalVisible(false);
    };

    // Hàm render từng bộ thẻ ghi nhớ
    const renderFlashcardSetCard = (item: FlashcardSet) => {
        return (
            <Card
                key={item.id}
                className='mb-4 shadow-lg border-l-4 border-cyan-500' // Màu Cyan
                title={<Paragraph strong className='!mb-0 text-base text-cyan-700'>Bộ thẻ ghi nhớ</Paragraph>}
                extra={
                    <Space size="small">
                        <Tag color="cyan">Flashcard</Tag>
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
                <div className='grid grid-cols-2 gap-4 text-center font-semibold text-lg border-b pb-2 mb-2'>
                    <div>Mặt trước</div>
                    <div>Mặt sau</div>
                </div>

                <List
                    itemLayout="horizontal"
                    dataSource={item.cards}
                    renderItem={(card) => (
                        <List.Item className='!p-0 !py-2'>
                            <div className='grid grid-cols-2 gap-4 w-full'>
                                <div className='bg-gray-50 p-2 rounded-md border border-gray-200 text-left'>
                                    {card.front}
                                </div>
                                <div className='bg-cyan-50 p-2 rounded-md border border-cyan-200 text-left'>
                                    {card.back}
                                </div>
                            </div>
                        </List.Item>
                    )}
                />

                {item.explanation && (
                    <div className='mt-4 p-3 bg-cyan-50 border-l-4 border-cyan-400 rounded-r-md'>
                        <Paragraph strong className='!mb-1'><IdcardOutlined className="mr-2 text-cyan-500" />Giải thích chung:</Paragraph>
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
                Thêm Bộ Thẻ Ghi Nhớ Mới
            </Button>

            {/* Danh sách Bộ đề */}
            <div style={{
                maxHeight: 'calc(100vh - 330px)',
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
                {sets.map(renderFlashcardSetCard)}
            </div>

            {/* Modal Chỉnh sửa / Thêm */}
            <Modal
                title={editingSet ? "Chỉnh sửa Bộ Thẻ ghi nhớ" : "Thêm Bộ Thẻ ghi nhớ Mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Lưu Bộ Thẻ
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
                        name="title"
                        label="Tiêu đề Bộ Thẻ"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bộ thẻ' }]}
                    >
                        <Input placeholder="Ví dụ: Từ vựng tiếng Anh: Động vật" />
                    </Form.Item>

                    <Form.Item name="explanation" label="Giải thích chung (Tùy chọn)">
                        <TextArea rows={2} placeholder="Giải thích về mục tiêu của bộ thẻ này" />
                    </Form.Item>

                    <Title level={5}>Danh sách các Thẻ (Front/Back)</Title>

                    {/* Dynamic Form List để thêm/xóa các thẻ */}
                    <Form.List name="cards">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, border: '1px dashed #d9d9d9', padding: '10px', borderRadius: '4px' }} align="baseline">
                                        <Paragraph strong className='!mb-0'>{index + 1}.</Paragraph>

                                        {/* Mặt trước */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'front']}
                                            rules={[{ required: true, message: 'Thiếu Mặt trước' }]}
                                            className='!mb-0'
                                        >
                                            <Input placeholder="Mặt trước (Front)" style={{ width: 250 }} />
                                        </Form.Item>

                                        <SwapOutlined style={{ color: '#13c2c2' }} />

                                        {/* Mặt sau */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'back']}
                                            rules={[{ required: true, message: 'Thiếu Mặt sau' }]}
                                            className='!mb-0'
                                        >
                                            <Input placeholder="Mặt sau (Back)" style={{ width: 250 }} />
                                        </Form.Item>

                                        <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm Thẻ Ghi Nhớ
                                </Button>
                            </>
                        )}
                    </Form.List>

                </Form>
            </Modal>
        </div>
    );
};

export default FlashcardTab;