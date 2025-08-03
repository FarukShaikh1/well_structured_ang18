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
import { TransactionService } from "../../services/transaction/transaction.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";
import { TransactionRequest } from "../../interfaces/transaction-request";
import { DateUtils } from "../../../utils/date-utils";

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
    id: '',
    transactionDate:DateUtils.GetDateBeforeDays(30),
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
    private transactionService: TransactionService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.transactionDetailsForm = this._details.group({
      transactionId: '',
      transactionDate: ["", Validators.required],
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
      transactionReceiptAssetId: 0,
      assetId: 0,
    });
  }

  openDetailsPopup(transactionId: string) {
    this.transactionDetailsForm?.reset();
    this.loaderService.showLoader();
    const model = document.getElementById("detailsPopup");
    if (model !== null) {
      model.style.display = "block";
    }
    if (transactionId) {
      this.getTransactionDetails(transactionId);
    } else {
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
    this.sbiValid =
      this.transactionDetailsForm.controls["sbiAccount"].value &&
      this.transactionDetailsForm.controls["sbiAccount"].value != 0;
    this.cbiValid =
      this.transactionDetailsForm.controls["cbiAccount"].value &&
      this.transactionDetailsForm.controls["cbiAccount"].value != 0;
    this.cashValid =
      this.transactionDetailsForm.controls["cash"].value &&
      this.transactionDetailsForm.controls["cash"].value != 0;
    this.otherValid =
      this.transactionDetailsForm.controls["other"].value &&
      this.transactionDetailsForm.controls["other"].value != 0;

    this.isValidAmount =
      this.sbiValid || this.cbiValid || this.cashValid || this.otherValid;
  }

  getTransactionSuggestionList() {
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

  getTransactionDetails(transactionId: string) {
    this.loaderService.showLoader();
    this.transactionService.getTransactionDetails(transactionId).subscribe({
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
    this.transactionDetailsForm.controls["transactionId"].patchValue(res["id"]);
    this.transactionDetailsForm.controls["transactionDate"].patchValue(
      this.datepipe.transform(
        res["transactionDate"],
        ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
      )
    );
    this.transactionDetailsForm.controls["sourceOrReason"].patchValue(res["sourceOrReason"]);
    this.transactionDetailsForm.controls["purpose"].patchValue(res["purpose"]);
    this.transactionDetailsForm.controls["description"].patchValue(res["description"]);
    this.transactionDetailsForm.controls["sbiAccount"].patchValue(res["sbiAccount"]);
    this.transactionDetailsForm.controls["cash"].patchValue(res["cash"]);
    this.transactionDetailsForm.controls["other"].patchValue(res["other"]);
    this.transactionDetailsForm.controls["cbiAccount"].patchValue(res["cbiAccount"]);
    this.transactionDetailsForm.controls["assetId"].patchValue(res["assetId"]);
  }

  submitTransactionDetails() {
    
    this.globalService.trimAllFields(this.transactionDetailsForm);
    this.loaderService.showLoader();
    this.validateAmountFields();
    if (this.isValidAmount) {
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
        
        this.transactionRequest = {
          id: this.transactionDetailsForm.value["transactionId"],
          transactionDate: DateUtils.IstDate(this.transactionDetailsForm.value["transactionDate"]),
          sourceOrReason: this.transactionDetailsForm.value["sourceOrReason"],
          cash: this.transactionDetailsForm.value["cash"],
          sbiAccount: this.transactionDetailsForm.value["sbiAccount"],
          cbiAccount: this.transactionDetailsForm.value["cbiAccount"],
          other: this.transactionDetailsForm.value["other"],
          purpose: this.transactionDetailsForm.value["purpose"],
          description: this.transactionDetailsForm.value["description"],
        }
        if (this.transactionRequest.id) {
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
}

