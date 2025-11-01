import React from 'react';
import '../component/footerQuiz.css'; // Import CSS tùy chỉnh nếu cần

const FillPage: React.FC = () => {
    return (
        <div className="w-full mx-auto ml-[10%] h-[100%] p-4 ">
            <div className='w-[60%] mx-auto p-4'>
                <h1 className="text-2xl font-bold text-red-700">Điền từ còn thiếu</h1>
            </div>
            <div className='w-[60%] mx-auto p-4'>
                <h1 className="text-4xl font-bold text-red-700">They are running in the_____now.</h1>
            </div>
        </div>
    );
};

export default FillPage;