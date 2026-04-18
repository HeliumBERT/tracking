import { encode, decode } from 'uint8-to-base64';

export function uint8arrayToDatabaseString(array: Uint8Array) {
    return encode(array);
}

export function databaseStringToUint8array(str: string) {
    return decode(str);
}

// Taken from https://lucia-auth.com/sessions/basic
// This is constant time!
export function compareUint8array(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}