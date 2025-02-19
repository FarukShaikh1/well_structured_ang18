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
import { environmentDev } from '../../../environments/environment.dev';
import { PopupStats } from '../../interfaces/popup-stats';
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
    private globalService: GlobalService,
    private roleService: RoleService,
    private loaderService: LoaderService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.isEditMode = false;
    this.initForm();
  }

  initForm() {
    this.userForm = this.fb.group({
      id: 0,
      username: [
        '',
        [
          Validators.required,
          // Validators.pattern(ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_NAME),
          Validators.pattern(/^(?!\s+$).+/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(ApplicationConstants.PATTERN_REQUIRED_CHARS_IN_USERNAME),
        ],
      ],
      role: ['', [Validators.required]],
      phone: [''],
      clientID: [''],
    });
  }

  isGuid(value: string) {
    const guidPattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidPattern.test(value);
  }

  openUserDetailsPopup(id: string, popupStats: PopupStats | null) {
    this.existingUserRole = '';
    this.emailAlreadyExists = false;
    this.enteredEmailId = '';
    this.getRoleList();
    this.initForm();

    this.existingUserRole = '';
    this.setClientIdAsNonRequired();
    if (popupStats !== null) {
      this.isEditMode = popupStats.isEditMode;
      this.modalTitle = popupStats.popupTitle;
      this.isRoleDisabled = popupStats.isRoleDisabled;
    } else {
      if (id !== '') {
        this.getUserDetailsById(id);
        this.isEditMode = true;
        this.modalTitle = 'Edit User';
      } else {
        this.isEditMode = false;
        this.modalTitle = 'Add New User';
      }
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

  trimAllFields(){
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

    // If the role is not "Client Representative", set phoneNo and client to null
    if (!this.isClientRepresentativeSelected) {
      payload.phone = null;
      payload.clientID = null;
    }

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
      next: (result : any) => {
        this.loaderService.showLoader();
        this.existingUserRole = result.data?.role;
        this.userForm.patchValue({
          id: result.data?.id,
          username: result.data?.userName,
          email: result.data?.email,
          role: result.data?.role,
          clientID: result.data?.clientID,
        });
        this.loaderService.hideLoader();
      },
      error: (error : any) => {
        this.loaderService.hideLoader();
        console.error('Error fetching user data:', error);
      },
    });
  }

  setClientIdAsRequired() {
    this.isClientRepresentativeSelected = true;
    this.userForm.get('clientID')?.setValidators(Validators.required);
    this.userForm.get('clientID')?.updateValueAndValidity(); // Re-evaluate validation state
  }
  setClientIdAsNonRequired() {
    this.isClientRepresentativeSelected = false;
    this.userForm.get('clientID')?.setValidators(null);
    this.userForm.get('clientID')?.updateValueAndValidity(); // Re-evaluate validation state
  }
  getUserDetailsByEmail(email: string) {
    this.existingUserRole = '';
    this.userService.getUserDetailsByEmail(email).subscribe({
      next: (result : any) => {
        this.loaderService.showLoader();
        if (result.data) {
          this.userForm.patchValue({
            id: result.data?.id,
            username: result.data?.userName,
            role: result.data?.role,
            clientID: result.data?.clientID,
          });
          this.existingUserRole = result.data?.role;
          this.emailAlreadyExists = true;
          this.existingUserRole = result.data?.role;
          this.userForm.get('username')?.disable();
          this.userForm.get('role')?.disable();
          this.userForm.get('clientID')?.disable();
          this.loaderService.hideLoader();
        } else {
          this.emailAlreadyExists = false;
          this.userForm.get('username')?.enable();
          this.userForm.get('role')?.enable();
          this.userForm.get('clientID')?.enable();

          let partBeforeAt = email.split('@')[0]; // Extract text before @
          partBeforeAt = partBeforeAt?.replace(ApplicationConstants.REGEX_DASH_DOT_UNDERSCORE_WITH_SPACE, ' ');
          partBeforeAt = partBeforeAt?.replace(ApplicationConstants.REGEX_CAPITALIZE_FIRST_LETTER, (char) => char.toUpperCase());

          if (this.roleList.length > 1) {
            this.userForm.patchValue({
              username: partBeforeAt,
              role: '',
              clientID: '',
            });
          } else {
            this.userForm.patchValue({
              username: partBeforeAt,
              clientID: '',
            });
          }
          this.loaderService.hideLoader();
        }
      },
      error: (error : any) => {
        this.loaderService.hideLoader();
        console.error('Error fetching user data:', error);
      },
    });
  }

  getRoleList() {
    this.roleService.getAllRoles().subscribe({
      next: (result : any) => {
        this.roleListoriginal = result.data;
        this.roleList = result.data;
      },
      error: (error : any) => {
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
        username: '',
        role: '',
        clientID: '',
      });
      this.emailAlreadyExists = false;
      return;
    }
    this.getUserDetailsByEmail(this.enteredEmailId);
  }
}
