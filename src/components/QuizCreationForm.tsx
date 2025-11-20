/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/QuizCreationForm.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Typography, message, Upload, Button, Input, Checkbox, Radio, Form, Row, Col } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Paragraph, Title } = Typography;
const { Dragger } = Upload;

const questionTypeOptions = ['Trắc nghiệm', 'Đúng sai', 'Điền từ', 'Ghép nối', 'Thẻ ghi nhớ', 'Phân loại'];
const COST_PER_QUIZ = 1; // Giả sử mỗi câu hỏi tốn 1 đơn vị tiền

// Định nghĩa props cho component này
interface QuizCreationFormProps {
    user: any; // Thay thế bằng type User nếu có
    credits: number;
    updateCredits?: (newCredits: number) => void;
    setIsFundsModalVisible: (isVisible: boolean) => void;
    setIsLoginModalVisible: (isVisible: boolean) => void;

    // 🆕 Thêm các props điều khiển Modal xử lý
    setIsProcessModalVisible: (isVisible: boolean) => void;
    setIsProcessSuccess: (isSuccess: boolean) => void;
    setIsProcessError: (isError: boolean) => void;
    setGeneratedQuizId: (id: string | undefined) => void;
}

// --- Helper function để chuẩn hóa giá trị từ Upload component ---
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const QuizCreationForm: React.FC<QuizCreationFormProps> = ({
    user,
    credits,
    updateCredits,
    setIsFundsModalVisible,
    setIsLoginModalVisible,
    setIsProcessModalVisible,
    setIsProcessSuccess,
    setIsProcessError,
    setGeneratedQuizId,
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    // ⭐ Khai báo messageApi và contextHolder ⭐
    const [messageApi, contextHolder] = message.useMessage();

    // --- Cấu hình Upload (Đã sử dụng messageApi) ---
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false, // Chỉ cho phép 1 file cho đơn giản
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', // API giả lập
        onChange(info) {
            // Chỉ giữ lại file cuối cùng nếu multiple=false
            const newFileList = info.fileList.slice(-1);
            setFileList(newFileList);
            if (info.file.status === 'done') {
                // ⭐ Sửa: dùng messageApi.success
                messageApi.success(`${info.file.name} file uploaded successfully.`);
            } else if (info.file.status === 'error') {
                // ⭐ Sửa: dùng messageApi.error
                messageApi.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove: (file) => {
            const newFileList = fileList.filter(f => f.uid !== file.uid);
            setFileList(newFileList);
        },
        beforeUpload: () => false, // Ngăn không cho tự động upload, quản lý thủ công
        fileList: fileList,
    };


    // Hàm xử lý khi nhấn nút TẠO BỘ CÂU HỎI
    const handleCreateQuestions = async (values: any) => {
        const { files, ...otherValues } = values;

        // Bỏ qua kiểm tra fileList.length vì Form.Item đã handle rule required
        if (fileList.length === 0) return;

        const formData = new FormData();

        // Thêm các trường form khác vào formData
        Object.keys(otherValues).forEach(key => {
            const value = otherValues[key];
            if (Array.isArray(value)) {
                // Xử lý các mảng (như questionTypes)
                value.forEach(item => formData.append(key, item));
            } else {
                formData.append(key, value);
            }
        });

        formData.append('amount', COST_PER_QUIZ.toString());

        // Thêm file vào formData
        const file = fileList[0];
        // Đảm bảo originFileObj tồn tại
        if (file.originFileObj) {
            formData.append('document', file.originFileObj as Blob, file.name);
        }

        console.log('Form values:', values);

        // 1. KIỂM TRA ĐĂNG NHẬP
        if (!user) {
            setIsLoginModalVisible(true);
            return;
        }

        // 2. KIỂM TRA CREDITS TRÊN FRONTEND (Tối ưu trải nghiệm)
        if (credits < COST_PER_QUIZ) {
            setIsFundsModalVisible(true);
            return;
        }

        const allData = {
            ...values,
            files: fileList.map(f => ({ name: f.name, uid: f.uid })),
            amount: COST_PER_QUIZ
        };

        setIsProcessModalVisible(true);
        setIsProcessError(false);
        setIsProcessSuccess(false);
        setGeneratedQuizId(undefined);

        try {

            // ⭐ 1. GỌI API BACKEND: Khấu trừ Credits
            const responseDeduct = await axios.post(`http://localhost:5000/api/users/deduct-credits`, allData, {
                withCredentials: true
            });

            if (!responseDeduct.data.success) {
                // ⭐ Sửa: Dùng messageApi.error
                messageApi.error({ content: responseDeduct.data.message || 'Lỗi khấu trừ Credits.', key: 'deducting', duration: 3 });
                return;
            }
            // ⭐ 2. GỌI API BACKEND: Tạo Quiz (File Upload + Gemini Call)
            const responseCreateQuiz = await axios.post(`http://localhost:5000/api/quizzes/create`, formData, {
                withCredentials: true
            });

            console.log('Quiz creation response:', responseCreateQuiz);
            const generatedQuizId = responseCreateQuiz.data.quizId;
            setGeneratedQuizId(generatedQuizId);
            setIsProcessSuccess(true);

            // ⭐ 3. Cập nhật Credits trong Context
            const creditsRes = await axios.get(`http://localhost:5000/api/users/credits`, {
                withCredentials: true
            });

            console.log('Updated credits from backend:', creditsRes.data);
            const newCredits = creditsRes.data.credits;
            if (typeof newCredits === 'number') {
                updateCredits?.(newCredits);
            }

        } catch (error) {
            // ⭐ Sửa: Dùng messageApi.destroy
            messageApi.destroy('deducting'); // Đóng thông báo loading nếu có lỗi

            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403 && error.response.data.message === 'Insufficient funds') {
                    // Lỗi không đủ Credits (Xác nhận từ Backend)
                    setIsFundsModalVisible(true);
                    // ⭐ Sửa: Dùng messageApi.warning
                    messageApi.warning('Tài khoản của bạn không đủ để thực hiện giao dịch này!');
                } else if (error.response.status === 401) {
                    // ⭐ Sửa: Dùng messageApi.error
                    messageApi.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                    // Nên gọi hàm logout/clear user từ Context
                } else {
                    // ⭐ Sửa: Dùng messageApi.error
                    messageApi.error(`Lỗi hệ thống: ${error.response.data.message || 'Vui lòng thử lại.'}`);
                }
            } else {
                // ⭐ Sửa: Dùng messageApi.error
                messageApi.error('Lỗi kết nối mạng hoặc server không phản hồi.');
            }
        }
    };

    // ⭐ Đã chuyển toàn bộ JSX Form vào đây
    return (
        <>
            {/* ⭐ Thêm contextHolder vào đầu JSX để hiển thị thông báo ⭐ */}
            {contextHolder}
            <Form form={form} onFinish={handleCreateQuestions} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={10}>
                        <Card title="1. Cung cấp tài liệu của bạn" style={{ height: '100%' }}>
                            <Paragraph className='bg-blue-100 p-4 rounded-md'>
                                Kéo và thả tệp của bạn vào đây. Hệ thống hỗ trợ các định dạng PDF, DOCX, TXT.
                            </Paragraph>

                            <Form.Item
                                name="files"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[
                                    {
                                        required: true,
                                        validator: (_, value) => {
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
                                        initialValue={5}
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

                            <Form.Item name="difficulty" label={<Title level={5}>Mức độ khó</Title>} initialValue="tron">
                                <Radio.Group buttonStyle="solid">
                                    <Radio.Button value="nhanbiet">Nhận biết</Radio.Button>
                                    <Radio.Button value="thonghieu">Thông hiểu</Radio.Button>
                                    <Radio.Button value="vandungthap">Vận dụng thấp</Radio.Button>
                                    <Radio.Button value="vandungcao">Vận dụng cao</Radio.Button>
                                    <Radio.Button value="tron">Xáo trộn</Radio.Button>
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
        </>
    );
};

export default QuizCreationForm;