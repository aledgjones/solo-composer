import isemail from 'isemail';

export function isEmail(email: string) {
    return isemail.validate(email);
}