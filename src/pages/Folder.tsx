/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
// ⭐ 1. Bỏ PageContainer, thêm Typography và Breadcrumb
import { Button, Tabs, List, Avatar, Dropdown, type MenuProps, Modal, Form, Input, Spin, Empty, Typography, Breadcrumb } from 'antd';
import { FolderOutlined, MoreOutlined, EditOutlined, DeleteOutlined, ShareAltOutlined, ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;
const { Title } = Typography; // Lấy Title từ Typography

// --- CẬP NHẬT INTERFACE ĐỂ KHỚP VỚI DỮ LIỆU THỰC TẾ ---
interface FolderType {
    name: any;
    id: string; // ID là string
    filename: string; // Thay thế 'name' bằng 'filename'
    gradeLevel: string; // Trường bổ sung
    difficulty: string; // Trường bổ sung
    createdAt: string; // Trường bổ sung
    // Giữ 'description' để tránh lỗi ở các hàm khác, nhưng cần lưu ý trường này không có trong API
    description?: string;
}

const Folder = () => {
    // --- Các state (không đổi) ---
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // Sử dụng FolderType mới0
    const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
    const [form] = Form.useForm();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="p-6">
                <Title level={4}>Vui lòng đăng nhập để xem nội dung này.</Title>
            </div>
        );
    }

    // --- CẬP NHẬT LOGIC GỌI API TRONG useEffect ---
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                setLoading(true);
                // Đảm bảo user.id tồn tại trước khi gọi API
                if (!user || !user.id) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/quizzes/user/${user.id}`, {
                    withCredentials: true,
                });

                console.log("Fetched response data:", response.data);

                // ⭐ ĐIỀU CHỈNH LẤY DỮ LIỆU
                // Giả sử API trả về dạng { quiz: [...] } hoặc chỉ là mảng [...]
                const fetchedQuizzes = response.data.quiz || response.data;

                // ⭐ Ánh xạ dữ liệu để khớp với FolderType cũ (nếu muốn giữ List.Item.Meta)
                const formattedFolders: FolderType[] = fetchedQuizzes.map((quiz: any) => ({
                    id: quiz.id,
                    name: quiz.filename, // Dùng filename làm tên hiển thị
                    description: `Cấp độ: ${quiz.gradeLevel} | Độ khó: ${quiz.difficulty} | Ngày tạo: ${new Date(quiz.createdAt).toLocaleDateString()}`,
                    filename: quiz.filename,
                    gradeLevel: quiz.gradeLevel,
                    difficulty: quiz.difficulty,
                    createdAt: quiz.createdAt,
                }));

                setFolders(formattedFolders);
            } catch (error) {
                console.error("Lỗi khi fetch folders:", error);
                // Có thể thêm logic hiển thị lỗi cho người dùng ở đây
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, [user]); // Thêm user vào dependency để re-run khi user thay đổi (đăng nhập)

    const handleClickDetail = (folderId: string) => {
        // Điều hướng đến trang chi tiết folder (giả sử đường dẫn là /folders/:id)
        window.location.href = `/folders/${folderId}`;
    };

    const showCreateModal = () => {
        setEditingFolder(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (folder: FolderType) => {
        setEditingFolder(folder);
        // Khi chỉnh sửa, cần set các trường name và description đã ánh xạ
        form.setFieldsValue({
            name: folder.name,
            description: folder.description,
            // ... có thể thêm các trường khác nếu muốn chỉnh sửa
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            setLoading(true);
            if (editingFolder) {
                // Sửa logic cập nhật dữ liệu (Giả lập)
                setTimeout(() => {
                    setFolders(folders.map(f => f.id === editingFolder.id ? {
                        ...f,
                        name: values.name,
                        description: values.description,
                        filename: values.name // Cập nhật lại filename nếu name là tên chính
                    } : f));
                    setLoading(false);
                    setIsModalVisible(false);
                }, 500);
            } else {
                // Tạo mới logic cập nhật dữ liệu (Giả lập)
                setTimeout(() => {
                    const newFolder: FolderType = {
                        id: Date.now().toString(), // ID phải là string
                        name: values.name,
                        description: values.description,
                        filename: values.name,
                        gradeLevel: 'N/A',
                        difficulty: 'N/A',
                        createdAt: new Date().toISOString()
                    };
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

    const showDeleteConfirm = (folderId: string) => { // ID là string
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


    return (
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
                                            onClick={() => handleClickDetail(folder.id)}
                                            actions={[
                                                <Dropdown menu={{ items: getMenuItems(folder) }} trigger={['click']}>
                                                    <Button type="text" icon={<MoreOutlined />} />
                                                </Dropdown>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<FolderOutlined />} />}
                                                // Hiển thị tên (filename)
                                                title={<a href="#">{folder.name}</a>}
                                                // Hiển thị mô tả (thông tin cấp độ, độ khó)
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