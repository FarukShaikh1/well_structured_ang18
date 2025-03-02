import { Component, booleanAttribute, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global/global.service'
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ApplicationConstants, NavigationURLs } from '../../../utils/application-constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, // Add this
    // other imports
  ], templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  ngOninit() {
    if(this.localStorageService.isAuthenticated()){
    this.router.navigate([NavigationURLs.HOME]);
    }
    else{
      localStorage.clear();
      this.router.navigate([NavigationURLs.UNAUTHORIZED_PAGE]);  
    }
    //this._globalService.openSnackBar("Login ngOnInit : currentUser=false")

  }
  loginForm: FormGroup;

  userList: any;// {id:number,email:string,password:string};
  constructor(private fb: FormBuilder, private router: Router, private userService: UserServiceService,
    private http: HttpClient, private _globalService: GlobalService, private localStorageService: LocalStorageService ) {
    localStorage.setItem("currentUser", "false")
    this.loginForm = this.fb.group(
      {
        email: '',
        password: '',
      }
    )
  }
  parameters = '';

  data: any;
  submitLogin() {
    if (this.loginForm.value["email"] != null && this.loginForm.value["email"].length <= 0) {
      //this._globalService.openSnackBar("email should not be blank")
      return;
    }
    if (this.loginForm.value["password"].length <= 0) {
      //this._globalService.openSnackBar("Password should not be blank")
      return;
    }
    this.userService.getUser(this.loginForm.value).subscribe(res => {
      if (res) {
        this.data = res;
        if (this.data.length <= 0) {
          //this._globalService.openSnackBar("Invalid credentials, Please check the details correctly.");
          // localStorage.setItem("currentUser", "false");
          // localStorage.setItem("email","")
          // localStorage.setItem("userId","")
          localStorage.clear();
          return;
        }

        if (this.data[0] != null && this.data[0].emailAddr != null && this.data[0].emailAddr.length > 0) {

          localStorage.setItem("user", JSON.stringify(this.data[0])); // Convert object to string
          localStorage.setItem("currentUser", "true")
          localStorage.setItem("email", this.data[0].emailAddr)
          localStorage.setItem("userId", this.data[0].userId)
          //this._globalService.openSnackBar("Log in successfully")
          this.reload();
          if (this.data[0].RoleName == 'super admin')
            this.router.navigate(["/home/manage-users/"]);//, this.data[0].UserId]);
          else
            this.router.navigate(["/home/day/"]);//, this.data[0].UserId]);
        }
      }
      else {
        // this.toaster("Invalid credentials, Please check the details correctly.");
      }
    });
  }
  reload() {
    this._globalService.reloadComponent();
  }

} 
