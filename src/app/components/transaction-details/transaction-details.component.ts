import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import flatpickr from "flatpickr";
import {
  ApplicationConstants,
  ApplicationModules,
  UserConfig,
} from "../../../utils/application-constants";
import { TransactionService } from "../../services/transaction/transaction.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";
import { TransactionRequest } from "../../interfaces/transaction-request";
import { DateUtils } from "../../../utils/date-utils";
import { ConfigurationService } from "../../services/configuration/configuration.service";
import { TransactionAccountSplit } from "../../interfaces/transaction-account-split";

@Component({
  selector: "app-transaction-details",
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: "./transaction-details.component.html",
  styleUrls: ["./transaction-details.component.scss"],
})
export class TransactionDetailsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseDetailsPopup") btnCloseTransactionPopup!: ElementRef;
  @Input() lastTransactionDate!: Date; // Receiving lastTransactionDate from parent

  transactionDetailsForm: FormGroup;
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
  transactionRequest: TransactionRequest = {
    transactionGroupId: '',
    transactionDate: DateUtils.GetDateBeforeDays(30),
    sourceOrReason: '',
    purpose: '',
    description: '',
    accountSplits: []
  }
  loggedInUserId: string = '';
  accountList: any;

  constructor(
    private _details: FormBuilder,
    private transactionService: TransactionService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private configurationService: ConfigurationService,
    private datepipe: DatePipe
  ) {
    this.transactionDetailsForm = this._details.group({
      transactionGroupId: '',
      transactionDate: ["", Validators.required],
      sourceOrReason: ["", Validators.required],
      description: "",
      purpose: ""
    });
  }

  // createAccountSplitFormGroup(): FormGroup {
  //   return this.accountList?.forEach((account: TransactionAccountSplit) => {
  //     this.transactionDetailsForm.addControl(account.accountId, this._details.control(''));
  //     this.transactionDetailsForm.addControl('amount_' + account.accountId, this._details.control(''));
  //     this.transactionDetailsForm.addControl('category_' + account.accountId, this._details.control(''));
  //   });

  //   // return this._details.group({
  //   //   accountId: ['', Validators.required],
  //   //   amount: [0, [Validators.required, Validators.min(0.01)]],
  //   //   category: ['Income', Validators.required]  // or use a dropdown
  //   // });
  // }

  openDetailsPopup(transactionGroupId: string) {
    this.loaderService.showLoader();
    this.loggedInUserId = localStorage.getItem('userId') || '';

    this.configurationService.getConfigList(this.loggedInUserId, UserConfig.ACCOUNT).subscribe({
      next: (result: any) => {
        console.log('result : ', result);
        this.accountList = result;
        this.loadAccountFields();
        if (this.accountList && transactionGroupId) {
          this.getTransactionDetails(transactionGroupId);
        }
      },
      error: (error: any) => {
        console.error('Error fetching user list', error);
      },
    });

    // this.transactionDetailsForm?.reset();
    const model = document.getElementById("detailsPopup");
    if (model !== null) {
      model.style.display = "block";
    }
    if (!transactionGroupId) {
      this.transactionDetailsForm.controls["transactionDate"].patchValue(
        this.datepipe.transform(
          this.lastTransactionDate,
          ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
        )
      );
      this.loaderService.hideLoader();
    }
    this.getTransactionSuggestionList();
  }

  loadAccountFields() {
    for (const acc of this.accountList) {
      this.transactionDetailsForm.addControl(acc.id, new FormControl(0));
      this.transactionDetailsForm.addControl('amount_' + acc.id, new FormControl(0));
      this.transactionDetailsForm.addControl('category_' + acc.id, new FormControl(0));
    }
    // const accountIds = this.accountList.map((acc: { id: any; }) => acc.id);
    // this.transactionDetailsForm.setValidators(this.atLeastOneValidAccountEntryValidator(accountIds));
    // this.transactionDetailsForm.updateValueAndValidity();
  }

  atLeastOneValidAccountEntryValidator(accountIds: string[]): ValidatorFn {
    debugger;
    return (form: AbstractControl): ValidationErrors | null => {
      for (const id of accountIds) {
        debugger;
        const amountControl = form.get('amount_' + id);
        const categoryControl = form.get('category_' + id);

        const amount = Number(amountControl?.value ?? 0);
        const category = categoryControl?.value;

        if (amount > 0 && category != null && category !== '' && category !== 0) {
          return null; // ✅ Valid pair found
        }
      }
      return { atLeastOneAccountEntryRequired: true }; // ❌ No valid pair
    };
  }
  closePopup() {
    const model = document.getElementById("detailsPopup");
    if (model !== null) {
      model.style.display = "none";
    }
    this.transactionDetailsForm.reset();
  }

  ngAfterViewInit() {
    flatpickr("#transactionDate", {
      dateFormat: "d/m/Y",
      defaultDate: new Date(),
    });
  }

  validateAmountFields() {
    // this.sbiValid =
    //   this.transactionDetailsForm.controls["sbiAccount"].value &&
    //   this.transactionDetailsForm.controls["sbiAccount"].value != 0;

    // this.isValidAmount = this.sbiValid;
  }

  getTransactionSuggestionList() {
    this.loaderService.showLoader();
    this.transactionService.getTransactionSuggestionList().subscribe({
      next: (res: any) => {
        this.commonSuggestionList = res;
        console.log("data: ", res);
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
  }

  private capitalizeWords(text: string): string {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  private extractUniqueCapitalized(filteredList: any[], key: string): string[] {
    return Array.from(
      new Set(
        filteredList
          .map((item) => item[key]?.trim())
          .filter((value) => value)
          .map((value) => this.capitalizeWords(value))
      )
    );
  }

  private updateFilteredLists(inputValue: string): void {
    if (!inputValue) {
      this.filteredSourceOrReasonList = [];
      this.filteredPurposeList = [];
      this.filteredDescriptionList = [];
      return;
    }
    if (this.commonSuggestionList === undefined || this.commonSuggestionList.length === 0) {
      this.toaster.showMessage("No suggestions available.", "info");
      return;
    }
    const filteredList = this.commonSuggestionList?.filter(
      (option: any) =>
        option?.sourceOrReason &&
        option.sourceOrReason.trim() !== "" &&
        option.sourceOrReason.toLowerCase().includes(inputValue.toLowerCase())
    );

    this.filteredSourceOrReasonList = this.extractUniqueCapitalized(filteredList, "sourceOrReason");
    console.log("1 this.filteredSourceOrReasonList:", this.filteredSourceOrReasonList);

    this.filteredPurposeList = this.extractUniqueCapitalized(filteredList, "purpose");
    console.log("2 this.filteredPurposeList:", this.filteredPurposeList);

    this.filteredDescriptionList = this.extractUniqueCapitalized(filteredList, "description");
    console.log("3 this.filteredDescriptionList:", this.filteredDescriptionList);
  }

  onSourceReasonChange(event: any): void {
    const inputValue = event?.target?.value?.toLowerCase() || "";
    this.updateFilteredLists(inputValue);
  }

  selectSourceOrReason(inputValue: string): void {
    this.transactionDetailsForm.controls["sourceOrReason"].patchValue(inputValue);
    this.updateFilteredLists(inputValue.toLowerCase());
  }

  onDescriptionChange(event: any) {
    const inputValue = event?.target?.value?.toLowerCase();
    if (!inputValue) {
      this.filteredDescriptionList = [];
    } else {
      this.filteredDescriptionList = Array.from(
        new Set(
          this.commonSuggestionList
            .filter(
              (option: any) =>
                option?.description &&
                option.description.trim() !== "" &&
                option.description.toLowerCase().includes(inputValue)
            )
            .map((item: any) => item.description?.trim()) // Extract only the 'description' values
            .filter((description: any) => description) // Remove any falsy values
        )
      );
      console.log(
        "5 this.filteredDescriptionList :",
        this.filteredDescriptionList
      );
    }
  }

  selectDescription(selectedValue: string) {
    this.transactionDetailsForm.controls["description"].patchValue(selectedValue);
    this.filteredDescriptionList = [];
  }

  onPurposeChange(event: any) {
    const inputValue = event?.target?.value?.toLowerCase();
    if (!inputValue) {
      this.filteredPurposeList = [];
    } else {
      this.filteredPurposeList = Array.from(
        new Set(
          this.commonSuggestionList
            .filter(
              (option: any) =>
                option?.purpose &&
                option.purpose.trim() !== "" &&
                option.purpose.toLowerCase().includes(inputValue)
            )
            .map((item: any) => item.purpose?.trim()) // Extract only the 'purpose' values
            .filter((purpose: any) => purpose) // Remove any falsy values
        )
      );
      console.log("4 this.filteredPurposeList :", this.filteredPurposeList);
    }
  }

  selectPurpose(selectedValue: string) {
    this.transactionDetailsForm.controls["purpose"].patchValue(selectedValue);
    this.filteredPurposeList = [];
  }

  getTransactionDetails(transactionGroupId: string) {
    this.loaderService.showLoader();
    this.transactionService.getTransactionDetails(transactionGroupId).subscribe({
      next: (res: any) => {
        console.log("res : ", res);
        this.patchValues(res);
        this.loaderService.hideLoader();
        // this.validateAmountFields();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
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
    this.transactionDetailsForm.controls["transactionGroupId"].patchValue(res["transactionGroupId"]);
    this.transactionDetailsForm.controls["transactionDate"].patchValue(
      this.datepipe.transform(
        res["transactionDate"],
        ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
      )
    );
    this.transactionDetailsForm.controls["sourceOrReason"].patchValue(res["sourceOrReason"]);
    this.transactionDetailsForm.controls["purpose"].patchValue(res["purpose"]);
    this.transactionDetailsForm.controls["description"].patchValue(res["description"]);
    // Patch dynamic account splits
    if (res.accountSplits && Array.isArray(res.accountSplits)) {
      for (const split of res.accountSplits) {
        const accountId = split.accountId;
        const amount = split.amount ?? 0;
        let category = '';
        if (split.category === 0 || split.category === 'income') category = 'income';
        else if (split.category === 1 || split.category === 'expense') category = 'expense';

        if (this.transactionDetailsForm.contains(accountId)) {
          this.transactionDetailsForm.controls[accountId].patchValue(amount);
        }
        if (this.transactionDetailsForm.contains('amount_' + accountId)) {
          this.transactionDetailsForm.controls['amount_' + accountId].patchValue(amount);
        }
        if (this.transactionDetailsForm.contains('category_' + accountId)) {
          this.transactionDetailsForm.controls['category_' + accountId].patchValue(category);
        }
      }
    }
  }

  submitTransactionDetails() {
    this.loaderService.showLoader();
    debugger
    this.globalService.trimAllFields(this.transactionDetailsForm);
    // this.validateAmountFields();
    if (!this.isValidAmount) {
      if (!this.transactionDetailsForm.valid) {
        this.toaster.showMessage("Please fill valid details.", "error");
        this.loaderService.hideLoader();
        return;
      }
      try {
        if (!this.transactionDetailsForm.value["description"]) {
          this.transactionDetailsForm.value["description"] =
            this.transactionDetailsForm.value["purpose"];
        }
        this.transactionDetailsForm.value["transactionDate"] = DateUtils.CorrectedDate(this.transactionDetailsForm.value["transactionDate"]);

        let invalidEntry = null;

        for (const acc of this.accountList) {
          debugger
          const category = this.transactionDetailsForm.value['category_' + acc.id];
          const amount = this.transactionDetailsForm.value[acc.id];

          const hasAmount = amount !== null && amount !== undefined && amount !== '' && amount !== 0;
          const hasCategory = category !== null && category !== undefined && category !== 0;

          if ((hasAmount && !hasCategory) || (!hasAmount && hasCategory)) {
            invalidEntry = acc;
            break;
          }
        }

        if (invalidEntry) {
          const accName = invalidEntry.configurationName || 'Unknown Account';
          alert(`Please provide both Amount and Category for ${accName}`);
          this.loaderService.hideLoader();
          return;
        }
        // Build splits array from accountList
        const splits = this.accountList.map((acc: any) => ({
          accountId: acc.id,
          category: this.transactionDetailsForm.value['category_' + acc.id],
          amount: this.transactionDetailsForm.value[acc.id]
        })).filter((split: any) =>
          split.category !== 0 &&
          split.category !== null &&
          split.category !== undefined &&
          split.amount !== 0
        );
        this.transactionRequest = {
          transactionGroupId: this.transactionDetailsForm.value["transactionGroupId"],
          transactionDate: DateUtils.IstDate(this.transactionDetailsForm.value["transactionDate"]),
          sourceOrReason: this.transactionDetailsForm.value["sourceOrReason"],
          purpose: this.transactionDetailsForm.value["purpose"],
          description: this.transactionDetailsForm.value["description"],
          accountSplits: splits
        }
        if (this.transactionRequest.transactionGroupId) {
          this.transactionService
            .updateTransaction(this.transactionRequest)
            .subscribe({
              next: (result: any) => {
                if (result) {
                  //this.globalService.openSnackBar('Record Updated Successfully');
                  this.toaster.showMessage(
                    "Record Updated Successfully.",
                    "success"
                  );
                  this.loaderService.hideLoader();
                  this.renderer
                    .selectRootElement(this.btnCloseTransactionPopup?.nativeElement)
                    .click();
                  this.globalService.triggerGridReload(
                    ApplicationModules.EXPENSE
                  );
                } else {
                  this.loaderService.hideLoader();
                  this.toaster.showMessage(
                    "Some issue is in update the data.",
                    "error"
                  );
                  //this.globalService.openSnackBar('some issue is in update the data');
                  return;
                }
              },
              error: (error: any) => {
                this.loaderService.hideLoader();
                this.toaster.showMessage(error?.message, "error");
              },
            });
        } else {
          this.transactionRequest.transactionGroupId = null;
          this.loaderService.showLoader();
          this.transactionService
            .addTransaction(this.transactionRequest)
            .subscribe({
              next: (result: any) => {
                if (result) {
                  this.loaderService.hideLoader();
                  this.toaster.showMessage(
                    "Record Added Successfully.",
                    "success"
                  );
                  this.renderer
                    .selectRootElement(this.btnCloseTransactionPopup?.nativeElement)
                    .click();
                  this.globalService.triggerGridReload(
                    ApplicationModules.EXPENSE
                  );
                } else {
                  this.loaderService.hideLoader();
                  this.toaster.showMessage(
                    "Some issue is in adding the data.",
                    "error"
                  );
                }
              },
              error: (error: any) => {
                this.toaster.showMessage(error?.message, "error");
                this.loaderService.hideLoader();
              },
            });
        }
      } catch (error) {
        alert("Inside catch block transaction details line 263");
        //this.globalService.openSnackBar("Error in adding data : " + error);
        this.loaderService.hideLoader();
        this.toaster.showMessage(
          "Erroooorrrr issue is in adding the data.",
          "error"
        );
      }
    } else {
      //this.globalService.openSnackBar('Amount can not be blank or 0');
      this.loaderService.hideLoader();
      return;
    }
  }

  toggleCategory(accountId: string, value: string) {
    const key = 'category_' + accountId;
    const current = this.transactionDetailsForm.get(key)?.value;

    if (current === value) {
      this.transactionDetailsForm.get(key)?.setValue(null); // Unselect if same clicked
    } else {
      this.transactionDetailsForm.get(key)?.setValue(value);
    }
  }

}

