// utils/validationUtils.js

export const isEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isPhoneNumber = (phoneNumber:string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
};

export const isRequired = (value:string) => {
    return value !== null && value !== undefined && value.trim() !== '';
};
