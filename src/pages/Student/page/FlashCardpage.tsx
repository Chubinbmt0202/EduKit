import React, { useState, useCallback } from 'react';

// Dữ liệu mẫu cho Flashcard
const flashcardData = [
    { id: 1, front: 'Thủ đô của Việt Nam là gì?', back: 'Hà Nội' },
    { id: 2, front: 'Đất nước có Tháp Eiffel?', back: 'Pháp' },
    { id: 3, front: 'Quốc gia đông dân nhất thế giới (sau Ấn Độ)?', back: 'Trung Quốc' },
    { id: 4, front: 'Thủ đô của Nhật Bản?', back: 'Tokyo' },
];

// Component Thẻ Flashcard (đơn)
const Flashcard: React.FC<{ frontText: string; backText: string }> = ({ frontText, backText }) => {
    // State để theo dõi xem thẻ có bị lật hay không
    const [isFlipped, setIsFlipped] = useState(false);

    // Xử lý việc lật thẻ
    const handleFlip = () => {
        setIsFlipped(prev => !prev);
    };

    return (
        // Container chính cho thẻ. Dùng transform và transition để tạo hiệu ứng lật
        <div
            className="perspective-1000 w-full max-w-md h-80 mx-auto cursor-pointer"
            onClick={handleFlip}
        >
            <div
                className={`
                    relative w-full h-full text-center transition-transform duration-700 preserve-3d
                    ${isFlipped ? 'rotate-y-180' : ''}
                `}
            >
                {/* Mặt trước (Câu hỏi) */}
                <div
                    className="absolute w-full h-full backface-hidden bg-white border-4 border-blue-500 rounded-xl shadow-xl flex items-center justify-center p-6"
                >
                    <div className="text-2xl font-semibold text-gray-800">
                        {frontText}
                    </div>
                    <div className="absolute bottom-4 text-sm text-blue-500 font-medium">
                        (Nhấp để xem đáp án)
                    </div>
                </div>

                {/* Mặt sau (Câu trả lời) */}
                <div
                    className="absolute w-full h-full backface-hidden bg-blue-500 border-4 border-blue-700 rounded-xl shadow-xl flex items-center justify-center p-6 rotate-y-180"
                >
                    <div className="text-3xl font-bold text-white">
                        {backText}
                    </div>
                    <div className="absolute bottom-4 text-sm text-white opacity-80 font-medium">
                        (Nhấp để quay lại)
                    </div>
                </div>
            </div>
        </div>
    );
};


const FlashcardPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentCard = flashcardData[currentIndex];

    // Hàm chuyển sang thẻ tiếp theo
    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % flashcardData.length);
    }, []);

    // Hàm quay lại thẻ trước
    const handlePrev = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + flashcardData.length) % flashcardData.length);
    }, []);

    // NOTE: Cần reset isFlipped khi chuyển thẻ.
    // Trong môi trường thực tế, bạn nên dùng `key` trên Flashcard component để React tạo lại nó.
    // Để giữ cho code này đơn giản, chúng ta sẽ giả định người dùng chỉ lật thẻ khi cần.

    return (
        <div className="w-full h-full bg-gray-50 p-6 md:p-10 flex flex-col items-center">

            {/* Tiêu đề */}
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
                Flashcard: Quốc gia & Thủ đô
            </h1>

            {/* Component Flashcard */}
            <Flashcard
                // Sử dụng key để đảm bảo component Flashcard được reset khi chuyển sang thẻ mới
                key={currentCard.id}
                frontText={currentCard.front}
                backText={currentCard.back}
            />

            {/* Thanh điều khiển */}
            <div className="flex justify-between items-center w-full max-w-md mt-8">
                {/* Nút Quay lại */}
                <button
                    onClick={handlePrev}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
                >
                    <span className="text-xl mr-2">{'<'}</span> Quay lại
                </button>

                {/* Số thứ tự thẻ */}
                <div className="text-lg font-medium text-gray-600">
                    Thẻ {currentIndex + 1} / {flashcardData.length}
                </div>

                {/* Nút Tiếp theo */}
                <button
                    onClick={handleNext}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-150"
                >
                    Tiếp theo <span className="text-xl ml-2">{'>'}</span>
                </button>
            </div>
        </div>
    );
};

export default FlashcardPage;

// --- CSS Tailwind mở rộng cần thêm vào file CSS chính của bạn (ví dụ: index.css hoặc global.css) ---
/*
@layer utilities {
    .perspective-1000 {
        perspective: 1000px;
    }
    .preserve-3d {
        transform-style: preserve-3d;
    }
    .backface-hidden {
        backface-visibility: hidden;
    }
    .rotate-y-180 {
        transform: rotateY(180deg);
    }
}
*/