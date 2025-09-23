import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  OnInit,
  OnDestroy,
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
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  catchError,
} from "rxjs/operators";
import { of, Subscription } from "rxjs";

@Component({
  selector: "app-transaction-details",
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: "./transaction-details.component.html",
  styleUrls: ["./transaction-details.component.scss"],
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseDetailsPopup") btnCloseTransactionPopup!: ElementRef;
  @Input() lastTransactionDate!: Date;

  transactionDetailsForm!: FormGroup;
  sbiValid = false;
  cbiValid = false;
  cashValid = false;
  otherValid = false;

  commonSuggestionList: any[] = [];
  sourceOrReasonList: any[] = [];
  purposeList: any[] = [];
  descriptionList: any[] = [];

  filteredSourceOrReasonList: any[] = [];
  filteredPurposeList: any[] = [];
  filteredDescriptionList: any[] = [];

  focusInSource: boolean = false;
  focusInPurpose: boolean = false;
  focusInDescription: boolean = false;
  isValidAmount: boolean = false;
  transactionRequest: TransactionRequest = {
    transactionGroupId: "",
    transactionDate: DateUtils.GetDateBeforeDays(30),
    sourceOrReason: "",
    purpose: "",
    description: "",
    accountSplits: [],
  };
  loggedInUserId: string = "";
  accountList: any[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private configurationService: ConfigurationService,
    private datepipe: DatePipe
  ) {
    this.transactionDetailsForm = this.fb.group({
      transactionGroupId: "",
      transactionDate: ["", Validators.required],
      sourceOrReason: ["", Validators.required],
      description: [""],
      purpose: [""],
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setupFormListeners(): void {
    this.subscriptions.add(
      this.transactionDetailsForm.controls["sourceOrReason"].valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((value) => this.onSourceReasonChange(value))
    );
    this.subscriptions.add(
      this.transactionDetailsForm.controls["purpose"].valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((value) => this.onPurposeChange(value))
    );
    this.subscriptions.add(
      this.transactionDetailsForm.controls["description"].valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((value) => this.onDescriptionChange(value))
    );
  }

  openDetailsPopup(transactionGroupId: string) {
    this.loaderService.showLoader();
    this.loggedInUserId = localStorage.getItem("userId") || "";
    this.loadAccountList();
    this.loadAccountFields();
    this.getTransactionSuggestionList();

    if (this.accountList.length && transactionGroupId) {
      this.getTransactionDetails(transactionGroupId);
    } else {
      this.transactionDetailsForm.controls["transactionDate"].patchValue(
        this.datepipe.transform(
          this.lastTransactionDate,
          ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
        )
      );
      this.loaderService.hideLoader();
    }

    const model = document.getElementById("detailsPopup");
    if (model) {
      this.renderer.setStyle(model, "display", "block");
    }
  }

  loadAccountList() {
    this.accountList = this.globalService.getConfigList(UserConfig.ACCOUNT);
  }

  loadAccountFields() {
    for (const acc of this.accountList) {
      this.transactionDetailsForm.addControl(acc.id, new FormControl(0));
      this.transactionDetailsForm.addControl(
        "amount_" + acc.id,
        new FormControl(0)
      );
      this.transactionDetailsForm.addControl(
        "category_" + acc.id,
        new FormControl(0)
      );
    }
  }

  atLeastOneValidAccountEntryValidator(accountIds: string[]): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      for (const id of accountIds) {
        const amountControl = form.get("amount_" + id);
        const categoryControl = form.get("category_" + id);

        const amount = Number(amountControl?.value ?? 0);
        const category = categoryControl?.value;

        if (
          amount > 0 &&
          category != null &&
          category !== "" &&
          category !== 0
        ) {
          return null;
        }
      }
      return { atLeastOneAccountEntryRequired: true };
    };
  }

  closePopup() {
    const model = document.getElementById("detailsPopup");
    if (model) {
      this.renderer.setStyle(model, "display", "none");
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
    // This method is no longer needed due to the change in how validation is handled.
  }

  getTransactionSuggestionList() {
    try {
      this.commonSuggestionList = JSON.parse(
        localStorage.getItem("commonSuggestionList") || "[]"
      );
      this.sourceOrReasonList = this.extractUniqueCapitalized(
        this.commonSuggestionList,
        "sourceOrReason"
      );
      this.purposeList = this.extractUniqueCapitalized(
        this.commonSuggestionList,
        "purpose"
      );
      this.descriptionList = this.extractUniqueCapitalized(
        this.commonSuggestionList,
        "description"
      );
    } catch (e) {
      console.error(
        "Failed to parse commonSuggestionList from localStorage",
        e
      );
      this.commonSuggestionList = [];
    }
  }

  addTransactionSuggestion(transactionRequest: TransactionRequest): void {
    if (!this.commonSuggestionList) {
      this.commonSuggestionList = [];
    }
    const isDuplicate = this.commonSuggestionList.some(
      (suggestion) =>
        suggestion.sourceOrReason === transactionRequest.sourceOrReason &&
        suggestion.purpose === transactionRequest.purpose &&
        suggestion.description === transactionRequest.description
    );

    if (!isDuplicate) {
      this.commonSuggestionList.push({
        sourceOrReason: transactionRequest.sourceOrReason,
        purpose: transactionRequest.purpose,
        description: transactionRequest.description,
      });
      localStorage.setItem(
        "commonSuggestionList",
        JSON.stringify(this.commonSuggestionList)
      );
    }
  }

  private capitalizeWords(text: string): string {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  private extractUniqueCapitalized(list: any[], key: string): string[] {
    return Array.from(
      new Set(
        list
          .map((item) => item[key]?.trim())
          .filter((value) => value)
          .map((value) => this.capitalizeWords(value))
      )
    );
  }

  onSourceReasonChange(inputValue: string): void {
    const filteredList = this.commonSuggestionList.filter(
      (option: any) =>
        option?.sourceOrReason &&
        option.sourceOrReason.trim() !== "" &&
        option.sourceOrReason.toLowerCase().includes(inputValue.toLowerCase())
    );

    this.filteredSourceOrReasonList = this.extractUniqueCapitalized(
      filteredList,
      "sourceOrReason"
    );
    this.filteredPurposeList = this.extractUniqueCapitalized(
      filteredList,
      "purpose"
    );
    this.filteredDescriptionList = this.extractUniqueCapitalized(
      filteredList,
      "description"
    );
  }

  selectSourceOrReason(inputValue: string): void {
    this.transactionDetailsForm.controls["sourceOrReason"].patchValue(
      inputValue
    );
    // Trigger filtering for other fields
    this.onSourceReasonChange(inputValue);
    this.focusInSource = false;
  }

  onDescriptionChange(inputValue: string) {
    this.filteredDescriptionList = this.filterList(inputValue, "description");
  }

  selectDescription(selectedValue: string) {
    this.transactionDetailsForm.controls["description"].patchValue(
      selectedValue
    );
    this.filteredDescriptionList = [];
  }

  onPurposeChange(inputValue: string) {
    this.filteredPurposeList = this.filterList(inputValue, "purpose");
  }

  selectPurpose(selectedValue: string) {
    this.transactionDetailsForm.controls["purpose"].patchValue(selectedValue);
    this.filteredPurposeList = [];
  }

  getTransactionDetails(transactionGroupId: string) {
    this.loaderService.showLoader();
    this.transactionService
      .getTransactionDetails(transactionGroupId)
      .pipe(
        tap((res: any) => {
          this.patchValues(res.data);
          this.loaderService.hideLoader();
        }),
        catchError((error) => {
          this.showError(
            error?.message || "Error fetching transaction details."
          );
          return of(null);
        })
      )
      .subscribe();
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
    this.transactionDetailsForm.patchValue({
      transactionGroupId: res.transactionGroupId,
      transactionDate: this.datepipe.transform(
        res.transactionDate,
        ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
      ),
      sourceOrReason: res.sourceOrReason,
      purpose: res.purpose,
      description: res.description,
    });
    res.accountSplits?.forEach((split: any) => {
      const amountControl = this.transactionDetailsForm.get(split.accountId);
      const categoryControl = this.transactionDetailsForm.get(
        `category_${split.accountId}`
      );
      if (amountControl && categoryControl) {
        amountControl.patchValue(split.amount ?? 0);
        categoryControl.patchValue(split.category);
      }
    });
  }

  submitTransactionDetails() {
    this.loaderService.showLoader();
    this.globalService.trimAllFields(this.transactionDetailsForm);

    if (!this.transactionDetailsForm.valid) {
      this.showError("Please fill valid details.");
      return;
    }

    try {
      this.ensureDescription();
      this.correctTransactionDate();

      const validationError = this.validateAccountEntries();
      if (validationError) {
        this.showError(validationError);
        return;
      }

      const splits = this.buildSplits();
      if (splits.length === 0) {
        this.showError("Please enter valid amount for at least one account.");
        return;
      }

      const request: TransactionRequest = {
        transactionGroupId:
          this.transactionDetailsForm.value.transactionGroupId || null,
        transactionDate: DateUtils.IstDate(
          this.transactionDetailsForm.value.transactionDate
        ),
        sourceOrReason: this.transactionDetailsForm.value.sourceOrReason,
        purpose: this.transactionDetailsForm.value.purpose,
        description: this.transactionDetailsForm.value.description,
        accountSplits: splits,
      };

      this.saveTransaction(request);
    } catch (error) {
      this.showError("Error occurred while adding the data.");
    }
  }

  /** Ensures description is filled */
  private ensureDescription() {
    if (!this.transactionDetailsForm.value["description"]) {
      this.transactionDetailsForm.value["description"] =
        this.transactionDetailsForm.value["purpose"];
    }
  }

  /** Corrects date */
  private correctTransactionDate() {
    this.transactionDetailsForm.value["transactionDate"] =
      DateUtils.CorrectedDate(
        this.transactionDetailsForm.value["transactionDate"]
      );
  }

  /** Validate account entries */
  private validateAccountEntries(): string | null {
    for (const acc of this.accountList) {
      const category = this.transactionDetailsForm.value["category_" + acc.id];
      const amount = this.transactionDetailsForm.value[acc.id];
      const hasAmount = !!amount && amount !== 0;
      const hasCategory =
        category !== null && category !== undefined && category !== 0;

      if (hasAmount && !hasCategory) {
        return `Please select transaction category for ${
          acc.configurationName || "Unknown Account"
        }`;
      }
    }
    return null;
  }

  /** Build splits */
  private buildSplits() {
    return this.accountList.map((acc: any) => ({
      accountId: acc.id,
      category:
        this.transactionDetailsForm.value["category_" + acc.id] || "expense",
      amount: this.transactionDetailsForm.value[acc.id] || 0,
    }));
    // .filter((split: { category: any; amount: number }) => split.category && split.amount !== 0);
  }

  /** Save transaction (update or add) */
  private saveTransaction(request: TransactionRequest) {
    const isUpdate = !!request.transactionGroupId;
    const request$ = isUpdate
      ? this.transactionService.updateTransaction(request)
      : this.transactionService.addTransaction(request);

    request$
      .pipe(
        tap((result) => {
          if (
            !result ||
            (!isUpdate && this.globalService.isEmptyGuid(result))
          ) {
            throw new Error(
              isUpdate
                ? "Some issue occurred while updating."
                : "Data is not added in the database."
            );
          }

          this.showSuccess(
            isUpdate
              ? "Record updated successfully."
              : "Record added successfully."
          );
          this.renderer
            .selectRootElement(this.btnCloseTransactionPopup?.nativeElement)
            .click();
          this.globalService.triggerGridReload(ApplicationModules.EXPENSE);
          this.addTransactionSuggestion(request);
        }),
        catchError((error) => {
          this.showError(error?.message || "An error occurred.");
          return of(null);
        })
      )
      .subscribe();
  }

  /** Helpers for messages */
  private showError(message: string) {
    this.loaderService.hideLoader();
    this.toaster.showMessage(message, "error");
  }

  private showSuccess(message: string) {
    this.loaderService.hideLoader();
    this.toaster.showMessage(message, "success");
  }

  toggleCategory(accountId: string, value: string) {
    const key = "category_" + accountId;
    const current = this.transactionDetailsForm.get(key)?.value;

    if (current === value) {
      this.transactionDetailsForm.get(key)?.setValue(null); // Unselect if same clicked
    } else {
      this.transactionDetailsForm.get(key)?.setValue(value);
    }
  }

  private filterList(inputValue: string, key: string): any[] {
    if (!inputValue || this.commonSuggestionList.length === 0) {
      return [];
    }

    const filtered = this.commonSuggestionList.filter(
      (option: any) =>
        option?.[key] &&
        option[key].trim() !== "" &&
        option[key].toLowerCase().includes(inputValue.toLowerCase())
    );

    return Array.from(
      new Set(
        filtered
          .map((item) => item[key]?.trim())
          .filter((value) => value)
          .map((value) => this.capitalizeWords(value))
      )
    );
  }
}
