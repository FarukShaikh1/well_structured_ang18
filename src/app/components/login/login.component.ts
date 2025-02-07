import { Component, booleanAttribute, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global/global.service'
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [
    ReactiveFormsModule, // Add this
    // other imports
  ],  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  ngOninit() {
    //this._globalService.openSnackBar("Login ngOnInit : currentUser=false")
    localStorage.setItem("currentUser", "false")
    this.router.navigate(['/logout']);

  }
  loginForm: FormGroup;

  userList: any;// {id:number,userName:string,password:string};
  constructor(private fb: FormBuilder, private router: Router, private userService: UserServiceService,
    private http: HttpClient, private _globalService: GlobalService) {
    localStorage.setItem("currentUser", "false")
    this.loginForm = this.fb.group(
      {
        userId: -10000,
        personId: -10000,
        username: '',
        lastName: '',
        firstName: '',
        password: '',
        emailAddress: '',
        mobileNumber: '',
        emailAddr: '',
        isLocked: false,
        roleId: 0,
        returnErrorMsg: '',
        msg: '',
        passwordLastChangeDate: null,
        isActive: false,
        assetId: 0

      }
    )
  }
  parameters = '';

  data: any;
  submitLogin() {
    if (this.loginForm.value["username"] != null && this.loginForm.value["username"].length <= 0) {
      //this._globalService.openSnackBar("Username should not be blank")
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
          // localStorage.setItem("userName","")
          // localStorage.setItem("userId","")
          localStorage.clear();
          return;
        }

        if (this.data[0] != null && this.data[0].UserName != null && this.data[0].UserName.length > 0) {
          localStorage.setItem("currentUser", "true")
          localStorage.setItem("userName", this.data[0].UserName)
          localStorage.setItem("userId", this.data[0].UserId)
          //this._globalService.openSnackBar("Log in successfully")
          this.reload();
          if (this.data[0].RoleName == 'super admin')
            this.router.navigate(["/manage-users/"]);//, this.data[0].UserId]);
          else
            this.router.navigate(["/day/"]);//, this.data[0].UserId]);
        }
      }
      else {
        //this._globalService.openSnackBar("Invalid credentials, Please check the details correctly.");
      }
    });
  }
  reload() {
    this._globalService.reloadComponent();
  }

} 
