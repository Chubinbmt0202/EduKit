/*
 * File: chubinbmt0202/edukit/EduKit-632165e1b9a4407a0f06213c87701ba0223a5e13/src/pages/QuizDetail.tsx
 */
import React, { useEffect } from 'react';
import { Card, Space, Tabs } from 'antd';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
    SelectOutlined, HighlightOutlined, CopyOutlined,
    ProductOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom'; // Import useParams
// --- Import các hooks và components cần thiết ---
import { useFetch } from '../hooks'; // Import useFetch
import { Loading } from '../common'; // Import Loading
import { useLayoutContext } from '../components/layout/Layout';
import SourceDocumentViewer from '../components/features/quizes/SourceDocumentViewer';
import QuizActionsBar from '../components/features/quizes/QuizActionsBar';

// ... (Imports các components Tab con)
import MultipleChoiceTab from '../components/features/quizes/MultipleChoiceTab';
import FillInTheBlanksTab from '../components/features/quizes/FillInTheBlanksTab';
import MatchingTab from '../components/features/quizes/MatchingTab';
import SortTab from '../components/features/quizes/SortTab';
import FlashcardsTab from '../components/features/quizes/FlashCardTab';
import TrueFalseTab from '../components/features/quizes/TrueFalseTab';


// Giả định kiểu dữ liệu Quiz cho useFetch
interface MockQuizData {
    id: string;
    title: string;
    sourceDocument: string;
    // ... các trường khác
}

const SOURCE_DOCUMENT_CONTENT = `
TOÁN (Tiết 22)
... (Phần còn lại của nội dung)
`;

const QuizCreationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID Quiz từ URL
    const { setCollapsed } = useLayoutContext();

    // ⭐ BƯỚC 1: Sử dụng useFetch để mô phỏng tải dữ liệu Quiz ⭐
    // Giả định endpoint API_ENDPOINTS.QUIZ.GET_DETAIL(id) sẽ trả về dữ liệu
    const { loading } = useFetch<MockQuizData>(`/quizzes/${id}`);

    // BƯỚC 2: Tự động thu gọn Sidebar và xử lý Loading
    useEffect(() => {
        // Thu gọn Sidebar ngay lập tức (không phụ thuộc vào loading)
        setCollapsed(true);
    }, [setCollapsed]);

    if (loading) {
        // ⭐ BƯỚC 3: Hiển thị Loading toàn màn hình (hoặc chính giữa khu vực nội dung) ⭐
        return <Loading message="Đang tải chi tiết Bộ đề..." />;
    }

    const handlePublish = () => {
        console.log('Publishing Quiz...');
    }

    const tabItems = [
        { label: <Space><SelectOutlined />Trắc nghiệm</Space>, key: 'mcq', children: <MultipleChoiceTab /> },
        { label: <Space><HighlightOutlined />Điền từ</Space>, key: 'fill_in_blanks', children: <FillInTheBlanksTab /> },
        { label: <Space><CopyOutlined />Ghép nối</Space>, key: 'matching', children: <MatchingTab /> },
        { label: <Space><ProductOutlined />Phân loại</Space>, key: 'categorization', children: <SortTab /> },
        { label: <Space><ProductOutlined />Thẻ ghi nhớ</Space>, key: 'flashcards', children: <FlashcardsTab /> },
        { label: <Space><ProductOutlined />Đúng sai</Space>, key: 'true_false', children: <TrueFalseTab /> },
    ];

    return (
        <div className='h-full'>
            <QuizActionsBar onPublish={handlePublish} />

            <PanelGroup
                direction="horizontal"
                style={{
                    height: 'calc(100vh - 170px)',
                    background: '#ffffff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                {/* Sử dụng dữ liệu giả lập cho nội dung tài liệu */}
                <SourceDocumentViewer documentContent={SOURCE_DOCUMENT_CONTENT} />

                <PanelResizeHandle
                    style={{ width: '5px', cursor: 'col-resize', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                </PanelResizeHandle>

                <Panel className='ml-4' defaultSize={65} minSize={40} >
                    <Card style={{ height: '100%' }} >
                        <Tabs
                            defaultActiveKey="mcq"
                            items={tabItems}
                        />
                    </Card>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default QuizCreationPage;