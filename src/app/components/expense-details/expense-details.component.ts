import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { ApplicationConstants, ApplicationModules } from '../../../utils/application-constants';
import { ExpenseService } from '../../services/expense/expense.service';
import { GlobalService } from '../../services/global/global.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-expense-details',
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent],
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild('btnCloseExpenseDetailsPopup') btnCloseExpensePopup!: ElementRef;
  @Input() lastExpenseDate!: Date; // Receiving lastExpenseDate from parent

  expenseDetailsForm: FormGroup;
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

  constructor(private _details: FormBuilder,
    private expenseService: ExpenseService,
    private _globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.expenseDetailsForm = this._details.group({
      expenseId: 0,
      expenseDate: ['', Validators.required],
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
      expenseReceiptAssetId: 0,
      assetId: 0,
    })
  }

  openDetailsPopup(expenseId: string) {
    this.expenseDetailsForm?.reset();
    this.loaderService.showLoader();
    const model = document.getElementById('expenseDetailsPopup');
    if (model !== null) {
      model.style.display = 'block';
    }
    if (expenseId) {
      this.getExpenseDetails(expenseId);
    }
    else {
      this.expenseDetailsForm.controls['expenseDate'].patchValue(this.datepipe.transform(this.lastExpenseDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
      this.loaderService.hideLoader();
    }
    this.getExpenseSuggestionList()
  }

  closePopup() {
    const model = document.getElementById('expenseDetailsPopup');
    if (model !== null) {
      model.style.display = 'none';
    }
    this.expenseDetailsForm.reset();
  }

  ngAfterViewInit() {
    flatpickr('#expenseDate', {
      dateFormat: 'd/m/Y',
      defaultDate: new Date(),
    });
  }

  validateAmount(event: any) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }

  getExpenseSuggestionList() {
    this.expenseService.getExpenseSuggestionList()
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
    this.expenseDetailsForm.controls['sourceOrReason'].patchValue(selectedValue);
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
    this.expenseDetailsForm.controls['description'].patchValue(selectedValue);
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
    this.expenseDetailsForm.controls['purpose'].patchValue(selectedValue);
    this.filteredPurposeList = [];
  }

  getExpenseDetails(expenseId: string) {
    this.expenseService.getExpenseDetails(expenseId)
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
    }, 500);
  }

  focusOutPurpose() {
    setTimeout(() => {
      this.focusInPurpose = false;
    }, 500);
  }

  focusOutDescription() {
    setTimeout(() => {
      this.focusInDescription = false;
    }, 500);
  }

  patchValues(res: any) {
    this.expenseDetailsForm.controls['expenseId'].patchValue(res['expenseId']);
    this.expenseDetailsForm.controls['expenseDate'].patchValue(this.datepipe.transform(res['expenseDate'], ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
    this.expenseDetailsForm.controls['sourceOrReason'].patchValue(res['sourceOrReason']);
    this.expenseDetailsForm.controls['purpose'].patchValue(res['purpose']);
    this.expenseDetailsForm.controls['description'].patchValue(res['description']);
    this.expenseDetailsForm.controls['sbiAccount'].patchValue(res['sbiAccount']);
    this.expenseDetailsForm.controls['cash'].patchValue(res['cash']);
    this.expenseDetailsForm.controls['otherAmount'].patchValue(res['otherAmount']);
    this.expenseDetailsForm.controls['cbiAccount'].patchValue(res['cbiAccount']);
    this.expenseDetailsForm.controls['assetId'].patchValue(res['assetId']);
  }

  submitExpenseDetails() {
    this.loaderService.showLoader();
    this.sbiValid = this.expenseDetailsForm.controls['sbiAccount'].value != 0 && this.expenseDetailsForm.controls['sbiAccount'].value != '';
    this.cbiValid = this.expenseDetailsForm.controls['cbiAccount'].value != 0 && this.expenseDetailsForm.controls['cbiAccount'].value != '';
    this.cashValid = this.expenseDetailsForm.controls['cash'].value != 0 && this.expenseDetailsForm.controls['cash'].value != '';
    this.otherValid = this.expenseDetailsForm.controls['otherAmount'].value != 0 && this.expenseDetailsForm.controls['otherAmount'].value != '';

    if (this.sbiValid || this.cbiValid || this.cashValid || this.otherValid) {
      if (!this.expenseDetailsForm.valid) {
        this.toaster.showMessage('Please fill valid details.', 'error');
        this.loaderService.hideLoader();
        return;
      }
      try {
        if (!this.expenseDetailsForm.value['description']) {
          this.expenseDetailsForm.value['description'] = this.expenseDetailsForm.value['purpose'];
        }

        const selectedDate1 = new Date(this.expenseDetailsForm.value['expenseDate']);
        // // Ensure the date is valid
        if (!isNaN(selectedDate1.getTime())) {
          const day = selectedDate1.getDate().toString().padStart(2, '0');
          const month = (selectedDate1.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
          const year = selectedDate1.getFullYear();

          // Format the date as DD/MM/YYYY
          this.expenseDetailsForm.value['expenseDate'] = `${day}/${month}/${year}`;
        }
        else {

          // Split the string and create a Date object in 'yyyy-MM-dd' format.
          const [day, month, year] = this.expenseDetailsForm.value['expenseDate'].split('/').map(Number);
          const selectedDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
          this.expenseDetailsForm.value['expenseDate'] = selectedDate;
          // this.expenseDetailsForm.value['expenseDate'] = DateUtils.formatDateStringToYYYYMMDD(this.expenseDetailsForm.value['expenseDate'])
        }

        if (this.expenseDetailsForm.value['expenseId'] > 0) {
          this.expenseService.updateExpense(this.expenseDetailsForm.value).subscribe(
            {
              next: (result: any) => {
                if (result) {
                  //this._globalService.openSnackBar('Record Updated Successfully');
                  this.toaster.showMessage('Record Updated Successfully.', 'success');
                  this.loaderService.hideLoader();
                  this.renderer
                    .selectRootElement(this.btnCloseExpensePopup?.nativeElement)
                    .click();
                  this._globalService.triggerGridReload(ApplicationModules.EXPENSE);

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
          this.expenseService.addExpense(this.expenseDetailsForm.value).subscribe({
            next: (result: any) => {
              if (result) {
                this.loaderService.hideLoader();
                this.toaster.showMessage('Record Added Successfully.', 'success');
                this.renderer
                  .selectRootElement(this.btnCloseExpensePopup?.nativeElement)
                  .click();
                this._globalService.triggerGridReload(ApplicationModules.EXPENSE);
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
        alert('Inside catch block expense details line 263');
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