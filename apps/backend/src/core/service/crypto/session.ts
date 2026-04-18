import crypto from "crypto";
import { z } from "zod";
import { compareUint8array } from "./uint8array.js";

// thanks lucia <3 https://lucia-auth.com/sessions/basic

function generateSecureRandomString(): string {
	// Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
	const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

	// Generate 24 bytes = 192 bits of entropy.
	// We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = "";
	for (let i = 0; i < bytes.length; i++) {
		// >> 3 "removes" the right-most 3 bits of the byte
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

async function hashSessionSecret(secret: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
	return new Uint8Array(secretHashBuffer);
}


export async function createSessionSecret() {
    const secret = generateSecureRandomString();
    const secretHash = await hashSessionSecret(secret);
    return { secret, secretHash };
}

export async function createSessionId() {
    return generateSecureRandomString();
}


export type SessionTokenString = `${string}.${string}`;
export async function createSessionToken(id: string, secret: string): Promise<SessionTokenString> {
    return `${id}.${secret}`;
}

export interface SessionToken {
	id: string;
	secret: string;
}
export const sessionTokenSchema = z.string().regex(
	/[^.]+\.[^.]+/,
	"Session tokens should take the form of ID.SECRET"
);
export function destructureSessionToken(token: string): SessionToken {
	const parsedToken = sessionTokenSchema.parse(token);

	const parts = parsedToken.split(".");
    const sessionId = parts[0];
    const sessionSecret = parts[1];

	return {
		id: sessionId,
		secret: sessionSecret
	};
}

export interface SessionSecurity {
    id: string;
    secret: string;
    secretHash: Uint8Array;
    token: SessionTokenString;
}
export async function createSession(): Promise<SessionSecurity> {
    const { secret, secretHash } = await createSessionSecret();
    const id = await createSessionId();
    const token = await createSessionToken(id, secret);
    return { id, secret, secretHash, token };
}

export async function compareSessionSecret(inputSecret: string, compareSecretHash: Uint8Array) {
	const inputSecretHash = await hashSessionSecret(inputSecret);
	return compareUint8array(inputSecretHash, compareSecretHash);
}