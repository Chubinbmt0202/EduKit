/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Typography, message, Upload, Button, Input, Checkbox, Radio, Form, Row, Col } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ProcessingModal from '../components/features/lectures/ProcessingModal';
import InsufficientFundsModal from '../components/features/lectures/InsufficientFundsModal';

const { Paragraph, Title } = Typography;
const { Dragger } = Upload;

const questionTypeOptions = ['Trắc nghiệm', 'Đúng sai', 'Điền từ', 'Ghép nối', 'Thẻ ghi nhớ', 'Phân loại'];

const Home: React.FC = () => {
    const [form] = Form.useForm(); // ⭐ 1. Hook để quản lý Form
    const [fileList, setFileList] = useState<UploadFile[]>([]); // ⭐ 3. State để theo dõi tệp đã tải lên

    const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
    const [isFundsModalVisible, setIsFundsModalVisible] = useState(false);

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', // API giả lập
        onChange(info) {
            setFileList(info.fileList); // Cập nhật danh sách tệp
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleCloseProcessModal = () => setIsProcessModalVisible(false);
    const handleCloseFundsModal = () => setIsFundsModalVisible(false);
    const handleTopUp = () => {
        setIsFundsModalVisible(false);
        message.info('Đang chuyển đến trang nạp tiền...');
    };

    // Hàm xử lý khi nhấn nút TẠO BỘ CÂU HỎI
    const handleCreateQuestions = (values: any) => {
        // `values` bây giờ chứa tất cả dữ liệu từ form
        const allData = {
            ...values,
            files: fileList.map(f => f.name), // Lấy danh sách tên tệp
        };
        console.log('Submitting data:', allData); // Hiển thị tất cả dữ liệu đã thu thập

        // Logic kiểm tra số dư và hiển thị modal
        const hasSufficientFunds = Math.random() > 0.5;
        if (hasSufficientFunds) {
            setIsProcessModalVisible(true);
            message.info('Yêu cầu tạo bộ câu hỏi đang được xử lý...');
        } else {
            setIsFundsModalVisible(true);
            message.warning('Tài khoản của bạn không đủ để thực hiện giao dịch này!');
        }
    };

    return (
        <div className="p-4 md:p-6">
            {/* ⭐ 1. Bọc toàn bộ trong Form */}
            <Form form={form} onFinish={handleCreateQuestions} layout="vertical">
                {/* ⭐ 2. Sử dụng Row và Col cho layout đáp ứng */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={10}>
                        <Card title="1. Cung cấp tài liệu của bạn" style={{ height: '100%' }}>
                            <Paragraph className='bg-blue-100 p-4 rounded-md'>
                                Kéo và thả tệp của bạn vào đây. Hệ thống hỗ trợ các định dạng PDF, DOCX, TXT.
                            </Paragraph>
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                <p className="ant-upload-text">Click hoặc kéo tệp vào khu vực này</p>
                                <p className="ant-upload-hint">Hỗ trợ tải lên một hoặc nhiều tệp.</p>
                            </Dragger>
                        </Card>
                    </Col>

                    <Col xs={24} lg={14}>
                        <Card title="2. Tùy chỉnh thông tin" style={{ height: '100%' }}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="gradeLevel" label={<Title level={5}>Lớp giảng dạy</Title>}>
                                        <Input placeholder="Ví dụ: lớp 12" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="questionCount" label={<Title level={5}>Số lượng câu hỏi</Title>}>
                                        <Input type="number" placeholder="Ví dụ: 10" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="questionTypes" label={<Title level={5}>Chọn loại câu hỏi</Title>}>
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
                                {/* ⭐ 3. Vô hiệu hóa nút khi chưa có tệp */}
                                <Button type="primary" htmlType="submit" disabled={fileList.length === 0}>
                                    Tạo bộ câu hỏi
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <ProcessingModal isVisible={isProcessModalVisible} onClose={handleCloseProcessModal} onSuccess={handleCloseProcessModal} />
            <InsufficientFundsModal isVisible={isFundsModalVisible} onClose={handleCloseFundsModal} onNavigateToTopUp={handleTopUp} />
        </div>
    );
};

export default Home;