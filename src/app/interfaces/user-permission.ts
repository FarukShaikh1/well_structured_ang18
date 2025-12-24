export interface UserPermission {
    userId: string;
    moduleId: string;
    moduleName: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    download: boolean;
    upload: boolean;
    approve: boolean;
}