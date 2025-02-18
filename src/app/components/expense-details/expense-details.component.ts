import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

export class ExpenseDetailsComponent  {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild('btnCloseExpenseDetailsPopup') btnCloseExpensePopup!: ElementRef;
  @Input() expenseDate!: Date; // Receiving latestDate from parent
  [x: string]: any;
  startDate = new Date();
  expenseDetailsForm: FormGroup;
  sourceOrReasonList: any;
  descriptionList: any;
  purposeList: any;
  source: string = '';
  filteredOptions!: any;
  myControl = new FormControl('');

  constructor(private _details: FormBuilder,
    private _expenseService: ExpenseService,
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

    this.getSourceOrReasonList('', '', '');
    this.getPurposeList('', '');

  }
  /* private _filter(value: string): string[] {
     const filterValue = value.toLowerCase();
     return this.sourceOrReasonList.filter((option: string) => option.toLowerCase().includes(filterValue));
   }*/

  onSourceReasonChange(valueToFilter: any) {
    this.getSourceOrReasonList('', '', valueToFilter.target.value);
    this.getDescriptionList(valueToFilter.target.value, '')
    this.getPurposeList(valueToFilter.target.value, '')
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
    this.expenseDetailsForm.controls['expenseDate'].patchValue(this.datepipe.transform(this.expenseDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
    this.loaderService.hideLoader();
    }
  }
  closePopup() {
    const model = document.getElementById('expenseDetailsPopup');
    if (model !== null) {
      model.style.display = 'none';
    }
    this.expenseDetailsForm.reset();
  }
  onDescriptionChange(valueToFilter: any) {
    this.getDescriptionList('', valueToFilter.target.value)
  }

  onPurposeChange(valueToFilter: any) {
    this.getPurposeList('', valueToFilter.target.value)
  }

  ngAfterViewInit() {
    flatpickr('#expenseDate', {
      dateFormat: 'd/m/Y',
      defaultDate: new Date(),
    });
    this.loaderService.hideLoader();
  }
  validateAmount(event: any) {
    if (event.key.match(/^[\D]$/) && event.key.match(/^[^\.\-]$/)) {
      event.preventDefault();
    }
  }


  getSourceOrReasonList(fromDt: string = '', toDt: string = '', searchText: string = '') {
    this.expenseService.getSourceOrReasonList(fromDt, toDt, searchText).subscribe((res) => {
      this.sourceOrReasonList = res;
    },
    )

  }

  getDescriptionList(sourceText: string = '', descriptionText: string = '') {
    this.expenseService.getDescriptionList(sourceText, descriptionText).subscribe((res) => {
      this.descriptionList = res;
    },
    )
  }

  getPurposeList(sourceText: string = '', purposeText: string = '') {
    this.expenseService.getPurposeList(sourceText, purposeText).subscribe((res) => {
      this.purposeList = res;
    },
    )
  }

  getExpenseDetails(expenseId: string) {
    this.expenseService.getExpenseDetails(expenseId).subscribe((res: any) => {
      console.log('res : ', res);
      this.patchValues(res);
      this.loaderService.hideLoader()
    })
  }

  patchValues(res: any) {
    this.expenseDetailsForm.controls['expenseId'].patchValue(res['ExpenseId']);
    this.expenseDetailsForm.controls['expenseDate'].patchValue(this.datepipe.transform(res['ExpenseDate'], ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
    this.expenseDetailsForm.controls['sourceOrReason'].patchValue(res['SourceOrReason']);
    this.expenseDetailsForm.controls['purpose'].patchValue(res['Purpose']);
    this.expenseDetailsForm.controls['description'].patchValue(res['Description']);
    this.expenseDetailsForm.controls['sbiAccount'].patchValue(res['SbiAccount']);
    this.expenseDetailsForm.controls['cash'].patchValue(res['Cash']);
    this.expenseDetailsForm.controls['otherAmount'].patchValue(res['OtherAmount']);
    this.expenseDetailsForm.controls['cbiAccount'].patchValue(res['CbiAccount']);
    this.expenseDetailsForm.controls['assetId'].patchValue(res['AssetId']);
  }
  sbiValid = false;
  cbiValid = false;
  cashValid = false;
  otherValid = false;

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
          this._expenseService.updateExpense(this.expenseDetailsForm.value).subscribe(
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
          this._expenseService.addExpense(this.expenseDetailsForm.value).subscribe({
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