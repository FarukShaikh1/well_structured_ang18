export interface RoleModuleMapping {
    rolePageMappingId: number;
    roleID: string;
    pageId: number;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    download: boolean;
    upload: boolean;
    description: string;
    moduleName: string;
}