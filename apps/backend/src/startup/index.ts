import { ensureAdmin } from "./user.startup.js";



export async function startup() {
    await ensureAdmin();
}