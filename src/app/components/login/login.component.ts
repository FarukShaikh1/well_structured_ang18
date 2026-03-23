import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApplicationRoles, LocalStorageConstants, NavigationURLs, OtpConfig } from "../../../utils/application-constants";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";
import { RoleService } from "../../services/role/role.service";
import { UserService } from "../../services/user/user.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule, ToasterComponent

  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  accountList: any;
  occationTypeList: any;
  relationList: any;
  user: any;
  NavigationURLs = NavigationURLs;
  ngOninit() {
    this.reload();
    this.loaderService.hideLoader();
    if (this.localStorageService.isAuthenticated()) {
      this.router.navigate([NavigationURLs.HOME]);
    } else {
      localStorage.clear();
      this.router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
    }
  }
  loginForm: FormGroup;
  hideNewPassword: boolean = true;
  userList: any;
  isLoginClicked: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    public globalService: GlobalService,
    public roleService: RoleService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService
  ) {
    this.loginForm = this.fb.group({
      userName: "",
      password: "Faruk",
    });
  }
  parameters = "";

  data: any;

  submitLogin() {
    this.isLoginClicked = true;
    this.loaderService.showLoader('Checking details...');

    if (
      this.loginForm.value["userName"] != null &&
      this.loginForm.value["userName"].length <= 0
    ) {
      this.loaderService.hideLoader();
      this.isLoginClicked = false;
      return;
    }
    if (this.loginForm.value["password"].length <= 0) {
      this.loaderService.hideLoader();
      this.isLoginClicked = false;
      return;
    }
    this.userService.getUser(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoginClicked = false;
        if (res.success) {
          this.loaderService.showLoader('Please wait we are setting up some things for better performance...');
          this.data = res.data;
          if (!this.data) {
            localStorage.clear();
            this.loaderService.hideLoader();
            return;
          }
          if (
            this.data != null &&
            this.data?.userName != null &&
            this.data?.userName?.length > 0
          ) {
            localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(this.data));
            localStorage.setItem(LocalStorageConstants.IS_LOGGED_IN, 'false');
            if (this.data.isOtpRequired) {
              localStorage.setItem(
                LocalStorageConstants.OTP_EXPIRES_ON,
                (Date.now() + OtpConfig.OTP_EXPIRES_IN_MINUTES * 60 * 1000).toString()
              );
              this.loaderService.hideLoader();
              this.router.navigate([NavigationURLs.OTP_VERIFICATION]);
            }
            else {
              localStorage.setItem(LocalStorageConstants.USER, JSON.stringify(this.data));
              localStorage.setItem(LocalStorageConstants.IS_LOGGED_IN, 'true');
              this.loaderService.hideLoader();
              if (this.data.roleName?.toLowerCase() === ApplicationRoles.SUPER_ADMIN) {
                this.router.navigate([NavigationURLs.USER_LIST]);
              }
              else {
                this.router.navigate([NavigationURLs.DAY_LIST]);
              }
              // ✅ Defer heavy/non-blocking operations
              setTimeout(() => {
                this.globalService.setValuesInLocalStorage();
                this.globalService.setConfigValuesInLocalStorage();
                console.log('✅ Background localStorage setup done');
              }, 2000);
            }
          }
        } else {
          this.toaster.showMessage(res.message, res.success ? 'success' : 'error');
          this.loaderService.hideLoader();
        }
      },
      error: (err: any) => {
        this.isLoginClicked = false;
        this.loaderService.hideLoader();
      }
    });
  }

  reload() {
    this.globalService.reloadComponent();
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

}

