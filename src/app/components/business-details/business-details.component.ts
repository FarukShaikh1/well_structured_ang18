import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { ApplicationConstants, ApplicationModules } from '../../../utils/application-constants';
import { BusinessService } from '../../services/business/business.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
})

export class BusinessDetailsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild('btnCloseBusinessDetailsPopup') btnCloseBusinessPopup!: ElementRef;
  @Input() lastBusinessDate!: Date; // Receiving lastBusinessDate from parent

  businessDetailsForm: FormGroup;
  sbiValid = false;
  cbiValid = false;
  cashValid = false;
  otherValid = false;

  commonSuggestionList: any;
  sourceOrReasonList: any;
  purposeList: any;
  descriptionList: any;

  filteredSourceOrReasonList: any;
  filteredPurposeList: any;
  filteredDescriptionList: any;

  focusInSource: boolean = false;
  focusInPurpose: boolean = false;
  focusInDescription: boolean = false;
  isValidAmount: boolean = false;

  constructor(private _details: FormBuilder,
    private businessService: BusinessService,
    private _globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.businessDetailsForm = this._details.group({
      businessId: 0,
      businessDate: ['', Validators.required],
      sourceOrReason: ['', Validators.required],
      cash: '',
      sbiAccount: '',
      cbiAccount: '',
      otherAmount: '',
      totalAmount: '',
      isInvoiceAvailable: false,
      referenceNumber: '',
      description: '',
      purpose: '',
      assetType: '',
      businessReceiptAssetId: 0,
      assetId: 0,
    })
  }

  openDetailsPopup(businessId: string) {
    this.businessDetailsForm?.reset();
    this.loaderService.showLoader();
    const model = document.getElementById('businessDetailsPopup');
    if (model !== null) {
      model.style.display = 'block';
    }
    if (businessId) {
      this.getBusinessDetails(businessId);
    }
    else {
      this.businessDetailsForm.controls['businessDate'].patchValue(this.datepipe.transform(this.lastBusinessDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
      this.loaderService.hideLoader();
    }
    this.getBusinessSuggestionList()
  }

  closePopup() {
    const model = document.getElementById('businessDetailsPopup');
    if (model !== null) {
      model.style.display = 'none';
    }
    this.businessDetailsForm.reset();
  }

  ngAfterViewInit() {
    flatpickr('#businessDate', {
      dateFormat: 'd/m/Y',
      defaultDate: new Date(),
    });
  }

  validateAmount(event: any) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }

  validateAmountFields() {
    this.sbiValid = this.businessDetailsForm.controls['sbiAccount'].value && this.businessDetailsForm.controls['sbiAccount'].value != 0 ;
    this.cbiValid = this.businessDetailsForm.controls['cbiAccount'].value && this.businessDetailsForm.controls['cbiAccount'].value != 0;
    this.cashValid = this.businessDetailsForm.controls['cash'].value && this.businessDetailsForm.controls['cash'].value != 0;
    this.otherValid = this.businessDetailsForm.controls['otherAmount'].value && this.businessDetailsForm.controls['otherAmount'].value != 0;

    this.isValidAmount = this.sbiValid || this.cbiValid || this.cashValid || this.otherValid;
  }

  getBusinessSuggestionList() {
    this.businessService.getBusinessSuggestionList()
      .subscribe({
        next: (res: any) => {
          this.commonSuggestionList = res;
          console.log('data: ', res);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }

  onSourceReasonChange(event: any) {
    const inputValue = event?.target?.value?.toLowerCase();
    if (!inputValue) {
      this.filteredSourceOrReasonList = [];
      this.filteredPurposeList = [];
      this.filteredDescriptionList = [];
    }
    else {
      this.filteredSourceOrReasonList = Array.from(
        new Set(
          this.commonSuggestionList
            .filter((option: any) =>
              option?.sourceOrReason &&
              option.sourceOrReason.trim() !== ''
              && option.sourceOrReason.toLowerCase().includes(inputValue)
            )
            .map((item: any) => item.sourceOrReason) // Extract only the 'purpose' values
            .filter((sourceOrReason: any) => sourceOrReason) // Remove any falsy values
        ).values()
      );
      console.log('1 this.filteredSourceOrReasonList :', this.filteredSourceOrReasonList);

      this.filteredPurposeList = Array.from(
        new Set(
          this.commonSuggestionList
            .filter((option: any) =>
              option?.sourceOrReason &&
              option.sourceOrReason.trim() !== ''
              && option.sourceOrReason.toLowerCase().includes(inputValue)
            )
            .map((item: any) => item.purpose) // Extract only the 'purpose' values
            .filter((purpose: any) => purpose) // Remove any falsy values
        )
      );
      console.log('2 this.filteredPurposeList :', this.filteredPurposeList);

      this.filteredDescriptionList = Array.from(
        new Set(
          this.commonSuggestionList
            .filter((option: any) =>
              option?.sourceOrReason &&
              option.sourceOrReason.trim() !== ''
              && option.sourceOrReason.toLowerCase().includes(inputValue)
            )
            .map((item: any) => item.description) // Extract only the 'description' values
            .filter((description: any) => description) // Remove any falsy values
        )
      );
      console.log('3 this.filteredDescriptionList :', this.filteredDescriptionList);
    }
  }

  selectSourceOrReason(selectedValue: string) {
    this.businessDetailsForm.controls['sourceOrReason'].patchValue(selectedValue);
    this.filteredSourceOrReasonList = [];
  }

  onDescriptionChange(event: any) {
    const inputValue = event?.target?.value?.toLowerCase();
    if (!inputValue) {
      this.filteredDescriptionList = [];
    }
    else {
      this.filteredDescriptionList = Array.from(
        new Set(
          this.commonSuggestionList
            .filter((option: any) =>
              option?.description &&
              option.description.trim() !== '' &&
              option.description.toLowerCase().includes(inputValue)
            )
            .map((item: any) => item.description) // Extract only the 'description' values
            .filter((description: any) => description) // Remove any falsy values
        )
      );
      console.log('5 this.filteredDescriptionList :', this.filteredDescriptionList);
    }
  }

  selectDescription(selectedValue: string) {
    this.businessDetailsForm.controls['description'].patchValue(selectedValue);
    this.filteredDescriptionList = [];
  }

  onPurposeChange(event: any) {
    const inputValue = event?.target?.value?.toLowerCase();
    if (!inputValue) {
      this.filteredPurposeList = [];
    }
    else {
      this.filteredPurposeList = Array.from(
        new Set(
          this.commonSuggestionList
            .filter((option: any) =>
              option?.purpose &&
              option.purpose.trim() !== ''
              && option.purpose.toLowerCase().includes(inputValue)
            )
            .map((item: any) => item.purpose) // Extract only the 'purpose' values
            .filter((purpose: any) => purpose) // Remove any falsy values
        )
      );
      console.log('4 this.filteredPurposeList :', this.filteredPurposeList);
    }
  }

  selectPurpose(selectedValue: string) {
    this.businessDetailsForm.controls['purpose'].patchValue(selectedValue);
    this.filteredPurposeList = [];
  }

  getBusinessDetails(businessId: string) {
    this.businessService.getBusinessDetails(businessId)
      .subscribe({
        next: (res: any) => {
          console.log('res : ', res);
          this.patchValues(res);
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }


  focusOutSource() {
    setTimeout(() => {
      this.focusInSource = false;
    }, 200);
  }

  focusOutPurpose() {
    setTimeout(() => {
      this.focusInPurpose = false;
    }, 200);
  }

  focusOutDescription() {
    setTimeout(() => {
      this.focusInDescription = false;
    }, 200);
  }

  patchValues(res: any) {
    this.businessDetailsForm.controls['businessId'].patchValue(res['businessId']);
    this.businessDetailsForm.controls['businessDate'].patchValue(this.datepipe.transform(res['businessDate'], ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
    this.businessDetailsForm.controls['sourceOrReason'].patchValue(res['sourceOrReason']);
    this.businessDetailsForm.controls['purpose'].patchValue(res['purpose']);
    this.businessDetailsForm.controls['description'].patchValue(res['description']);
    this.businessDetailsForm.controls['sbiAccount'].patchValue(res['sbiAccount']);
    this.businessDetailsForm.controls['cash'].patchValue(res['cash']);
    this.businessDetailsForm.controls['otherAmount'].patchValue(res['otherAmount']);
    this.businessDetailsForm.controls['cbiAccount'].patchValue(res['cbiAccount']);
    this.businessDetailsForm.controls['assetId'].patchValue(res['assetId']);
  }

  submitBusinessDetails() {
    this.loaderService.showLoader();
    this.validateAmountFields();
    if (this.isValidAmount) {
      if (!this.businessDetailsForm.valid) {
        this.toaster.showMessage('Please fill valid details.', 'error');
        this.loaderService.hideLoader();
        return;
      }
      try {
        if (!this.businessDetailsForm.value['description']) {
          this.businessDetailsForm.value['description'] = this.businessDetailsForm.value['purpose'];
        }

        const selectedDate1 = new Date(this.businessDetailsForm.value['businessDate']);
        // // Ensure the date is valid
        if (!isNaN(selectedDate1.getTime())) {
          const day = selectedDate1.getDate().toString().padStart(2, '0');
          const month = (selectedDate1.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
          const year = selectedDate1.getFullYear();

          // Format the date as DD/MM/YYYY
          this.businessDetailsForm.value['businessDate'] = `${day}/${month}/${year}`;
        }
        else {

          // Split the string and create a Date object in 'yyyy-MM-dd' format.
          const [day, month, year] = this.businessDetailsForm.value['businessDate'].split('/').map(Number);
          const selectedDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
          this.businessDetailsForm.value['businessDate'] = selectedDate;
          // this.businessDetailsForm.value['businessDate'] = DateUtils.formatDateStringToYYYYMMDD(this.businessDetailsForm.value['businessDate'])
        }

        if (this.businessDetailsForm.value['businessId'] > 0) {
          this.businessService.updateBusiness(this.businessDetailsForm.value).subscribe(
            {
              next: (result: any) => {
                if (result) {
                  //this._globalService.openSnackBar('Record Updated Successfully');
                  this.toaster.showMessage('Record Updated Successfully.', 'success');
                  this.loaderService.hideLoader();
                  this.renderer
                    .selectRootElement(this.btnCloseBusinessPopup?.nativeElement)
                    .click();
                  this._globalService.triggerGridReload(ApplicationModules.BUSINESS);

                }
                else {
                  this.loaderService.hideLoader();
                  this.toaster.showMessage('Some issue is in update the data.', 'error');
                  //this._globalService.openSnackBar('some issue is in update the data');
                  return;
                }
              },
              error: (error: any) => {
                this.loaderService.hideLoader();
                this.toaster.showMessage(error?.message, 'error');
              },
            })
        }
        else {
          this.businessService.addBusiness(this.businessDetailsForm.value).subscribe({
            next: (result: any) => {
              if (result) {
                this.loaderService.hideLoader();
                this.toaster.showMessage('Record Added Successfully.', 'success');
                this.renderer
                  .selectRootElement(this.btnCloseBusinessPopup?.nativeElement)
                  .click();
                this._globalService.triggerGridReload(ApplicationModules.BUSINESS);
              } else {
                this.loaderService.hideLoader();
                this.toaster.showMessage('Some issue is in adding the data.', 'error');
              }
            },
            error: (error: any) => {
              this.toaster.showMessage(error?.message, 'error');
              this.loaderService.hideLoader();
            }
          });
        }
      } catch (error) {
        alert('Inside catch block business details line 263');
        //this._globalService.openSnackBar("Error in adding data : " + error);
        this.loaderService.hideLoader();
        this.toaster.showMessage('Erroooorrrr issue is in adding the data.', 'error');
      }
    }
    else {
      //this._globalService.openSnackBar('Amount can not be blank or 0');
      this.loaderService.hideLoader();
      return;
    }
  }
}