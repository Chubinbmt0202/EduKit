// File: src/pages/Home.tsx (Đã sửa đổi)

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
// import { message } from 'antd'; // Chỉ cần giữ lại các imports cần thiết
import ProcessingModal from '../components/features/lectures/ProcessingModal';
import InsufficientFundsModal from '../components/features/lectures/InsufficientFundsModal';
import LoginNotiModal from '../components/features/lectures/LoginNotiModal';
import { useAuth } from '../context/AuthContext';
// 🆕 Import component con mới
import QuizCreationForm from '../components/QuizCreationForm';

const Home: React.FC = () => {
    // 💡 Giữ lại state quản lý Modal và Auth context
    const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
    const [isFundsModalVisible, setIsFundsModalVisible] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    // 🆕 State cho trạng thái và dữ liệu Quiz
    const [isProcessError, setIsProcessError] = useState(false);
    const [isProcessSuccess, setIsProcessSuccess] = useState(false); // Có thể không cần nếu dùng isError
    const [generatedQuizId, setGeneratedQuizId] = useState<string | undefined>(undefined);
    const { user, credits, updateCredits } = useAuth();

    // Hàm xử lý modal
    const handleCloseProcessModal = () => setIsProcessModalVisible(false);
    const handleCloseFundsModal = () => setIsFundsModalVisible(false);
    const handleTopUp = () => {
        setIsFundsModalVisible(false);
        // Chuyển hướng đến trang nạp tiền
        console.log('Navigate to Top-Up Page');
    };

    return (
        <div className="p-4 md:p-6">
            {/* ⭐ SỬ DỤNG COMPONENT CON VÀ TRUYỀN PROPS ⭐ */}
            <QuizCreationForm
                user={user}
                credits={credits}
                updateCredits={updateCredits}
                setIsFundsModalVisible={setIsFundsModalVisible}
                setIsLoginModalVisible={setIsLoginModalVisible}

                setIsProcessModalVisible={setIsProcessModalVisible}
                setIsProcessError={setIsProcessError}
                setIsProcessSuccess={setIsProcessSuccess}
                setGeneratedQuizId={setGeneratedQuizId}
            />

            {/* Giữ lại các Modals */}
            <ProcessingModal isVisible={isProcessModalVisible}
                onClose={handleCloseProcessModal}
                hasError={isProcessError}
                quizId={generatedQuizId} />
            <InsufficientFundsModal isVisible={isFundsModalVisible} onClose={handleCloseFundsModal} onNavigateToTopUp={handleTopUp} />
            <LoginNotiModal isVisible={isLoginModalVisible} onClose={() => setIsLoginModalVisible(false)} onNavigateToTopUp={() => { }} />
        </div>
    );
};

export default Home;