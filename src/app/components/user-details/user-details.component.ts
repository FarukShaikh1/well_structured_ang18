import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild
} from '@angular/core';
import * as forms from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationConstants,
  ApplicationModules,
  Messages
} from '../../../utils/application-constants';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/user/user.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, forms.ReactiveFormsModule, ToasterComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild('btnCloseUserPopup') btnCloseUserPopup!: ElementRef;
  @Input() tableData: Record<string, unknown>[] | undefined;
  userForm!: FormGroup;
  roleList: any;
  roleListoriginal: any;
  Messages = Messages;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public globalService: GlobalService,
    private roleService: RoleService,
    private loaderService: LoaderService,
    private renderer: Renderer2
  ) {
    this.userForm = this.fb.group({
      id: [''],
      userName: ['', [Validators.required, Validators.pattern(/^(?!\s+$).+/),],],
      firstName: ['', [Validators.pattern(/^(?!\s+$).+/)]],
      lastName: ['', [Validators.pattern(/^(?!\s+$).+/),],],
      mobileNumber: ['', [Validators.pattern(/^(?!\s+$).+/),],],
      emailAddress: ['', [Validators.required, Validators.pattern(ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_USERNAME),],],
      isLocked: [false, [Validators.required]],
      roleId: ['', [Validators.required]],
    });
  }


  isGuid(value: string) {
    const guidPattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(value);
  }

  openUserDetailsPopup(id: string) {
    this.getRoleList();
    this.getUserDetailsById(id);

    const model = document.getElementById('detailsPopup');
    if (model !== null) {
      model.style.display = 'block';
    }
  }

  closePopup() {
    this.resetForm();
    const model = document.getElementById('detailsPopup');
    if (model !== null) {
      model.style.display = 'none';
    }
  }

  resetForm(): void {
    this.userForm?.reset();
  }

  trimAllFields() {
    // Trim whitespace from all form control values
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  onSubmit() {
    this.trimAllFields();
    if (this.userForm.invalid) {
      return;
    }
    this.loaderService.showLoader();

    const formValue = this.userForm.value;
    const payload = { ...formValue };



    this.userService.updateUser(payload).subscribe(this.handleApiResponse());
  }

  handleApiResponse() {
    return {
      next: (result: any) => {
        if (result.success) {
          this.toaster.showMessage(result?.message, 'success', 8000);
          this.renderer
            .selectRootElement(this.btnCloseUserPopup?.nativeElement)
            .click();
          // this.closePopup();
          this.loaderService.hideLoader();
          this.globalService.triggerGridReload(ApplicationModules.USER);
        } else {
          this.toaster.showMessage(result?.message, 'error', 8000);
          this.loaderService.hideLoader();
        }
      },
      error: (error: any) => {
        this.toaster.showMessage(error?.message, 'error');
        this.loaderService.hideLoader();
      },
    };
  }

  getUserDetailsById(id: string) {
    this.userService.getUserDetailsById(id).subscribe({
      next: (result: any) => {
        this.loaderService.showLoader();
        this.userForm.patchValue({
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          userName: result.userName,
          emailAddress: result.emailAddress,
          passwordLastChangeOn: result.passwordLastChangeOn,
          roleId: result.roleId,
          isLocked: result.isDeleted,
        });
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        console.error('Error fetching user data:', error);
      },
    });
  }

  getRoleList() {
    this.roleService.getAllRoles().subscribe({
      next: (result: any) => {
        this.roleListoriginal = result;
        this.roleList = result;
      },
      error: (error: any) => {
        console.error(Messages.ERROR_IN_FETCHING_ROLES, error);
      },
    });
  }
}
