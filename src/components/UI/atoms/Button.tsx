import React from 'react';

// Định nghĩa các loại Button có thể có
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'uiverse'; // Thêm 'uiverse'
export type ButtonSize = 'small' | 'medium' | 'large';

// Định nghĩa Props cho Component Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Nội dung hiển thị trên nút */
    children: React.ReactNode;
    /** Loại nút, quyết định màu sắc và phong cách */
    variant?: ButtonVariant;
    /** Kích thước nút */
    size?: ButtonSize;
    /** Trạng thái vô hiệu hóa (disabled) */
    disabled?: boolean;
    /** Các class Tailwind CSS bổ sung */
    className?: string;
}

// Hàm ánh xạ Variant sang Tailwind CSS classes
const getVariantClasses = (variant: ButtonVariant): string => {
    switch (variant) {
        case 'primary':
            return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
        case 'secondary':
            return 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 focus:ring-gray-400';
        case 'danger':
            return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
        case 'success':
            return 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500';
        case 'uiverse':
            // Màu nền: #6c5ce7, Màu bóng: #a29bfe. Shadow được định nghĩa bằng giá trị tùy chỉnh.
            return 'bg-[#6c5ce7] text-white shadow-[0px_5px_0px_0px_#a29bfe] transition-all ease-in duration-100 hover:bg-[#7b6ee9]';
        default:
            return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
    }
};

// Hàm ánh xạ Size sang Tailwind CSS classes
const getSizeClasses = (size: ButtonSize): string => {
    switch (size) {
        case 'small':
            return 'px-3 py-1.5 text-sm';
        case 'medium':
            return 'px-5 py-2 text-sm';
        case 'large':
            return 'px-8 py-3 text-lg';
        default:
            return 'px-5 py-2 text-sm';
    }
};

/**
 * Component Button tái sử dụng với Tailwind CSS.
 * Hỗ trợ các thuộc tính variant, size, disabled, và các props HTML button tiêu chuẩn.
 */
const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    className = '',
    ...rest // Thu thập tất cả các thuộc tính HTML button khác (onClick, type,...)
}) => {

    // Các lớp CSS cơ bản áp dụng cho mọi nút
    const baseClasses = 'font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

    // Lớp cho trạng thái disabled
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    // Kết hợp tất cả các lớp
    const finalClasses = [
        baseClasses,
        getVariantClasses(variant),
        getSizeClasses(size),
        disabledClasses,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={finalClasses}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
