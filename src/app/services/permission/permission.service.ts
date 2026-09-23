import { Injectable } from "@angular/core";
import { ModulePermission } from "../../interfaces/module-permission";
import { UserPermission } from "../../interfaces/user-permission";
import { LocalStorageService } from "../local-storage/local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    constructor(
        private localStorageService: LocalStorageService
    ) { }

    getModulePermission(moduleName: string): ModulePermission {
        const permissions = this.localStorageService.getUserPermission() ?? [];

        const permission = permissions.find(
            x => x.moduleName?.toLowerCase() === moduleName?.toLowerCase()
        );

        return {
            view: permission?.view ?? false,
            add: permission?.add ?? false,
            edit: permission?.edit ?? false,
            delete: permission?.delete ?? false,
            download: permission?.download ?? false,
            upload: permission?.upload ?? false,
            approve: permission?.approve ?? false,
            reject: permission?.reject ?? false
        };
    }

    hasPermission(
        moduleName: string,
        permission: keyof ModulePermission
    ): boolean {

        return this.getModulePermission(moduleName)[permission];
    }
}