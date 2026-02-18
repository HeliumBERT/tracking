export type PrivilegeLevel = 'ADMIN' | 'BASIC'

const privilegeLevels: Record<PrivilegeLevel, number> = {
    ADMIN: 99,
    BASIC: 1
};

export function privilegeToNumber(level: PrivilegeLevel) {
    return privilegeLevels[level];
}

export function checkMinPrivilege(testPrivilege: PrivilegeLevel, minPrivilege: PrivilegeLevel): boolean {
    const testPrivilegeValue = privilegeLevels[testPrivilege];
    const minPrivilegeValue = privilegeLevels[minPrivilege];

    return testPrivilegeValue >= minPrivilegeValue;
}

export function getCanSeeSoftDeleted(userPrivilege: PrivilegeLevel) {
    return checkMinPrivilege(userPrivilege, "ADMIN");
}

export function canUpdateOtherUserPrivilege(yourPrivilege: PrivilegeLevel, otherPrivilege: PrivilegeLevel) {
    return privilegeToNumber(yourPrivilege) > privilegeToNumber(otherPrivilege);
}

export function isPrivilegeSettableToOther(yourPrivilege: PrivilegeLevel, privilegeToSet: PrivilegeLevel) {
    return privilegeToNumber(privilegeToSet) <= privilegeToNumber(yourPrivilege);
}

export function isPrivilegeSettableToSelf(yourPrivilege: PrivilegeLevel, privilegeToSet: PrivilegeLevel) {
    return privilegeToNumber(privilegeToSet) <= privilegeToNumber(yourPrivilege);
}

export function canManageOtherUser(yourPrivilege: PrivilegeLevel, otherPrivilege: PrivilegeLevel) {
    return privilegeToNumber(yourPrivilege) > privilegeToNumber(otherPrivilege);
}