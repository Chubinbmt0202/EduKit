// StudentMatchQuiz.tsx
import './StudentQuizPage.css';
import { Flex, Progress } from 'antd';
// Giả định có các icon X, Heart, Sound Wave

const quizData = [
    { id: 1, type: 'audio', isActive: false },
    { id: 2, type: 'audio', isActive: false },
    { id: 3, type: 'audio', isActive: false },
    { id: 4, type: 'audio', isActive: false },
    { id: 5, type: 'text', content: 'dạ dày', isActive: false },
    { id: 6, type: 'text', content: 'điều gì', isActive: false },
    { id: 7, type: 'text', content: 'đâu', isActive: false },
    { id: 8, type: 'text', content: 'ngủ', isActive: false },
];

const StudentMatchQuiz = () => {
    // Logic quản lý trạng thái chọn thẻ (isActive) sẽ nằm ở đây

    return (
        <div className="quiz-page-container">
            {/* 1. Header Cố định */}
            <header className="h-[60px] w-full quiz-header">
                <div className="header-top-row">
                    <button className="close-btn">
                        &times; {/* Hoặc dùng icon X */}
                    </button>
                    <Flex gap="small" vertical>
                        <Progress percent={30} />
                    </Flex>
                </div>
            </header>

            {/* 2. Body Nội dung chính */}
            <main className="quiz-main-content">
                <div className="matching-grid">
                    {/* Cột Trái: Audio Cards (1, 2, 3, 4) */}
                    <div className="card-column audio-column">
                        {quizData.filter(item => item.type === 'audio').map(item => (
                            <button key={item.id} className={`match-card ${item.isActive ? 'active' : ''}`}>
                                <span className="card-id">{item.id}</span>
                                <span className="sound-icon">
                                    <span className="wave-icon"></span>
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Cột Phải: Text Cards (5, 6, 7, 8) */}
                    <div className="card-column text-column">
                        {quizData.filter(item => item.type === 'text').map(item => (
                            <button key={item.id} className={`match-card ${item.isActive ? 'active' : ''}`}>
                                <span className="card-id">{item.id}</span>
                                <span className="card-content">{item.content}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* 3. Footer Cố định */}
            <footer className="quiz-footer">
                <button className="aux-button">HIỆN KHÔNG NGHE ĐƯỢC</button>
                <button className="main-button disabled">KIỂM TRA</button>
            </footer>
        </div>
    );
};

export default StudentMatchQuiz;