// src/constants/messages.ts
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
    UNAUTHORIZED: 'Bạn không có quyền truy cập.',
    NOT_FOUND: 'Dữ liệu không tồn tại.',
    SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    INVALID_EMAIL: 'Email không hợp lệ.',
    PASSWORD_WEAK: 'Mật khẩu quá yếu.',
    REQUIRED_FIELD: 'Trường này không được để trống.',
    FORM_SUBMIT_ERROR: 'Lỗi gửi form. Vui lòng thử lại.',
} as const;

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
    UPDATE_SUCCESS: 'Cập nhật thành công!',
    DELETE_SUCCESS: 'Xóa thành công!',
    CREATE_SUCCESS: 'Tạo mới thành công!',
} as const;

export const INFO_MESSAGES = {
    LOADING: 'Đang tải dữ liệu...',
    NO_DATA: 'Không có dữ liệu để hiển thị.',
} as const;