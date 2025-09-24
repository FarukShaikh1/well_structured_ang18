import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { DBConstants, LocalStorageConstants, NavigationURLs, UserConfig } from "../../../utils/application-constants";
import { ConfigurationService } from "../../services/configuration/configuration.service";
import { GlobalService } from "../../services/global/global.service";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";
import { RoleService } from "../../services/role/role.service";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule, // Add this
    // other imports
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  accountList: any;
  occationTypeList: any;
  relationList: any;
  user: any;
  ngOninit() {
    if (this.localStorageService.isAuthenticated()) {
      this.router.navigate([NavigationURLs.HOME]);
    } else {
      localStorage.clear();
      this.router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
    }
  }
  loginForm: FormGroup;

  userList: any; // {id:number,userName:string,password:string};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    public globalService: GlobalService,
    public roleService: RoleService,
    private configurationService: ConfigurationService,
    private localStorageService: LocalStorageService
  ) {
    this.loginForm = this.fb.group({
      userName: "farukshaikh908@gmail.com",
      password: "Faruk",
    });
  }
  parameters = "";

  data: any;
  submitLogin() {
    if (
      this.loginForm.value["userName"] != null &&
      this.loginForm.value["userName"].length <= 0
    ) {
      //this.globalService.openSnackBar("email should not be blank")
      return;
    }
    if (this.loginForm.value["password"].length <= 0) {
      //this.globalService.openSnackBar("Password should not be blank")
      return;
    }
    this.userService.getUser(this.loginForm.value).subscribe((res: any) => {
      if (res) {
        this.data = res.data;
        if (this.data.length <= 0) {
          localStorage.clear();
          return;
        }

        if (
          this.data != null &&
          this.data?.userName != null &&
          this.data?.userName?.length > 0
        ) {
          localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(this.data)); // Convert object to string


          //this.globalService.openSnackBar("Log in successfully")
          this.reload();
          if (this.data.roleName?.toLowerCase() === "super admin")
            this.router.navigate([
              "/home/manage-users/",
            ]); //, this.data.UserId]);
          else this.router.navigate(["/home/day/"]); //, this.data.UserId]);
          this.setValuesInLocalStorage();
        }
      } else {
        // this.toaster("Invalid credentials, Please check the details correctly.");
      }
    });
  }
  private setValuesInLocalStorage() {
    this.setConfigToLocalStorage(UserConfig.ACCOUNT);
    this.setConfigToLocalStorage(UserConfig.RELATION);
    this.setConfigToLocalStorage(UserConfig.OCCASION_TYPE);
    this.setCountryListToLocalStorage();
    this.setCommonListItemsToLocalStorage(DBConstants.COINTYPE, LocalStorageConstants.COIN_TYPE);
    this.setCommonListItemsToLocalStorage(DBConstants.MONTH, LocalStorageConstants.MONTH_LIST);
    this.setLoggedInUserPermissionsToLocalStorage();
  }

  reload() {
    this.globalService.reloadComponent();
  }

  setConfigToLocalStorage(config: string) {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.configurationService.getActiveConfigList(user.id, config).subscribe({
        next: (result: any) => {
          console.log('result : ', result);
          localStorage.setItem(config, result.data ? JSON.stringify(result.data) : '[]');
        },
        error: (error: any) => {
          console.error('Error fetching user list', error);
        },
      });
    }
  }

  setCountryListToLocalStorage() {
    this.globalService.getCountryList().subscribe({
      next: (result: any) => {
        console.log('result : ', result);
        this.localStorageService.setCountryList(result.data);
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
      },
    });
  }

  setCommonListItemsToLocalStorage(id: string, key: string) {
    this.globalService.getCommonListItems(id).subscribe({
      next: (result: any) => {
        console.log('result : ', result);
        this.localStorageService.setCommonListItems(key, result.data);
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
      },
    });
  }
  setLoggedInUserPermissionsToLocalStorage() {
    this.roleService.getLoggedInUserPermissions().subscribe({
      next: (result: any) => {
        console.log('result : ', result);
        this.localStorageService.setLoggedInUserPermissions(result.data);
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
      },
    });
  }
}
