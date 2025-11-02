// src/constants/validation.ts
export const VALIDATION_RULES = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 20,
} as const;

export const VALIDATION_MESSAGES = {
    REQUIRED: 'Không được để trống',
    INVALID_EMAIL: 'Email không hợp lệ',
    PASSWORD_TOO_SHORT: `Mật khẩu phải ít nhất ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ký tự`,
    PASSWORD_WEAK: 'Mật khẩu phải chứa chữ hoa, chữ thường và chữ số',
    USERNAME_SHORT: `Tên người dùng phải ít nhất ${VALIDATION_RULES.USERNAME_MIN_LENGTH} ký tự`,
    USERNAME_LONG: `Tên người dùng không quá ${VALIDATION_RULES.USERNAME_MAX_LENGTH} ký tự`,
} as const;