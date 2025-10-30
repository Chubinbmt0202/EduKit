import type React from "react";
import { Card, List, Typography, Select, Space, Avatar, Button } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;
const { Title } = Typography;

// Dữ liệu mẫu
const data = [
    {
        title: 'Bài tập Lịch sử Lớp 10',
        description: 'Chủ đề: Chiến tranh thế giới thứ hai (nội dung này sẽ dài hơn một chút để thấy sự khác biệt về chiều cao nếu không dùng CSS)',
    },
    {
        title: 'Kiểm tra Toán Rời rạc',
        description: 'Phần: Logic vị từ và Tập hợp.',
    },
    {
        title: 'Ôn tập Tiếng Anh',
        description: 'Ngữ pháp: Câu điều kiện loại 2. Đây là một mô tả rất dài và cần thiết để kiểm tra tính năng căn chỉnh chiều cao.',
    },
    {
        title: 'Tài liệu Vật lý',
        description: 'Chương 3: Điện trường và Từ trường',
    },
    {
        title: 'Đề thi Thử Hóa Học',
        description: 'Phần: Hợp chất hữu cơ',
    },
    {
        title: 'Kế hoạch Bài giảng',
        description: 'Tuần 5: Phân tích Truyện Kiều',
    },
];

const Folder: React.FC = () => {
    // Hàm xử lý khi bộ lọc thay đổi (ví dụ)
    const handleFilterChange = (value: string) => {
        console.log(`Đã chọn bộ lọc: ${value}`);
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 1. Tiêu đề và Bộ lọc */}
            <div className="flex justify-between items-center">
                <Title level={3}>Bộ câu hỏi của tôi</Title>
                <Space wrap>
                    <Select defaultValue="all" style={{ width: 120 }} onChange={handleFilterChange}
                        options={[{ value: 'all', label: 'Tất cả' }, { value: 'math', label: 'Toán' }, { value: 'history', label: 'Sử' }, { value: 'english', label: 'Anh' }]}
                    />
                    <Select defaultValue="newest" style={{ width: 150 }} onChange={handleFilterChange}
                        options={[{ value: 'newest', label: 'Mới nhất' }, { value: 'oldest', label: 'Cũ nhất' }, { value: 'name', label: 'Tên (A-Z)' }]}
                    />
                    <Button type="primary" className="ml-4"><Link to="/">Tạo bộ đề mới</Link></Button>
                </Space>
            </div>

            {/* Dấu phân cách */}
            <div style={{ borderBottom: '1px solid #f0f0f0' }} />

            {/* 3. Danh sách (List) */}
            <List
                // Cần thêm class để áp dụng Flexbox cho container Ant Design
                // Class này cần được ghi đè lên Ant Design CSS
                className="flex flex-wrap items-stretch"
                grid={{
                    gutter: 16,
                    xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 3,
                }}
                dataSource={data}
                renderItem={(item, index) => (
                    // Ant Design List.Item mặc định là block, cần ép thành flex
                    <div className="overflowY-auto w-full">
                        <List.Item className="flex flex-col">
                            <Card
                                hoverable
                                // Đây là mấu chốt: Card phải kéo dài 100% chiều cao của Item
                                style={{ height: '100%' }}
                                cover={
                                    <img
                                        draggable={false}
                                        alt="thumbnail"
                                        src={`https://picsum.photos/id/${10 + index}/300/150`}
                                        style={{ height: 150, objectFit: 'cover' }}
                                    />
                                }
                                actions={[
                                    <SettingOutlined key="setting" />,
                                    <EditOutlined key="edit" />,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                    title={item.title}
                                    description={
                                        <div style={{
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap', // Không xuống dòng
                                            textOverflow: 'ellipsis', // Thêm ... nếu tràn
                                            maxWidth: '100%' // Đảm bảo không tràn ra ngoài
                                        }}>
                                            {item.description}
                                        </div>
                                    }
                                />
                            </Card>
                        </List.Item>
                    </div>

                )}
            />
        </Space>
    );
}

export default Folder;