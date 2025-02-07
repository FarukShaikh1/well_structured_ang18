import { Component, booleanAttribute, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global/global.service'
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [
    ReactiveFormsModule, // Add this
    // other imports
  ],
    templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  profileForm: FormGroup;
  userDetails: any;
  userNameCheckboxValue:any;
  readonly:Boolean = false;

  userList: any;// {id:number,userName:string,password:string};
  constructor(private fb: FormBuilder, private router: Router, private userService: UserServiceService, 
    private http: HttpClient,private _globalService:GlobalService) {
          this.profileForm = this.fb.group(
      {
        username: '',
        password: '',
        emailAddress: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        mobileNumber2: '',
        roleName: '',
        userNameCheckbox: ''
      }
    )
  }

  ngOnInit(){
    this.userService.getLoggedInUserDetails().subscribe(
      (res) => {
        this.userDetails = res;
        this.patchValues(this.userDetails[0]);
  
     })
  }

  
  onCheckboxChange() {
  if(this.profileForm.controls["userNameCheckbox"].value){
    this.profileForm.controls["username"].patchValue(this.profileForm.controls["emailAddress"].value)
    this.readonly = true;
    }
    else
    this.readonly = true;

  } 
  updateProfile() {
    if(this.profileForm.value["username"]!=null && this.profileForm.value["username"].length<=0)
    {
      // ////this._globalService.openSnackBar("Username should not be blank")
      return;
    }
    if(this.profileForm.value["emailAddress"]!=null && this.profileForm.value["emailAddress"].length<=0)
    {
      // ////this._globalService.openSnackBar("emailAddress should not be blank")
      return;
    }
    if(this.profileForm.value["firstName"]!=null && this.profileForm.value["firstName"].length<=0)
    {
      ////this._globalService.openSnackBar("firstName should not be blank")
      return;
    }
    if(this.profileForm.value["mobileNumber"]!=null && this.profileForm.value["mobileNumber"].length<=0)
    {
      ////this._globalService.openSnackBar("mobileNumber should not be blank")
      return;
    }
    if(this.profileForm.value["roleName"]!=null && this.profileForm.value["roleName"].length<=0)
    {
      ////this._globalService.openSnackBar("roleName should not be blank")
      return;
    }
    if(this.profileForm.value["password"]!=null && this.profileForm.value["password"].length<=0)
    {
      ////this._globalService.openSnackBar("Please enter password to confirm your identity")
      return;
    }
    this.userService.updateUserDetails(this.profileForm.value).subscribe((result) => {
      if (result) {
        ////this._globalService.openSnackBar('Record Updated Successfully');
        // 
      }
      else {
        ////this._globalService.openSnackBar('some issue is in update the data');
        return;
      }
    });
  }

  patchValues(res: any) {
    if (res != undefined) {
      console.log(res);
      console.log("UserId : ",res.UserId);
      console.log("UserId : ", res.UserId);
      console.log("UserName : ", res.UserName);
      console.log("EmailAddress : ", res.EmailAddress);
      console.log("FirstName : ",res.FirstName);
      console.log("LastName : ", res.LastName);
      console.log("MobileNumber : ", res.MobileNumber);
      console.log("MobileNumber1 : ", res.MobileNumber1);
      console.log("RoleName : ",res.RoleName);
      this.profileForm.controls['username'].patchValue(res.UserName);
      this.profileForm.controls['emailAddress'].patchValue(res.EmailAddress);
      this.profileForm.controls['firstName'].patchValue(res.FirstName);
      this.profileForm.controls['lastName'].patchValue(res.LastName);
      this.profileForm.controls['mobileNumber'].patchValue(res.MobileNumber);
      this.profileForm.controls['mobileNumber2'].patchValue(res.MobileNumber2);
      this.profileForm.controls['roleName'].patchValue(res.RoleName);
      }
        // reload() {
  //   this._globalService.reloadComponent();
  // }
    }
} 
