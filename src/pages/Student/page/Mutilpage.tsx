import React from 'react';
import '../component/footerQuiz.css'; // Import CSS tùy chỉnh nếu cần

const MultiPage: React.FC = () => {
    return (
        // 🎯 Điều chỉnh container chính: Bỏ absolute, w-[80%], mx-[5rem] nếu nó gây vấn đề căn giữa.
        // Giữ nguyên w-full để nó chiếm hết chiều ngang của Ant Design TabPane.
        <div className="w-full mx-auto ml-[10%] h-[100%] p-4 text-center">

            {/* Phần Câu hỏi */}
            <div className='w-[60%] mx-auto p-4'>
                <h1 className="text-4xl font-bold text-red-700">Đây là một câu  mẫu?ây là một câu  mẫu?ây là một câu  mẫu? ây là một câu  mẫu?</h1>
            </div>

            {/* --- PHẦN ĐÁP ÁN: SỬ DỤNG GRID --- */}
            <div className="mt-[2%] p-6">

                {/* 🎯 Container cha: Dùng Grid với 2 cột 🎯 */}
                {/* gap-4: khoảng cách giữa các ô/đáp án */}
                <div className="grid grid-cols-2 gap-4 w-[60%]  mx-auto">

                    {/* Đáp án 1: Cột 1, Hàng 1 */}
                    <button className="button !h-[100px] !text-[1.5rem]">
                        A. Đáp án thứ nhất
                    </button>

                    {/* Đáp án 2: Cột 2, Hàng 1 */}
                    <button className="button !h-[100px] !text-[1.5rem]">
                        B. Đáp án thứ hai
                    </button>

                    {/* Đáp án 3: Cột 1, Hàng 2 */}
                    <button className="button !h-[100px] !text-[1.5rem]">
                        C. Đáp án thứ ba
                    </button>

                    {/* Đáp án 4: Cột 2, Hàng 2 */}
                    <button className="button !h-[100px] !text-[1.5rem]">
                        D. Đáp án thứ tư
                    </button>

                </div>
            </div>
        </div>
    );
};

export default MultiPage;