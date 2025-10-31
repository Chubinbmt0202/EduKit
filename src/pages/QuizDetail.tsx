import React from 'react';
import { Card, Space, Button, Tabs, Pagination } from 'antd';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
    SearchOutlined, PrinterOutlined, DownloadOutlined, FullscreenOutlined,
    SelectOutlined, HighlightOutlined, CopyOutlined,
    ProductOutlined,
} from '@ant-design/icons';

// --- Imports các Component Tab con ---
import MultipleChoiceTab from '../components/features/quizes/MultipleChoiceTab';
import FillInTheBlanksTab from '../components/features/quizes/FillInTheBlanksTab';
import MatchingTab from '../components/features/quizes/MatchingTab';
import SortTab from '../components/features/quizes/SortTab';
import FlashcardsTab from '../components/features/quizes/FlashCardTab';
import TrueFalseTab from '../components/features/quizes/TrueFalseTab';
// ----------------------------------------

// const { Paragraph } = Typography;
// const { TextArea } = Input;

// Nội dung tài liệu mô phỏng
const sourceDocumentContent = `
TOÁN (Tiết 22)
Bài 8: BẢNG CỘNG (QUA 10)
Tiết 2 – Luyện tập

1. Phép cộng: 9 + 4 = ?
Cách 1: Tách 4 thành 1 và 3. Lấy 9 cộng 1 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
Cách 2: Tách 9 thành 3 và 6. Lấy 4 cộng 6 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
... (Nội dung tài liệu dài hơn)
1. Phép cộng: 9 + 4 = ?
Cách 1: Tách 4 thành 1 và 3. Lấy 9 cộng 1 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
Cách 2: Tách 9 thành 3 và 6. Lấy 4 cộng 6 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
... (Nội dung tài liệu dài hơn)
1. Phép cộng: 9 + 4 = ?
Cách 1: Tách 4 thành 1 và 3. Lấy 9 cộng 1 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
Cách 2: Tách 9 thành 3 và 6. Lấy 4 cộng 6 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
... (Nội dung tài liệu dài hơn)
1. Phép cộng: 9 + 4 = ?
Cách 1: Tách 4 thành 1 và 3. Lấy 9 cộng 1 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
Cách 2: Tách 9 thành 3 và 6. Lấy 4 cộng 6 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
... (Nội dung tài liệu dài hơn)
1. Phép cộng: 9 + 4 = ?
Cách 1: Tách 4 thành 1 và 3. Lấy 9 cộng 1 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
Cách 2: Tách 9 thành 3 và 6. Lấy 4 cộng 6 bằng 10. Lấy 10 cộng 3 bằng 13. Vậy 9 + 4 = 13.
... (Nội dung tài liệu dài hơn)
...
Các bài toán liên quan đến số tròn chục và tính nhanh. Ví dụ: Tính 20 + 7 + 3. (Gợi ý: Nhóm 7 và 3).
`;

const QuizCreationPage: React.FC = () => {
    // Lưu ý: Đảm bảo component này được đặt trong Layout của Ant Design để CSS hoạt động đúng

    return (
        <PanelGroup
            direction="horizontal"
            // Điều chỉnh chiều cao để phù hợp với Layout đã Fixed Header (100% viewport trừ đi Header và padding)
            style={{
                height: 'calc(100vh - 170px)', // Giả định 170px là khoảng trống
                background: '#ffffff',
                borderRadius: '8px',
                overflow: 'hidden', // Quan trọng cho PanelResizeHandle
            }}
        >
            {/* ****************************************************** */}
            {/* Cột 1 (Trái): Trình xem tài liệu */}
            {/* ****************************************************** */}
            <Panel defaultSize={35} minSize={35} maxSize={60}>
                <div className='mr-4'>
                    <Card size="small" >

                        {/* Toolbar */}
                        <div className='flex justify-between items-center pb-3 mb-3 border-b border-gray-200'>
                            <Space>
                                <Button icon={<SearchOutlined />} />
                            </Space>
                            <Space>
                                <Pagination simple current={1} total={50} pageSize={10} size="small" />
                            </Space>
                            <Space>
                                <Button icon={<PrinterOutlined />} />
                                <Button icon={<DownloadOutlined />} />
                                <Button icon={<FullscreenOutlined />} />
                            </Space>
                        </div>

                        {/* Nội dung tài liệu */}
                        <div className='mt-3 h-full overflow-y-auto' style={{ maxHeight: 'calc(100vh - 250px)' }}>
                            <pre style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                lineHeight: '1.7',
                                color: '#333'
                            }}>
                                {sourceDocumentContent.trim()}
                            </pre>
                        </div>
                    </Card>
                </div>
            </Panel>

            {/* Dải phân cách */}
            <PanelResizeHandle
                style={{ width: '5px', cursor: 'col-resize', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
            </PanelResizeHandle>

            {/* ****************************************************** */}
            {/* Cột 2 (Phải): Bảng điều khiển AI và Chat */}
            {/* ****************************************************** */}
            <Panel className='ml-4' defaultSize={65} minSize={40} >
                <Card style={{ height: '100%' }} >

                    {/* 1. Tabs điều khiển (Chuyển đổi loại câu hỏi) */}
                    <Tabs defaultActiveKey="mcq" tabBarExtraContent={
                        <Button type="primary">Xuất bản Bộ đề</Button>
                    }>
                        <Tabs.TabPane tab={<Space><SelectOutlined />Trắc nghiệm</Space>} key="mcq">
                            <MultipleChoiceTab />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<Space><HighlightOutlined />Điền từ</Space>} key="fill_in_blanks">
                            <FillInTheBlanksTab />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<Space><CopyOutlined />Ghép nối</Space>} key="matching">
                            <MatchingTab />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<Space><ProductOutlined />Phân loại</Space>} key="categorization">
                            <SortTab />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<Space><ProductOutlined />Thẻ ghi nhớ</Space>} key="flashcards">
                            <FlashcardsTab />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<Space><ProductOutlined />Đúng sai</Space>} key="true_false">
                            <TrueFalseTab />
                        </Tabs.TabPane>
                    </Tabs>

                </Card>
            </Panel>
        </PanelGroup>
    );
};

export default QuizCreationPage;
