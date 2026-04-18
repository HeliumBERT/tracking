import { PrivilegeLevel } from "@prisma/client";
import { logger } from "@src/config/index.js";
import { hashPassword } from "@src/core/index.js";
import { userRepository } from "@src/repository/index.js";



export async function ensureAdmin() {
    const adminCount = await userRepository.countActiveAdmin();
    if (adminCount !== 0) return;

    logger.warn("No admin accounts found. Creating a new one...");

    const defaultPassword = "adminAdmin123#";
    const passwordHash = await hashPassword(defaultPassword);


    const result = await userRepository.create({
        username: "admin",
        email: "admin@gmail.com",
        passwordHash: passwordHash,
        privilege: PrivilegeLevel.ADMIN
    });

    logger.warn(
        `Created new admin account. Username: "${result.username}", Password: "${defaultPassword}"\n` + 
        "PLEASE CHANGE THE PASSWORD IMMEDIATELY."
    );
}