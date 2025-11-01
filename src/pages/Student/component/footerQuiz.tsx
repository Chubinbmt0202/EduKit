import { Button } from 'antd'; // Sử dụng component Button của Ant Design
import './footerQuiz.css'; // Import CSS tùy chỉnh nếu cần

const FooterQuiz = () => {
    return (
        // Container chính: cố định ở dưới cùng, toàn màn hình, z-index cao
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg border-t border-gray-200">

            {/* Nội dung Footer: Sử dụng Flexbox để căn chỉnh các nút */}
            <div className="flex items-center w-[60%] justify-between h-35 px-4 sm:px-6 mx-auto">

                {/* 1. Nút Bỏ qua (Bên Trái) */}
                <Button
                    className="button w-1/7 !h-[40%]"
                >
                    Gợi ý
                </Button>

                {/* 2. Nút Kiểm tra (Bên Phải) */}
                <Button
                    className={`button bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 w-1/5 !h-[40%]`}
                >
                    Kiểm tra
                </Button>
            </div>

        </div>
    );
};

export default FooterQuiz;