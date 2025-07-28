export interface UserPermission {
    id: number;
    moduleId: string;
    moduleName: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    download: boolean;
    upload: boolean;
}