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
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const { Paragraph, Title } = Typography;
const { Dragger } = Upload;

const questionTypeOptions = ['Trắc nghiệm', 'Đúng sai', 'Điền từ', 'Ghép nối', 'Thẻ ghi nhớ', 'Phân loại'];
const COST_PER_QUIZ = 1; // Giả sử mỗi câu hỏi tốn 1 đơn vị tiền
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
    const { user, credits, setCredits } = useAuth();
    console.log('user in Home:', user);
    console.log('credits in Home:', credits);

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
        }

        // 1. KIỂM TRA CREDITS TRÊN FRONTEND (Tối ưu trải nghiệm)
        if (credits < COST_PER_QUIZ) {
            setIsFundsModalVisible(true);
            alert('Tài khoản của bạn không đủ để thực hiện giao dịch này!');
            return;
        }

        // Bắt đầu xử lý (hiển thị modal)
        setIsProcessModalVisible(true);
        message.info('Đang gửi yêu cầu tạo bộ câu hỏi...');


        const allData = {
            ...values,
            // Chuyển danh sách file sang format đơn giản (chỉ tên hoặc ID nếu có)
            files: fileList.map(f => ({ name: f.name, uid: f.uid })),
        };

        try {
            // 2. GỌI API BACKEND
            const response = await axios.post(`http://localhost:5000/api/users/quizzes`, allData, {
                withCredentials: true // Gửi cookie xác thực
            });

            if (response.data.success) {
                // 3. Cập nhật Credits trong Context
                const newCredits = response.data.newCredits;
                setCredits(newCredits);
                // Giữ modal xử lý mở (để chờ kết quả AI)
                alert(`Đã trừ ${COST_PER_QUIZ} Credit. Quá trình tạo Quiz đang chạy ngầm...`);
            } else {
                // Nếu backend trả về 200 nhưng success: false (hiếm)
                setIsProcessModalVisible(false);
                message.error(response.data.message || 'Lỗi không xác định khi tạo Quiz.');
            }

        } catch (error) {
            setIsProcessModalVisible(false); // Đóng modal nếu có lỗi

            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403 && error.response.data.message === 'Insufficient funds') {
                    // Lỗi không đủ Credits (Xác nhận từ Backend)
                    setIsFundsModalVisible(true);
                    message.warning('Tài khoản của bạn không đủ để thực hiện giao dịch này!');
                } else if (error.response.status === 401) {
                    message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                    // Bạn nên gọi hàm logout từ Context ở đây
                } else {
                    message.error(`Lỗi hệ thống: ${error.response.data.message || 'Vui lòng thử lại.'}`);
                }
            } else {
                message.error('Lỗi kết nối mạng hoặc server không phản hồi.');
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