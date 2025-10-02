import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { DBConstants, LocalStorageConstants, NavigationURLs, OtpConfig, UserConfig } from "../../../utils/application-constants";
import { ConfigurationService } from "../../services/configuration/configuration.service";
import { GlobalService } from "../../services/global/global.service";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";
import { RoleService } from "../../services/role/role.service";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,

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

  userList: any;
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

      return;
    }
    if (this.loginForm.value["password"].length <= 0) {

      return;
    }
    this.userService.getUser(this.loginForm.value).subscribe((res: any) => {
      if (res) {
        this.data = res.data;
        if (!this.data) {
          localStorage.clear();
          return;
        }

        if (
          this.data != null &&
          this.data?.userName != null &&
          this.data?.userName?.length > 0
        ) {
          localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(this.data));
            localStorage.setItem(LocalStorageConstants.IS_LOGGED_IN,'false');
          if (this.data.isOtpRequired) {
            localStorage.setItem(
              LocalStorageConstants.OTP_EXPIRES_ON,
              (Date.now() + OtpConfig.OTP_EXPIRES_IN_MINUTES * 60 * 1000).toString()
            );
             this.router.navigate(["/otp-verification"])
          }
          else {
            localStorage.setItem(LocalStorageConstants.IS_LOGGED_IN,'true');
            localStorage.setItem(LocalStorageConstants.USERID, this.data.id);
            this.reload();
            if (this.data.roleName?.toLowerCase() === "super admin")
              this.router.navigate([
                "/home/manage-users/",
              ]);
            else this.router.navigate(["/home/day/"]);
            this.globalService.setValuesInLocalStorage();

          }
        } else {

        }
      }
    });
  }

  reload() {
    this.globalService.reloadComponent();
  }

}

