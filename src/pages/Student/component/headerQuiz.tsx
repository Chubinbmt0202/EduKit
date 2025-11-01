import React from 'react';
import { Progress } from "antd";
import { CloseOutlined } from '@ant-design/icons';

interface HeaderQuizProps {
    currentProgress?: number; // Ví dụ: 50
    quizTitle?: string; // Ví dụ: "Quiz về Lịch sử Việt Nam" - Hiện không dùng
    onClose?: () => void; // Hàm xử lý khi nhấn nút X
}

const HeaderQuiz: React.FC<HeaderQuizProps> = ({
    currentProgress = 50,
    onClose
}) => {
    return (
        // Container chính: cố định, toàn màn hình, z-index cao
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">

            {/* 🎯 Container chứa cả Icon X và Progress Bar trên 1 hàng 🎯 */}
            <div className="h-16 flex w-[60%] items-center justify-center px-4 sm:px-6 space-x-4 mx-auto">

                {/* 1. Nút Đóng/Thoát (Icon X) - Cố định kích thước */}
                <button
                    className="p-1 text-gray-500 hover:text-red-600 transition duration-150 flex-shrink-0" // flex-shrink-0 để nó không bị co lại
                    onClick={onClose}
                    aria-label="Thoát Quiz"
                >
                    <CloseOutlined style={{ fontSize: '16px' }} />
                </button>

                {/* 2. Thanh Tiến Trình (Progress Bar) - Chiếm phần không gian còn lại */}
                <div className="flex-grow"> {/* 👈 Sử dụng flex-grow */}
                    <Progress
                        percent={currentProgress}
                    />
                </div>

            </div>
        </div>
    );
};

export default HeaderQuiz;