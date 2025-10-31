/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Typography, Space, Card, Descriptions, Button, Avatar, Modal, Form, Input, Tag, notification } from 'antd';
import { UserOutlined, EditOutlined, SafetyOutlined, CalendarOutlined, MailOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Paragraph, Title } = Typography;

// Định nghĩa kiểu dữ liệu
interface UserProfile {
    fullName: string;
    email: string;
    role: string;
    memberSince: string;
    lastLogin: string;
}

// Dữ liệu giả lập
const initialProfile: UserProfile = {
    fullName: "Nguyễn Văn A",
    email: "nguyen.vana@edu.vn",
    role: "Giáo viên",
    memberSince: "15/08/2023",
    lastLogin: "31/10/2025 14:50",
};

const UserProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();

    // --- Xử lý: Mở Modal chỉnh sửa ---
    const handleEdit = () => {
        form.setFieldsValue({
            fullName: profile.fullName,
            email: profile.email,
        });
        setIsEditModalVisible(true);
    };

    // --- Xử lý: Lưu thông tin chỉnh sửa ---
    const handleSave = (values: any) => {
        setProfile({
            ...profile,
            fullName: values.fullName,
            email: values.email,
        });
        setIsEditModalVisible(false);
        notification.success({
            message: 'Cập nhật thành công!',
            description: 'Thông tin hồ sơ của bạn đã được cập nhật.',
        });
    };

    // --- Xử lý: Đăng xuất (Mô phỏng) ---
    const handleLogout = () => {
        Modal.confirm({
            title: 'Xác nhận Đăng xuất',
            content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?',
            okText: 'Đăng xuất',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                // Thực hiện logic đăng xuất (ví dụ: chuyển hướng, xóa token)
                console.log("User logged out.");
            },
        });
    };

    return (
        <div>
            <div style={{ margin: '0 auto' }}>
                <Card
                    title={<Space><UserOutlined /> Thông tin cá nhân</Space>}
                    extra={
                        <Button
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            type="primary"
                            ghost
                        >
                            Chỉnh sửa
                        </Button>
                    }
                    className='shadow-lg mb-6'
                >
                    <Space size={30} className='mb-4' align="start">
                        <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                        <div>
                            <Title level={4} className='!mb-1'>{profile.fullName}</Title>
                            <Tag color="blue" className='text-base py-1 px-2'>{profile.role}</Tag>
                            <Paragraph type="secondary" className='!mt-2'>ID Người dùng: {'UV-1002'}</Paragraph>
                        </div>
                    </Space>

                    <Descriptions bordered column={1} size="small" className='mt-4'>
                        <Descriptions.Item label="Họ và tên">{profile.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Email"><MailOutlined className='mr-1' /> {profile.email}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tham gia"><CalendarOutlined className='mr-1' /> {profile.memberSince}</Descriptions.Item>
                        <Descriptions.Item label="Lần đăng nhập cuối">{profile.lastLogin}</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Phần Cài đặt khác */}
                <Card title={'Bảo mật & Cài đặt'} style={{ marginTop: '12px' }} className='shadow-lg mb-6'>
                    <Paragraph>Bạn có thể thay đổi mật khẩu và quản lý phiên đăng nhập tại đây.</Paragraph>
                    <Space>
                        <Button icon={<SafetyOutlined />} type="default">Đổi Mật khẩu</Button>
                        <Button icon={<SettingOutlined />} type="default">Cài đặt Chung</Button>
                        <Button icon={<LogoutOutlined />} type="primary" danger onClick={handleLogout}>Đăng xuất</Button>
                    </Space>
                </Card>
            </div>

            {/* Modal Chỉnh sửa */}
            <Modal
                title="Chỉnh sửa Thông tin Cá nhân"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsEditModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Lưu Thay Đổi
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    initialValues={{
                        fullName: profile.fullName,
                        email: profile.email,
                    }}
                >
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập Họ và tên' }]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} disabled={true} placeholder="Không thể thay đổi email" />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
};

export default UserProfilePage;