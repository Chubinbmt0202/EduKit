/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * File: chubinbmt0202/edukit/EduKit-632165e1b9a4407a0f06213c87701ba0223a5e13/src/pages/Home.tsx
 */
import React, { useState } from 'react';
import { Card, Typography, message, Upload, Button, Input, Checkbox, Radio, Form, Row, Col } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ProcessingModal from '../components/features/lectures/ProcessingModal';
import InsufficientFundsModal from '../components/features/lectures/InsufficientFundsModal';
import LoginNotiModal from '../components/features/lectures/LoginNotiModal';
import type { User } from '../types/user.types';

const { Paragraph, Title } = Typography;
const { Dragger } = Upload;

const questionTypeOptions = ['Trắc nghiệm', 'Đúng sai', 'Điền từ', 'Ghép nối', 'Thẻ ghi nhớ', 'Phân loại'];

// --- Helper function để chuẩn hóa giá trị từ Upload component ---
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const Home: React.FC = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
    const [isFundsModalVisible, setIsFundsModalVisible] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    const [user] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user data:', storedUser);
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Failed to parse user data from localStorage", e);
            return null;
        }
    });

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', // API giả lập
        onChange(info) {
            setFileList(info.fileList);
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove: (file) => {
            const newFileList = fileList.filter(f => f.uid !== file.uid);
            setFileList(newFileList);
        },
        beforeUpload: () => false, // Ngăn không cho tự động upload, quản lý thủ công
        fileList: fileList,
    };

    const handleCloseProcessModal = () => setIsProcessModalVisible(false);
    const handleCloseFundsModal = () => setIsFundsModalVisible(false);
    const handleTopUp = () => {
        setIsFundsModalVisible(false);
        message.info('Đang chuyển đến trang nạp tiền...');
    };

    // Hàm xử lý khi nhấn nút TẠO BỘ CÂU HỎI
    const handleCreateQuestions = async (values: any) => {
        if (!user) {
            setIsLoginModalVisible(true);
            return;
        } else {
            const allData = {
                ...values,
                // Sử dụng fileList từ state để đảm bảo lấy đúng trạng thái mới nhất
                files: fileList.map(f => f.name),
            };
            console.log('Submitting data:', allData);

            // Logic kiểm tra số dư và hiển thị modal
            const hasSufficientFunds = Math.random() > 0.5;
            if (hasSufficientFunds) {
                setIsProcessModalVisible(true);
                message.info('Yêu cầu tạo bộ câu hỏi đang được xử lý...');
            } else {
                setIsFundsModalVisible(true);
                message.warning('Tài khoản của bạn không đủ để thực hiện giao dịch này!');
            }
        }

    };

    return (
        <div className="p-4 md:p-6">
            <Form form={form} onFinish={handleCreateQuestions} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={10}>
                        <Card title="1. Cung cấp tài liệu của bạn" style={{ height: '100%' }}>
                            <Paragraph className='bg-blue-100 p-4 rounded-md'>
                                Kéo và thả tệp của bạn vào đây. Hệ thống hỗ trợ các định dạng PDF, DOCX, TXT.
                            </Paragraph>

                            {/* ⭐ BƯỚC 1 & 2: Bọc Dragger trong Form.Item và thêm rules ⭐ */}
                            <Form.Item
                                name="files"
                                valuePropName="fileList" // Prop chứa giá trị (array of files)
                                getValueFromEvent={normFile} // Hàm chuyển đổi Event thành giá trị (array of files)
                                rules={[
                                    {
                                        required: true,
                                        validator: (_, value) => {
                                            // Kiểm tra nếu danh sách file rỗng hoặc không có file nào hợp lệ
                                            if (value && value.length > 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Vui lòng tải lên ít nhất một tệp tài liệu.'));
                                        },
                                    },
                                ]}
                            >
                                <Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                    <p className="ant-upload-text">Click hoặc kéo tệp vào khu vực này</p>
                                    <p className="ant-upload-hint">Hỗ trợ tải lên một hoặc nhiều tệp.</p>
                                </Dragger>
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} lg={14}>
                        <Card title="2. Tùy chỉnh thông tin" style={{ height: '100%' }}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="gradeLevel"
                                        label={<Title level={5}>Lớp giảng dạy</Title>}
                                        rules={[{ required: true, message: 'Vui lòng nhập lớp giảng dạy!' }]}
                                    >
                                        <Input placeholder="Ví dụ: lớp 12" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="questionCount"
                                        label={<Title level={5}>Số lượng câu hỏi</Title>}
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số lượng câu hỏi.' },
                                            {
                                                validator: (_, value) => {
                                                    const num = Number(value);
                                                    if (!value || (Number.isInteger(num) && num >= 1 && num <= 50)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Số lượng phải là số nguyên từ 1 đến 50.'));
                                                },
                                            }
                                        ]}
                                        initialValue={10}
                                    >
                                        <Input type="number" placeholder="Ví dụ: 10" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="questionTypes"
                                label={<Title level={5}>Chọn loại câu hỏi</Title>}
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một loại câu hỏi.' }]}
                            >
                                <Checkbox.Group options={questionTypeOptions} />
                            </Form.Item>

                            <Form.Item name="difficulty" label={<Title level={5}>Mức độ khó</Title>} initialValue="mix">
                                <Radio.Group buttonStyle="solid">
                                    <Radio.Button value="easy">Nhận biết</Radio.Button>
                                    <Radio.Button value="medium">Thông hiểu</Radio.Button>
                                    <Radio.Button value="hard">Vận dụng thấp</Radio.Button>
                                    <Radio.Button value="very_hard">Vận dụng cao</Radio.Button>
                                    <Radio.Button value="mix">Xáo trộn</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <div className='mt-6 flex justify-end'>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Tạo bộ câu hỏi
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <ProcessingModal isVisible={isProcessModalVisible} onClose={handleCloseProcessModal} />
            <InsufficientFundsModal isVisible={isFundsModalVisible} onClose={handleCloseFundsModal} onNavigateToTopUp={handleTopUp} />
            {/* Modal thông báo đăng nhập */}
            <LoginNotiModal isVisible={isLoginModalVisible} onClose={() => setIsLoginModalVisible(false)} onNavigateToTopUp={() => { }} />
        </div>
    );
};

export default Home;