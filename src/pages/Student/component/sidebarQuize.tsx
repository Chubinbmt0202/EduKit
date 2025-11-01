import React from 'react';
import { Tabs, Tooltip } from 'antd'; // 🎯 Import Tooltip 🎯
import {
    CheckCircleOutlined,
    FormOutlined,
    SafetyOutlined,
    BorderOutlined,
    BarsOutlined
} from '@ant-design/icons';
import './sidebarQuize.css';
import MultiPage from '../page/Mutilpage';
import TrueFalse from '../page/TrueFalsepage';
import FillPage from '../page/Fillpage';
import MatchingPage from '../page/Matchingpage';
import SortPage from '../page/Sortpage';
import FlashCardpage from '../page/FlashCardpage';

// Component/Hàm đơn giản để hiển thị nội dung theo loại câu hỏi
const QuestionContent: React.FC<{ type: string, index: number }> = ({ type }) => {
    // Dữ liệu nội dung mẫu tùy thuộc vào loại câu hỏi
    switch (type) {
        case 'Trắc nghiệm':
            return (
                <MultiPage />
            );
        case 'Điền từ còn thiếu':
            return (
                <FillPage />
            );
        case 'Đúng/Sai':
            return (
                <TrueFalse />
            );
        case 'Ghép nối':
            return (
                <MatchingPage />
            );
        case 'Phân loại':
            return (
                <SortPage />
            );
        case 'Thẻ ghi nhớ':
            return (
                <FlashCardpage />
            );
        default:
            return (
                <div className="p-6 text-gray-500">
                    <p>Nội dung đang được phát triển cho loại câu hỏi: {type}</p>
                </div>
            );
    }
};

// --- Dữ liệu và Kiểu dáng cần thiết ---

// Dữ liệu mẫu: Icon và Tên loại câu hỏi
const mockQuizItems = [
    { type: 'Trắc nghiệm', icon: <CheckCircleOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Điền từ còn thiếu', icon: <FormOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Đúng/Sai', icon: <SafetyOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Ghép nối', icon: <BorderOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Phân loại', icon: <BarsOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Thẻ ghi nhớ', icon: <BarsOutlined style={{ fontSize: '18px' }} /> },

];

// Hàm tạo nội dung label (hình tròn)
const getTabLabel = (icon: React.ReactNode, type: string) => {
    // Lớp cơ bản cho hình tròn (Màu xám mặc định)
    const baseClasses = 'p-3 flex items-center justify-center rounded-full text-sm font-semibold transition duration-200 shadow-md bg-gray-200 text-gray-700 hover:bg-gray-300';

    // 🎯 Bọc hình tròn trong Tooltip 🎯
    return (
        <Tooltip placement="right" title={type}> {/* Tooltip hiển thị tên loại câu hỏi */}
            <div className={baseClasses}>
                {icon}
            </div>
        </Tooltip>
    );
};

// --- Component SidebarQuiz ---

const SidebarQuiz: React.FC = () => {

    const initialActiveKey = '1';

    const handleTabChange = (key: string) => {
        console.log(`Chuyển đến tab ID: ${key}`);
    };

    return (
        // 1. Container chính: Cố định, ở lề trái, và căn giữa theo chiều dọc
        <div className="fixed left-0 top-[47%] w-[80%] mx-auto transform -translate-y-1/2 z-40 sm:p-4 hidden md:block">

            <Tabs
                className="quiz-sidebar-tabs"
                tabPosition={'left'}
                defaultActiveKey={initialActiveKey}
                onChange={handleTabChange}

                items={mockQuizItems.map((item, index) => {
                    const id = String(index + 1);
                    return {
                        // 🎯 Truyền cả Icon và Type vào getTabLabel 🎯
                        label: getTabLabel(item.icon, item.type),
                        key: id,
                        // Nội dung tab
                        children: (
                            <QuestionContent type={item.type} index={index + 1} />
                        ),
                        disabled: false,
                    };
                })}
            />

        </div>
    );
};

export default SidebarQuiz;