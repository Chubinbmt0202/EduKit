/*
 * File: src/pages/QuizDetail.tsx
 */
import React, { useEffect, useState } from 'react';
import { Card, Space, Tabs, Spin, Alert } from 'antd';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
    SelectOutlined, HighlightOutlined, CopyOutlined,
    ProductOutlined, CheckSquareOutlined, AppstoreOutlined
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useLayoutContext } from '../components/layout/Layout';
import SourceDocumentViewer from '../components/features/quizes/SourceDocumentViewer';
import QuizActionsBar from '../components/features/quizes/QuizActionsBar';

// Import các components Tab con
import MultipleChoiceTab from '../components/features/quizes/MultipleChoiceTab';
import FillInTheBlanksTab from '../components/features/quizes/FillInTheBlanksTab';
import MatchingTab from '../components/features/quizes/MatchingTab';
import SortTab from '../components/features/quizes/SortTab';
import FlashcardsTab from '../components/features/quizes/FlashCardTab';
import TrueFalseTab from '../components/features/quizes/TrueFalseTab';

// --- ĐỊNH NGHĨA INTERFACE DỰA TRÊN JSON ---
import type { QuizData } from '../types/quiz.types';

// --- END INTERFACE ---

const QuizCreationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { setCollapsed } = useLayoutContext();

    // State lưu dữ liệu quiz thực tế
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCollapsed(true);

        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                // Thay đổi URL này theo đúng backend của bạn (đang dùng port 3000 hay 5000?)
                const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`, {
                    withCredentials: true,
                });
                console.log('Fetched quiz data:', response.data);

                if (response.data && response.data.success) {
                    setQuizData(response.data.quiz);
                } else {
                    setError("Không tìm thấy dữ liệu quiz.");
                }
            } catch (err) {
                console.error('Error fetching quiz data:', err);
                setError("Lỗi kết nối đến máy chủ.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function (nếu cần)
        return () => setCollapsed(false);
    }, [id, setCollapsed]);

    const handlePublish = () => {
        console.log('Publishing Quiz...', quizData);
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Spin size="large" tip="Đang tải dữ liệu bộ đề..." /></div>;
    }

    if (error || !quizData) {
        return <div className="p-8"><Alert message="Lỗi" description={error || "Không có dữ liệu"} type="error" showIcon /></div>;
    }

    // --- LỌC DỮ LIỆU CHO TỪNG TAB ---
    const mcqGame = quizData.generated_games.find(g => g.game_type === 'multiple_choice_abcd');
    const tfGame = quizData.generated_games.find(g => g.game_type === 'true_false');
    const fillBlankGame = quizData.generated_games.find(g => g.game_type === 'fill_in_the_blank');
    const matchingGame = quizData.generated_games.find(g => g.game_type === 'matching');
    const flashcardGame = quizData.generated_games.find(g => g.game_type === 'flashcards');
    const sortingGame = quizData.generated_games.find(g => g.game_type === 'sorting');

    // Tạo items cho Tabs và truyền props `data` vào
    const tabItems = [
        {
            label: <Space><SelectOutlined />Trắc nghiệm</Space>,
            key: 'mcq',
            // Truyền danh sách câu hỏi vào component con
            children: <MultipleChoiceTab data={mcqGame?.questions || []} />
        },
        {
            label: <Space><CheckSquareOutlined />Đúng sai</Space>,
            key: 'true_false',
            children: <TrueFalseTab data={tfGame?.statements || []} />
        },
        {
            label: <Space><HighlightOutlined />Điền từ</Space>,
            key: 'fill_in_blanks',
            children: <FillInTheBlanksTab data={fillBlankGame?.sentences || []} />
        },
        {
            label: <Space><CopyOutlined />Ghép nối</Space>,
            key: 'matching',
            children: <MatchingTab data={matchingGame?.pairs || []} instruction={matchingGame?.instruction} />
        },
        {
            label: <Space><AppstoreOutlined />Thẻ ghi nhớ</Space>,
            key: 'flashcards',
            children: <FlashcardsTab data={flashcardGame?.cards || []} title={flashcardGame?.deck_title} />
        },
        {
            label: <Space><ProductOutlined />Phân loại</Space>,
            key: 'categorization',
            children: <SortTab data={sortingGame?.categories || []} instruction={sortingGame?.instruction} />
        },
    ];

    // dữ liệu mẫu cho SourceDocumentViewer
    const sampleDocumentContent = `This is a sample source document content.
You can replace this with the actual content of the document associated with the quiz.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    return (
        <div className='h-full flex flex-col'>
            <QuizActionsBar onPublish={handlePublish} />

            <PanelGroup
                direction="horizontal"
                style={{ flex: 1, overflow: 'hidden' }} // Sử dụng flex để lấp đầy chiều cao còn lại
            >
                {/* Truyền tên file vào viewer nếu cần */}
                <SourceDocumentViewer documentContent={sampleDocumentContent} />

                <PanelResizeHandle
                    style={{ width: '4px', background: '#f0f0f0', cursor: 'col-resize' }}
                />

                {/* Chỉnh lại size để tổng không vượt quá 100% (35 + 65 = 100) */}
                <Panel defaultSize={65} minSize={30}>
                    <Card
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
                    >
                        <Tabs
                            defaultActiveKey="mcq"
                            items={tabItems}
                            type="card"
                        />
                    </Card>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default QuizCreationPage;