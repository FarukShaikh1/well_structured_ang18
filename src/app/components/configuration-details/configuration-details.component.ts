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
  ApplicationModules,
  Messages
} from '../../../utils/application-constants';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-configuration-details',
  standalone: true,
  imports: [CommonModule, forms.ReactiveFormsModule, ToasterComponent],
  templateUrl: './configuration-details.component.html',
  styleUrl: './configuration-details.component.css',
})
export class ConfigurationDetailsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild('btnCloseAccountPopup') btnCloseAccountPopup!: ElementRef;
  @Input() tableData: Record<string, unknown>[] | undefined;
  configForm!: FormGroup;
  roleList: any;
  roleListoriginal: any;
  Messages = Messages;

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2
  ) {
    this.configForm = this.fb.group({
      id: [''],
      configurationName: ['', [Validators.required, Validators.pattern(/^(?!\s+$).+/),],],
      configurationDescription: ['', [Validators.required, Validators.pattern(/^(?!\s+$).+/),],],
      displaySequence: ['', [Validators.pattern(/^(?!\s+$).+/),],],
    });
  }


  openDetailsPopup(config:string,id: string) {
    this.getConfigDetailsById(config, id);
    const model = document.getElementById('configDetailsPopup');
    if (model !== null) {
      model.style.display = 'block';
    }
  }

  closePopup() {
    this.resetForm();
    const model = document.getElementById('configDetailsPopup');
    if (model !== null) {
      model.style.display = 'none';
    }
  }

  resetForm(): void {
    this.configForm?.reset();
  }

  onSubmit() {
    this.globalService.trimAllFields(this.configForm);
    if (this.configForm.invalid) {
      return;
    }
    this.loaderService.showLoader();
    const formValue = this.configForm.value;
    const payload = { ...formValue };
    this.configurationService.updateAccount(payload).subscribe(this.handleApiResponse());
  }

  handleApiResponse() {
    return {
      next: (result: any) => {
        if (result.success) {
          this.toaster.showMessage(result?.message, 'success', 8000);
          this.renderer
            .selectRootElement(this.btnCloseAccountPopup?.nativeElement)
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

  getConfigDetailsById(config:string='', id: string='') {
        debugger;
    this.configurationService?.getConfigDetailsById(config, id).subscribe({
      next: (result: any) => {
        debugger;
        this.loaderService.showLoader();
        this.configForm.patchValue({
          id: result.id,
          configurationName: result.configurationName,
          description: result.description,
          displaySequence: result.displaySequence,
        });
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        console.error('Error fetching configuration data:', error);
      },
    });
  }
}
