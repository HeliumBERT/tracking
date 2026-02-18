import * as argon2 from 'argon2';

const type = argon2.argon2id;

export async function hashPassword(password: string) {
    return await argon2.hash(password, { type });
}

export async function comparePassword(inputPassword: string, comparePasswordHash: string) {
    return await argon2.verify(comparePasswordHash, inputPassword);
}