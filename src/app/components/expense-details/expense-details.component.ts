import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import flatpickr from "flatpickr";
import {
  ApplicationConstants,
  ApplicationModules,
} from "../../../utils/application-constants";
import { ExpenseService } from "../../services/expense/expense.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";
import { ExpenseRequest } from "../../interfaces/expense-request";
import { DateUtils } from "../../../utils/date-utils";

@Component({
  selector: "app-expense-details",
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: "./expense-details.component.html",
  styleUrls: ["./expense-details.component.scss"],
})
export class ExpenseDetailsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseDetailsPopup") btnCloseExpensePopup!: ElementRef;
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
  isValidAmount: boolean = false;
  expenseRequest: ExpenseRequest = {
    id: '',
    expenseDate:DateUtils.GetDateBeforeDays(30),
    sourceOrReason: '',
    cash: 0,
    sbiAccount: 0,
    cbiAccount: 0,
    other: 0,
    purpose: '',
    description: '',

  }

  constructor(
    private _details: FormBuilder,
    private expenseService: ExpenseService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.expenseDetailsForm = this._details.group({
      expenseId: '',
      expenseDate: ["", Validators.required],
      sourceOrReason: ["", Validators.required],
      cash: "",
      sbiAccount: "",
      cbiAccount: "",
      other: "",
      totalAmount: "",
      isInvoiceAvailable: false,
      referenceNumber: "",
      description: "",
      purpose: "",
      assetType: "",
      expenseReceiptAssetId: 0,
      assetId: 0,
    });
  }

  openDetailsPopup(expenseId: string) {
    this.expenseDetailsForm?.reset();
    this.loaderService.showLoader();
    const model = document.getElementById("detailsPopup");
    if (model !== null) {
      model.style.display = "block";
    }
    if (expenseId) {
      this.getExpenseDetails(expenseId);
    } else {
      this.expenseDetailsForm.controls["expenseDate"].patchValue(
        this.datepipe.transform(
          this.lastExpenseDate,
          ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
        )
      );
      this.loaderService.hideLoader();
    }
    this.getExpenseSuggestionList();
  }

  closePopup() {
    const model = document.getElementById("detailsPopup");
    if (model !== null) {
      model.style.display = "none";
    }
    this.expenseDetailsForm.reset();
  }

  ngAfterViewInit() {
    flatpickr("#expenseDate", {
      dateFormat: "d/m/Y",
      defaultDate: new Date(),
    });
  }

  validateAmountFields() {
    this.sbiValid =
      this.expenseDetailsForm.controls["sbiAccount"].value &&
      this.expenseDetailsForm.controls["sbiAccount"].value != 0;
    this.cbiValid =
      this.expenseDetailsForm.controls["cbiAccount"].value &&
      this.expenseDetailsForm.controls["cbiAccount"].value != 0;
    this.cashValid =
      this.expenseDetailsForm.controls["cash"].value &&
      this.expenseDetailsForm.controls["cash"].value != 0;
    this.otherValid =
      this.expenseDetailsForm.controls["other"].value &&
      this.expenseDetailsForm.controls["other"].value != 0;

    this.isValidAmount =
      this.sbiValid || this.cbiValid || this.cashValid || this.otherValid;
  }

  getExpenseSuggestionList() {
    this.expenseService.getExpenseSuggestionList().subscribe({
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

    const filteredList = this.commonSuggestionList.filter(
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
    this.expenseDetailsForm.controls["sourceOrReason"].patchValue(inputValue);
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
    this.expenseDetailsForm.controls["description"].patchValue(selectedValue);
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
    this.expenseDetailsForm.controls["purpose"].patchValue(selectedValue);
    this.filteredPurposeList = [];
  }

  getExpenseDetails(expenseId: string) {
    this.loaderService.showLoader();
    this.expenseService.getExpenseDetails(expenseId).subscribe({
      next: (res: any) => {
        console.log("res : ", res);
        this.patchValues(res);
        this.loaderService.hideLoader();
        this.validateAmountFields();
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
    this.expenseDetailsForm.controls["expenseId"].patchValue(res["id"]);
    this.expenseDetailsForm.controls["expenseDate"].patchValue(
      this.datepipe.transform(
        res["expenseDate"],
        ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
      )
    );
    this.expenseDetailsForm.controls["sourceOrReason"].patchValue(res["sourceOrReason"]);
    this.expenseDetailsForm.controls["purpose"].patchValue(res["purpose"]);
    this.expenseDetailsForm.controls["description"].patchValue(res["description"]);
    this.expenseDetailsForm.controls["sbiAccount"].patchValue(res["sbiAccount"]);
    this.expenseDetailsForm.controls["cash"].patchValue(res["cash"]);
    this.expenseDetailsForm.controls["other"].patchValue(res["other"]);
    this.expenseDetailsForm.controls["cbiAccount"].patchValue(res["cbiAccount"]);
    this.expenseDetailsForm.controls["assetId"].patchValue(res["assetId"]);
  }

  submitExpenseDetails() {
    
    this.globalService.trimAllFields(this.expenseDetailsForm);
    this.loaderService.showLoader();
    this.validateAmountFields();
    if (this.isValidAmount) {
      if (!this.expenseDetailsForm.valid) {
        this.toaster.showMessage("Please fill valid details.", "error");
        this.loaderService.hideLoader();
        return;
      }
      try {
        if (!this.expenseDetailsForm.value["description"]) {
          this.expenseDetailsForm.value["description"] =
            this.expenseDetailsForm.value["purpose"];
        }
        this.expenseDetailsForm.value["expenseDate"] = DateUtils.CorrectedDate(this.expenseDetailsForm.value["expenseDate"]);
        
        this.expenseRequest = {
          id: this.expenseDetailsForm.value["expenseId"],
          expenseDate: DateUtils.IstDate(this.expenseDetailsForm.value["expenseDate"]),
          sourceOrReason: this.expenseDetailsForm.value["sourceOrReason"],
          cash: this.expenseDetailsForm.value["cash"],
          sbiAccount: this.expenseDetailsForm.value["sbiAccount"],
          cbiAccount: this.expenseDetailsForm.value["cbiAccount"],
          other: this.expenseDetailsForm.value["other"],
          purpose: this.expenseDetailsForm.value["purpose"],
          description: this.expenseDetailsForm.value["description"],
        }
        if (this.expenseRequest.id) {
          this.expenseService
          .updateExpense(this.expenseRequest)
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
                  .selectRootElement(this.btnCloseExpensePopup?.nativeElement)
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
          this.loaderService.showLoader();
          this.expenseService
            .addExpense(this.expenseRequest)
            .subscribe({
              next: (result: any) => {
                if (result) {
                  this.loaderService.hideLoader();
                  this.toaster.showMessage(
                    "Record Added Successfully.",
                    "success"
                  );
                  this.renderer
                    .selectRootElement(this.btnCloseExpensePopup?.nativeElement)
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
        alert("Inside catch block expense details line 263");
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
}

