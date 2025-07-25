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
    private http: HttpClient,public globalService:GlobalService) {
          this.profileForm = this.fb.group(
      {
        userName: '',
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
    this.profileForm.controls["userName"].patchValue(this.profileForm.controls["emailAddress"].value)
    this.readonly = true;
    }
    else
    this.readonly = true;

  } 
  updateProfile() {
    if(this.profileForm.value["userName"]!=null && this.profileForm.value["userName"].length<=0)
    {
      // ////this.globalService.openSnackBar("userName should not be blank")
      return;
    }
    if(this.profileForm.value["emailAddress"]!=null && this.profileForm.value["emailAddress"].length<=0)
    {
      // ////this.globalService.openSnackBar("emailAddress should not be blank")
      return;
    }
    if(this.profileForm.value["firstName"]!=null && this.profileForm.value["firstName"].length<=0)
    {
      ////this.globalService.openSnackBar("firstName should not be blank")
      return;
    }
    if(this.profileForm.value["mobileNumber"]!=null && this.profileForm.value["mobileNumber"].length<=0)
    {
      ////this.globalService.openSnackBar("mobileNumber should not be blank")
      return;
    }
    if(this.profileForm.value["roleName"]!=null && this.profileForm.value["roleName"].length<=0)
    {
      ////this.globalService.openSnackBar("roleName should not be blank")
      return;
    }
    if(this.profileForm.value["password"]!=null && this.profileForm.value["password"].length<=0)
    {
      ////this.globalService.openSnackBar("Please enter password to confirm your identity")
      return;
    }
    this.userService.updateUserDetails(this.profileForm.value).subscribe((result) => {
      if (result) {
        ////this.globalService.openSnackBar('Record Updated Successfully');
        // 
      }
      else {
        ////this.globalService.openSnackBar('some issue is in update the data');
        return;
      }
    });
  }

  patchValues(res: any) {
    if (res != undefined) {
      console.log(res);
      console.log("UserId : ",res.UserId);
      console.log("UserId : ", res.UserId);
      console.log("userName : ", res.userName);
      console.log("EmailAddress : ", res.EmailAddress);
      console.log("FirstName : ",res.FirstName);
      console.log("LastName : ", res.LastName);
      console.log("MobileNumber : ", res.MobileNumber);
      console.log("MobileNumber1 : ", res.MobileNumber1);
      console.log("roleName : ",res.roleName);
      this.profileForm.controls['userName'].patchValue(res.userName);
      this.profileForm.controls['emailAddress'].patchValue(res.EmailAddress);
      this.profileForm.controls['firstName'].patchValue(res.FirstName);
      this.profileForm.controls['lastName'].patchValue(res.LastName);
      this.profileForm.controls['mobileNumber'].patchValue(res.MobileNumber);
      this.profileForm.controls['mobileNumber2'].patchValue(res.MobileNumber2);
      this.profileForm.controls['roleName'].patchValue(res.roleName);
      }
        // reload() {
  //   this.globalService.reloadComponent();
  // }
    }
} 
