import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as forms from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/user/user.service';
import {
  Messages,
  ApplicationConstants,
  ApplicationModules,
  ApplicationRoles,
} from '../../../utils/application-constants';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, forms.ReactiveFormsModule, ToasterComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild('btnCloseUserPopup') btnCloseUserPopup!: ElementRef;
  @Input() tableData: Record<string, unknown>[] | undefined;
  isEditMode = false;
  userForm!: FormGroup;
  roleList: any;
  roleListoriginal: any;
  existingUserRole: string = '';
  enteredEmailId: string = '';
  modalTitle: string = '';
  isRoleDisabled: boolean = false;
  Messages = Messages;
  isClientRepresentativeSelected: boolean = false;
  emailAlreadyExists: boolean = false;
  ApplicationRoles = ApplicationRoles;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public globalService: GlobalService,
    private roleService: RoleService,
    private loaderService: LoaderService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.isEditMode = false;
    this.initForm();
  }

  initForm() {
    this.userForm = this.fb.group({
      id: [''],
      userName: ['',[Validators.required,Validators.pattern(/^(?!\s+$).+/),],],
      firstName: ['',[Validators.pattern(/^(?!\s+$).+/)]],
      lastName: ['',[Validators.pattern(/^(?!\s+$).+/),],],
      emailAddress: ['',[Validators.required,Validators.pattern(ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_USERNAME),],],
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
    this.existingUserRole = '';
    this.emailAlreadyExists = false;
    this.enteredEmailId = '';
    this.getRoleList();
    this.initForm();

    this.existingUserRole = '';

    if (id !== '') {
      this.getUserDetailsById(id);
      this.isEditMode = true;
      this.modalTitle = 'Edit User';
    } else {
      this.isEditMode = false;
      this.modalTitle = 'Add New User';
    }

    const model = document.getElementById('userDetailsPopup');
    if (model !== null) {
      model.style.display = 'block';
    }
  }

  closePopup() {
    this.existingUserRole = '';
    this.resetForm();
    const model = document.getElementById('userDetailsPopup');
    if (model !== null) {
      model.style.display = 'none';
    }
  }

  resetForm(): void {
    this.userForm?.reset();
    this.isEditMode = false;
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


    if (this.isEditMode) {
      const selectedRole = payload.role;
      const matchedRole = this.roleList.find(
        (rol: { name: string }) =>
          rol.name?.toUpperCase() === selectedRole?.toUpperCase()
      );
      if (matchedRole) {
        payload.role = matchedRole.id;
      }

      this.userService.updateUser(payload).subscribe(this.handleApiResponse());
    } else {
      this.userService.addUser(payload).subscribe(this.handleApiResponse());
    }
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
    this.existingUserRole = '';
    this.userService.getUserDetailsById(id).subscribe({
      next: (result: any) => {
        this.loaderService.showLoader();
        this.existingUserRole = result.role;
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

  populateDetails(event: any) {
    const el = event.target as HTMLInputElement;
    this.enteredEmailId = el.value;
    const isEmailValid = new RegExp(
      ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_USERNAME
    ).test(this.enteredEmailId);
    if (!isEmailValid) {
      this.userForm.patchValue({
        userName: '',
        role: '',
      });
      this.emailAlreadyExists = false;
      return;
    }
  }
}
