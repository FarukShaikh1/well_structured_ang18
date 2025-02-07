import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/api-url';
import { HttpService } from '../rest/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {


  constructor(private httpService: HttpService) { }
  getAllRoles(): Observable<any> {
    return this.httpService.get(API_URL.GET_ALL_ROLES);
  }

  getModulesMappedToLoggedinUser(): Observable<any> {
    return this.httpService.get(API_URL.GET_MODULE_MAPPED_TO_LOGGEDIN_USER);
  }

  getRoleModuleMappingByRoleId(roleId: string): Observable<any> {
    return this.httpService.get(API_URL.GET_ROLE_MODULE_MAPPING_BY_ROLE_ID + roleId);
  }

  updateRoleModuleMapping(data: any): Observable<any> {
    return this.httpService.post(API_URL.UPDATE_ROLE_MODULE_MAPPING, data);
  }

}
