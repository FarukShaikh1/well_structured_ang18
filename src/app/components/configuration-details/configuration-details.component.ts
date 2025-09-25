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
import { ConfigurationRequest } from '../../interfaces/configuration-request';
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
  @ViewChild("btnCloseConfigPopup") btnCloseConfigPopup!: ElementRef;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @Input() tableData: Record<string, unknown>[] | undefined;
  configForm!: FormGroup;
  roleList: any;
  roleListoriginal: any;
  Messages = Messages;
  configurationRequest: ConfigurationRequest = {
    id: '',
    configurationName: '',
    description: '',
    displayOrder: 0,
  };
  currentConfig: string = '';

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


  openDetailsPopup(id: string, config: string) {
    this.currentConfig = config;
    this.getConfigDetailsById(id, config);
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

  onSubmit(config:string) {
    this.globalService.trimAllFields(this.configForm);
    if (this.configForm.invalid) {
      return;
    }

    this.configurationRequest = {
      id: this.configForm.value.id,
      configurationName: this.configForm.value.configurationName,
      description: this.configForm.value.configurationDescription,
      displayOrder: this.configForm.value.displaySequence,
    };
    this.loaderService.showLoader();
    if (this.configurationRequest.id) {
      this.updateConfigDetails(this.configurationRequest,config);
    }
    else {
      this.configurationRequest.id = null;
    this.addConfigDetails(this.configurationRequest, config);
    }
  }

  addConfigDetails(request: ConfigurationRequest, config: string) {
    this.configurationService.addConfiguration(request, config).subscribe({
      next: () => {
        this.toaster.showMessage("Record Added Successfully.", "success");
        this.loaderService.hideLoader();
        this.renderer
          .selectRootElement(this.btnCloseConfigPopup?.nativeElement)
          .click();
        this.globalService.triggerGridReload(ApplicationModules.SETTINGS);
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage("Some issue is in Add the data.", "error");
        return;
      },
    });
    
    
    
  }

  updateConfigDetails(request: ConfigurationRequest, config: string) {
    this.configurationService.updateConfiguration(request, config).subscribe({
      next: () => {
        this.toaster.showMessage("Record Updated Successfully.", "success");
        this.loaderService.hideLoader();
        this.renderer
          .selectRootElement(this.btnCloseConfigPopup?.nativeElement)
          .click();
        this.globalService.triggerGridReload(ApplicationModules.SETTINGS);
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage("Some issue is in update the data.", "error");
        return;
      },
    });
  }

  handleApiResponse() {
    return {
      next: (result: any) => {
        if (result.success) {
          this.toaster.showMessage(result?.message, 'success', 8000);
          this.renderer
            .selectRootElement(this.btnCloseConfigPopup?.nativeElement)
            .click();
          
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

  getConfigDetailsById(id: string = '',config: string = '') {
    this.configurationService?.getConfigDetailsById(id, config).subscribe({
      next: (result: any) => {
        this.loaderService.showLoader();
        this.configForm.patchValue({
          id: result.id,
          configurationName: result.configurationName,
          configurationDescription: result.description,
          displaySequence: result.displayOrder,
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
