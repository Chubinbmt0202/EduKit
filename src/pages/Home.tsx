// src/pages/Home.tsx

import React from 'react';
import { Card, Typography, message, Upload, Button, Input, Checkbox, Radio } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
const { Dragger } = Upload;

const plainOptions = ['Trắc nghiệm', 'Đúng sai', 'Điền từ', 'Ghép nối', 'Thẻ ghi nhớ', 'Phân loại',];


const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

const Home: React.FC = () => {
    return (
        <div>
            <div className="flex">
                <Card style={{ width: '40rem', marginRight: '1rem' }} title="Cung cấp tài liệu của bạn" >
                    <Paragraph className='bg-blue-100 p-4 rounded-md'>
                        Đây là khu vực tải nội dung của bạn, vui lòng kéo và thả tệp vào đây.
                    </Paragraph>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click hoặc kéo tệp vào khu vực này để tải lên</p>
                        <p className="ant-upload-hint">
                            Hỗ trợ tải lên một hoặc nhiều tệp. Nghiêm cấm tải lên dữ liệu công ty hoặc các tệp bị cấm khác.
                        </p>
                    </Dragger>
                </Card>
                <Card style={{ width: '100%' }} title="Thông tin bổ sung" >
                    <div className='flex '>
                        <div className='mr-4 w-1/2'>
                            <Paragraph className='font-bold' >
                                Bạn đang giảng dạy lớp mấy ?
                            </Paragraph>
                            <Input placeholder="Nhập lớp bạn đang dạy. Ví dụ: lớp 2" />
                        </div>
                        <div className='w-1/2'>
                            <Paragraph className='font-bold'>
                                Bạn muốn có bao nhiêu câu hỏi cho mỗi bài tập ?
                            </Paragraph>
                            <Input placeholder="Nhập số lượng câu hỏi. 2" />
                        </div>
                    </div>
                    <div className='mt-6 '>
                        <h1 className='font-bold mb-2'>Chọn loại câu hỏi muốn tạo</h1>
                        <div>
                            <Checkbox.Group options={plainOptions} />
                        </div>
                    </div>

                    <div className='mt-6 '>
                        <h1 className='font-bold mb-2'>Mức độ khó của câu hỏi</h1>
                        <div>
                            <Radio.Group defaultValue="a" buttonStyle="solid">
                                <Radio.Button value="a">Nhận biết</Radio.Button>
                                <Radio.Button value="b">Thông hiểu</Radio.Button>
                                <Radio.Button value="c">Vận dụng thấp</Radio.Button>
                                <Radio.Button value="d">Vận dụng cao</Radio.Button>
                                <Radio.Button value="e">Xáo trộn</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className='mt-10 flex justify-end'>
                        <Button type="primary">Tạo bộ câu hỏi</Button>
                    </div>
                </Card>
            </div>

        </div>

    );
};

export default Home;