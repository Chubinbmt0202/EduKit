import React from 'react'; // Bỏ các hooks không cần thiết
import {
    Typography, Card, Space, Button,
    Tabs, Input, Pagination
} from 'antd';
// Import thư viện mới
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
    SearchOutlined,
    SoundOutlined, PrinterOutlined, DownloadOutlined, FullscreenOutlined,
    MessageOutlined, ReadOutlined, ExperimentOutlined, CustomerServiceOutlined,
    BookOutlined, SnippetsOutlined, ProfileOutlined,
    LikeOutlined, DislikeOutlined, CopyOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
// import { useParams } from 'react-router-dom';

const { Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// ... (sourceDocumentContent không đổi) ...
const sourceDocumentContent = `
TOÁN (Tiết 22)
Bài 8: BẢNG CỘNG (QUA 10)
Tiết 2 – Luyện tập
...
`;

// Bỏ các hằng số và logic kéo-thả (drag)

const QuizCreationPage: React.FC = () => {
    // const { id } = useParams<{ id: string }>();

    // Bỏ toàn bộ state và hooks xử lý kéo (siderWidth, isDraggingRef, handleMouseDown, useEffect)

    return (
        // Thay thế <div> bằng <PanelGroup>
        <PanelGroup
            direction="horizontal"
            style={{
                height: 'calc(100vh - 160px)',
                background: '#ffffff'
            }}
        >
            {/* ****************************************************** */}
            {/* Cột 1 (Trái): Trình xem tài liệu (Bây giờ là <Panel>) */}
            {/* ****************************************************** */}
            <Panel defaultSize={35} minSize={35} maxSize={60}> {/* Đặt % mặc định và giới hạn */}
                <div
                    style={{
                        height: '100%',
                        overflowY: 'auto',
                        borderRight: '1px solid #e8e8e8',
                        background: '#ffffff'
                    }}
                >
                    {/* Đặt Card bên trong div */}
                    <Card style={{ border: 'none', boxShadow: 'none' }}>
                        {/* Toolbar của trình xem tài liệu */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                            <Space>
                                <Button icon={<SearchOutlined />} />
                                {/* ... các nút khác ... */}
                            </Space>
                            <Space>
                                <Pagination simple current={1} total={30} pageSize={10} size="small" />
                                {/* ... Select và các nút khác ... */}
                            </Space>
                            <Space>
                                <Button icon={<PrinterOutlined />} />
                                <Button icon={<DownloadOutlined />} />
                                <Button icon={<FullscreenOutlined />} />
                            </Space>
                        </div>

                        {/* Nội dung tài liệu (Mô phỏng bằng <pre>) */}
                        <div style={{ padding: '20px 0', background: '#fff', marginTop: '10px', height: '100%', overflowY: 'auto' }}>
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

            {/* ****************************************************** */}
            {/* Dải phân cách (Thay thế bằng <PanelResizeHandle>) */}
            {/* ****************************************************** */}
            <PanelResizeHandle
                style={{
                    width: '8px',
                    cursor: 'col-resize',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    borderLeft: '1px solid #e8e8e8',
                    borderRight: '1px solid #e8e8e8',
                }}
            >
                <MenuUnfoldOutlined style={{ color: '#aaa', fontSize: '10px' }} />
            </PanelResizeHandle>

            {/* ****************************************************** */}
            {/* Cột 2 (Phải): Bảng điều khiển AI (Bây giờ là <Panel>) */}
            {/* ****************************************************** */}
            <Panel defaultSize={65} minSize={30}>
                <div style={{
                    padding: '10px',
                    overflowY: 'auto',
                    height: '100%'
                }}>
                    <Card
                        style={{ height: '100%' }}
                        bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Tabs điều khiển */}
                        <Tabs defaultActiveKey="1" style={{ padding: '0 16px', flex: '0 0 auto' }} >
                            <TabPane tab={<Space><MessageOutlined />Trắc nghiệm</Space>} key="1" />
                            <TabPane tab={<Space><ReadOutlined />Đúng sai</Space>} key="2" />
                            <TabPane tab={<Space><ExperimentOutlined />Điền vào chỗ trống</Space>} key="3" />
                            <TabPane tab={<Space><CustomerServiceOutlined />Podcast</Space>} key="4" />
                            <TabPane tab={<Space><SnippetsOutlined />Tóm tắt</Space>} key="5" />
                            <TabPane tab={<Space><BookOutlined />Chương</Space>} key="6" />
                            <TabPane tab={<Space><ProfileOutlined />Ghi chú</Space>} key="7" />
                        </Tabs>

                        {/* Nội dung Chat (Phần chính, tự động co giãn) */}
                        <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '16px' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {/* Tin nhắn của AI */}
                                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
                                    <Paragraph style={{ margin: 0 }}>
                                        I can help create a quiz for you! What specific topics or areas from the "KHBD MÔN TOÁN LỚP 2" content would you like the quiz to focus on? Please provide more details so I can generate relevant questions.
                                    </Paragraph>
                                    <Space style={{ marginTop: '10px' }}>
                                        <Button size="small" icon={<CopyOutlined />} />
                                        <Button size="small" icon={<LikeOutlined />} />
                                        <Button size="small" icon={<DislikeOutlined />} />
                                        <Button size="small" icon={<SoundOutlined />} />
                                    </Space>
                                </div>
                            </Space>
                        </div>

                        {/* Input của Chat (Ghim ở dưới cùng) */}
                        <div style={{ flex: '0 0 auto', padding: '16px', borderTop: '1px solid #f0f0f0' }}>
                            <TextArea
                                placeholder="Create me a @Quiz on"
                                autoSize={{ minRows: 2, maxRows: 5 }}
                            />
                        </div>
                    </Card>
                </div>
            </Panel>

        </PanelGroup> // Thay thế </div> bằng </PanelGroup>
    );
};

export default QuizCreationPage;

