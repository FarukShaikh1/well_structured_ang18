import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { NavigationURLs } from "../../../utils/application-constants";
import { GlobalService } from "../../services/global/global.service";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";
import { UserService } from "../../services/user/user.service";
import { ModuleResponse } from "../../interfaces/module-response";

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
  ngOninit() {
    if (this.localStorageService.isAuthenticated()) {
      this.router.navigate([NavigationURLs.HOME]);
    } else {
      localStorage.clear();
      this.router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);
    }
    //this.globalService.openSnackBar("Login ngOnInit : currentUser=false")
  }
  loginForm: FormGroup;

  userList: any; // {id:number,userName:string,password:string};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    public globalService: GlobalService,
    private localStorageService: LocalStorageService
  ) {
    localStorage.setItem("currentUser", "false");
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
    this.userService.getUser(this.loginForm.value).subscribe((res:any) => {
      if (res) {
        this.data = res;
        if (this.data.length <= 0) {
          //this.globalService.openSnackBar("Invalid credentials, Please check the details correctly.");
          // localStorage.setItem("currentUser", "false");
          // localStorage.setItem("userName","")
          // localStorage.setItem("userId","")
          localStorage.clear();
          return;
        }

        if (
          this.data != null &&
          this.data?.userName != null &&
          this.data?.userName?.length > 0
        ) {
          console.log('this.data : ', this.data);
          
          localStorage.setItem("user", JSON.stringify(this.data)); // Convert object to string
          localStorage.setItem("currentUser", "true");
          localStorage.setItem("userName", this.data.userName);
          localStorage.setItem("userId", this.data.id);
          localStorage.setItem("accessibleModuleIds", this.data.accessibleModuleIds);
          //this.globalService.openSnackBar("Log in successfully")
          this.reload();
          if (this.data.roleName?.toLowerCase() === "super admin")
            this.router.navigate([
              "/home/manage-users/",
            ]); //, this.data.UserId]);
          else this.router.navigate(["/home/day/"]); //, this.data.UserId]);
        }
      } else {
        // this.toaster("Invalid credentials, Please check the details correctly.");
      }
    });
  }
  reload() {
    this.globalService.reloadComponent();
  }
}
