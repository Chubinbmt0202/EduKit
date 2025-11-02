// src/utils/validators.ts
import { VALIDATION_RULES } from '../constants';

export const validateEmail = (email: string): boolean => {
    return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): boolean => {
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
        return false;
    }
    return VALIDATION_RULES.PASSWORD_REGEX.test(password);
};

export const validateUsername = (username: string): boolean => {
    return (
        username.length >= VALIDATION_RULES.USERNAME_MIN_LENGTH &&
        username.length <= VALIDATION_RULES.USERNAME_MAX_LENGTH
    );
};