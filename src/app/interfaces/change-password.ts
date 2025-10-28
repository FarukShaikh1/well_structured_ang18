export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
    userId?: string;
    modifiedBy?: string;
}