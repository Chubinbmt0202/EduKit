/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Button, Typography, Space, Modal, Form, Input, Tooltip, Tag, List } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, SwapOutlined, BlockOutlined, BulbOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;
const { TextArea } = Input;

// Định nghĩa kiểu dữ liệu
interface MatchingPair {
    id: string;
    termA: string; // Thuật ngữ / Câu hỏi (Cột Trái)
    termB: string; // Định nghĩa / Câu trả lời đúng (Cột Phải)
}

interface MatchingItem {
    id: string;
    title: string; // Tiêu đề chung cho bộ ghép cặp
    pairs: MatchingPair[]; // Danh sách các cặp ghép đúng
    explanation?: string; // Giải thích chung cho bộ câu hỏi
}

// Dữ liệu giả lập ban đầu
const initialMockMatching: MatchingItem[] = [
    {
        id: 'm1',
        title: "Ghép cặp Thủ đô & Quốc gia",
        pairs: [
            { id: 'p1', termA: "Việt Nam", termB: "Hà Nội" },
            { id: 'p2', termA: "Thái Lan", termB: "Bangkok" },
            { id: 'p3', termA: "Nhật Bản", termB: "Tokyo" },
        ],
        explanation: "Các cặp này là mối quan hệ thủ đô và quốc gia tương ứng.",
    }
];

const MatchingTab: React.FC = () => {
    const [matchingSets, setMatchingSets] = useState<MatchingItem[]>(initialMockMatching);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSet, setEditingSet] = useState<MatchingItem | null>(null);
    const [form] = Form.useForm();

    // --- Hàm xử lý: XÓA Bộ đề ---
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa bộ đề Ghép cặp',
            content: 'Bạn có chắc chắn muốn xóa toàn bộ bộ ghép cặp này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                setMatchingSets(matchingSets.filter(set => set.id !== id));
            },
        });
    };

    // --- Hàm xử lý: CHỈNH SỬA / THÊM Bộ đề ---
    const handleEdit = (set: MatchingItem | null) => {
        setEditingSet(set);
        setIsModalVisible(true);

        if (set) {
            // Thiết lập giá trị cho Form khi chỉnh sửa
            const initialValues: any = {
                title: set.title,
                explanation: set.explanation,
                pairs: set.pairs.map(pair => ({ termA: pair.termA, termB: pair.termB }))
            };
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
            // Thiết lập giá trị mặc định cho 3 cặp trống
            form.setFieldsValue({ pairs: [{}, {}, {}] });
        }
    };

    // --- Hàm xử lý: LƯU Bộ đề ---
    const handleSave = (values: any) => {
        // Lọc bỏ các cặp trống và tạo ID
        const validPairs: MatchingPair[] = (values.pairs || [])
            .filter((pair: any) => pair.termA && pair.termB)
            .map((pair: any, index: number) => ({
                id: editingSet?.pairs[index]?.id || Math.random().toString(36).substr(2, 9) + index,
                termA: pair.termA,
                termB: pair.termB,
            }));

        if (validPairs.length === 0) {
            Modal.error({ title: 'Lỗi', content: 'Bộ ghép cặp phải có ít nhất một cặp hợp lệ.' });
            return;
        }

        const newSet: MatchingItem = {
            id: editingSet?.id || Math.random().toString(36).substr(2, 9),
            title: values.title,
            pairs: validPairs,
            explanation: values.explanation,
        };

        if (editingSet) {
            setMatchingSets(matchingSets.map(s => s.id === newSet.id ? newSet : s));
        } else {
            setMatchingSets([newSet, ...matchingSets]); // Thêm lên đầu
        }

        setIsModalVisible(false);
    };

    // Hàm render từng bộ ghép cặp
    const renderMatchingCard = (item: MatchingItem, index: number) => {
        return (
            <Card
                key={item.id}
                className='mb-4 shadow-lg border-l-4 border-purple-500'
                title={<Paragraph strong className='!mb-0 text-base text-purple-700'>Bộ Ghép {index + 1}: {item.title}</Paragraph>}
                extra={
                    <Space size="small">
                        <Tag color="purple">Ghép cặp</Tag>
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
                    <div>Cột A </div>
                    <div>Cột B </div>
                </div>

                <List
                    itemLayout="horizontal"
                    dataSource={item.pairs}
                    renderItem={(pair) => (
                        <List.Item className='!p-0 !py-2'>
                            <div className='grid grid-cols-2 gap-4 w-full'>
                                <div className='bg-gray-50 p-2 rounded-md border border-gray-200 text-left'>
                                    <BlockOutlined className='mr-2 text-purple-500' /> {pair.termA}
                                </div>
                                <div className='bg-purple-50 p-2 rounded-md border border-purple-200 text-left'>
                                    <SwapOutlined className='mr-2 text-purple-500' /> {pair.termB}
                                </div>
                            </div>
                        </List.Item>
                    )}
                />

                {item.explanation && (
                    <div className='mt-4 p-3 bg-purple-50 border-l-4 border-purple-400 rounded-r-md'>
                        <Paragraph strong className='!mb-1'><BulbOutlined className="mr-2 text-purple-500" />Giải thích chung:</Paragraph>
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
                Thêm Bộ Ghép Cặp Mới
            </Button>

            {/* Danh sách Bộ đề */}
            <div style={{
                maxHeight: 'calc(100vh - 350px)',
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
                {matchingSets.map(renderMatchingCard)}
            </div>

            {/* Modal Chỉnh sửa / Thêm */}
            <Modal
                title={editingSet ? "Chỉnh sửa Bộ Ghép cặp" : "Thêm Bộ Ghép cặp Mới"}
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
                    <Form.Item
                        name="title"
                        label="Tiêu đề Bộ Ghép cặp"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bộ ghép cặp' }]}
                    >
                        <Input placeholder="Ví dụ: Ghép cặp Thủ đô & Quốc gia" />
                    </Form.Item>

                    <Form.Item name="explanation" label="Giải thích chung (Tùy chọn)">
                        <TextArea rows={2} placeholder="Giải thích về mục tiêu của bộ ghép cặp này" />
                    </Form.Item>

                    <Title level={5}>Danh sách các Cặp Nối đôi (A và B phải tương ứng)</Title>

                    {/* Dynamic Form List để thêm/xóa các cặp */}
                    <Form.List name="pairs">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, border: '1px dashed #d9d9d9', padding: '10px', borderRadius: '4px' }} align="baseline">
                                        <Paragraph strong className='!mb-0'>{index + 1}.</Paragraph>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'termA']}
                                            rules={[{ required: true, message: 'Thiếu Cột A' }]}
                                            className='!mb-0'
                                        >
                                            <Input placeholder="Cột A" style={{ width: 250 }} />
                                        </Form.Item>
                                        <SwapOutlined style={{ color: '#9254de' }} />
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'termB']}
                                            rules={[{ required: true, message: 'Thiếu Cột B' }]}
                                            className='!mb-0'
                                        >
                                            <Input placeholder="Cột B" style={{ width: 250 }} />
                                        </Form.Item>
                                        <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm Cặp Nối đôi
                                </Button>
                            </>
                        )}
                    </Form.List>

                </Form>
            </Modal>
        </div>
    );
};

export default MatchingTab;