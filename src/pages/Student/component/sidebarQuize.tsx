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


// Component/Hàm đơn giản để hiển thị nội dung theo loại câu hỏi
const QuestionContent: React.FC<{ type: string, index: number }> = ({ type, index }) => {
    // Dữ liệu nội dung mẫu tùy thuộc vào loại câu hỏi
    switch (type) {
        case 'Trắc nghiệm':
            return (
                <MultiPage />
            );
        case 'Tự luận':
            return (
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-green-600">Câu hỏi {index} - Tự luận</h3>
                    <p className="mt-2 text-gray-700">Bạn hãy viết câu trả lời chi tiết không quá 500 từ.</p>
                    {/* Ở đây bạn sẽ render component Textarea hoặc Editor */}
                </div>
            );
        case 'Đúng/Sai':
            return (
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-red-600">Câu hỏi {index} - Đúng/Sai</h3>
                    <p className="mt-2 text-gray-700">Chọn Đúng hoặc Sai cho câu phát biểu này.</p>
                    {/* Ở đây bạn sẽ render các nút Đúng/Sai */}
                </div>
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
    { type: 'Tự luận', icon: <FormOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Đúng/Sai', icon: <SafetyOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Điền khuyết', icon: <BorderOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Sắp xếp', icon: <BarsOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Sắp xếp', icon: <BarsOutlined style={{ fontSize: '18px' }} /> },
    { type: 'Sắp xếp', icon: <BarsOutlined style={{ fontSize: '18px' }} /> },

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