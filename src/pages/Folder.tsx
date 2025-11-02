/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
// ⭐ 1. Bỏ PageContainer, thêm Typography và Breadcrumb
import { Button, Tabs, List, Avatar, Dropdown, type MenuProps, Modal, Form, Input, Spin, Empty, Typography, Breadcrumb } from 'antd';
import { FolderOutlined, MoreOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;
const { Title } = Typography; // Lấy Title từ Typography

// --- Dữ liệu giả lập (không đổi) ---
const initialFoldersData = [
    { id: 1, name: 'Bộ đề Toán 12', description: 'Tổng hợp các đề thi THPT Quốc gia môn Toán.' },
    { id: 2, name: 'Từ vựng IELTS Band 8.0', description: 'Các từ vựng academic theo chủ đề.' },
];
const api = {
    getFolders: () => new Promise(resolve => setTimeout(() => resolve([...initialFoldersData]), 1000)),
};

interface FolderType {
    id: number;
    name: string;
    description: string;
}

const Folder = () => {
    // --- Các state (không đổi) ---
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
    const [form] = Form.useForm();

    // --- Các hàm logic (không đổi) ---
    useEffect(() => {
        setLoading(true);
        api.getFolders().then((data: any) => {
            setFolders(data);
            setLoading(false);
        });
    }, []);

    const showCreateModal = () => {
        setEditingFolder(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (folder: FolderType) => {
        setEditingFolder(folder);
        form.setFieldsValue(folder);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            setLoading(true);
            if (editingFolder) {
                setTimeout(() => {
                    setFolders(folders.map(f => f.id === editingFolder.id ? { ...f, ...values } : f));
                    setLoading(false);
                    setIsModalVisible(false);
                }, 500);
            } else {
                setTimeout(() => {
                    const newFolder = { id: Date.now(), ...values };
                    setFolders([newFolder, ...folders]);
                    setLoading(false);
                    setIsModalVisible(false);
                }, 500);
            }
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const showDeleteConfirm = (folderId: number) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa thư mục này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể được hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                setLoading(true);
                setTimeout(() => {
                    setFolders(folders.filter(f => f.id !== folderId));
                    setLoading(false);
                }, 500);
            },
        });
    };

    const getMenuItems = (folder: FolderType): MenuProps['items'] => [
        { key: 'edit', label: 'Sửa', icon: <EditOutlined />, onClick: () => showEditModal(folder) },
        { key: 'delete', label: 'Xóa', icon: <DeleteOutlined />, danger: true, onClick: () => showDeleteConfirm(folder.id) },
        { key: 'share', label: 'Chia sẻ', icon: <ShareAltOutlined /> },
    ];


    // ⭐ 2. Thay thế PageContainer bằng các component cơ bản
    return (
        // Bọc toàn bộ trang trong một div để có thể thêm padding
        <div className="p-6">
            {/* Phần Header tùy chỉnh */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <Title level={3} style={{ marginBottom: '4px' }}>Quản lý Bộ đề</Title>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Bộ đề</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div>
                    <Button type="primary" onClick={showCreateModal}>
                        Tạo thư mục
                    </Button>
                </div>
            </div>

            {/* Phần Content (Nội dung chính) */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <Spin spinning={loading}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Tất cả" key="1">
                            {!loading && folders.length === 0 ? (
                                <Empty description="Chưa có bộ đề nào.">
                                    <Button type="primary" onClick={showCreateModal}>Tạo ngay</Button>
                                </Empty>
                            ) : (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={folders}
                                    renderItem={(folder) => (
                                        <List.Item
                                            actions={[
                                                <Dropdown menu={{ items: getMenuItems(folder) }} trigger={['click']}>
                                                    <Button type="text" icon={<MoreOutlined />} />
                                                </Dropdown>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<FolderOutlined />} />}
                                                title={<a href="#">{folder.name}</a>}
                                                description={folder.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </TabPane>
                        <TabPane tab="Của tôi" key="2">
                            <Empty description="Tính năng đang được phát triển" />
                        </TabPane>
                    </Tabs>
                </Spin>
            </div>

            {/* Modal không thay đổi */}
            <Modal
                title={editingFolder ? 'Sửa thư mục' : 'Tạo thư mục mới'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editingFolder ? 'Cập nhật' : 'Tạo'}
                cancelText="Hủy"
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item name="name" label="Tên thư mục" rules={[{ required: true, message: 'Vui lòng nhập tên thư mục!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Folder;