import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ExpenseService } from "../../services/expense/expense.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../../services/global/global.service";
import { DatePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-expense-adjustment",
  standalone: true,
  templateUrl: "./expense-adjustment.component.html",
  imports: [ReactiveFormsModule],
  styleUrls: ["./expense-adjustment.component.scss"],
})
export class ExpenseAdjustmentComponent implements OnInit {
  [x: string]: any;
  todaysDate = new Date();
  onDateSbi = new Date();
  expenseAdjustmentForm: FormGroup;
  sourceOrReasonList: any;
  sourceOrReasonListSbi: any;
  sourceOrReasonListCbi: any;
  sourceOrReasonListCash: any;
  sourceOrReasonListOther: any;
  expenseDateValueSbi = new Date();
  expenseDateValueCbi = new Date();
  expenseDateValueCash = new Date();
  expenseDateValueOther = new Date();
  onDateValue: any;
  availableAmountSbi: any;
  availableBalanceSbi: any;
  availableBalanceCbi: any;
  availableBalanceCash: any;
  availableBalanceOther: any;
  sbiAccountAmount: number = 0;
  cbiAccountAmount: any;
  cashAmount: any;
  otherAmount: any;
  source: string = "";
  filteredOptions!: any;
  myControl = new FormControl("");
  customDateFormat = "dd/MMM/yyyy";

  constructor(
    private _adjustment: FormBuilder,
    private _expenseService: ExpenseService,
    private _httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService,
    public globalService: GlobalService,

    private datepipe: DatePipe
  ) {
    this.expenseAdjustmentForm = this._adjustment.group({
      expenseDateSbi: "",
      expenseDateCbi: "",
      expenseDateCash: "",
      expenseDateOther: "",
      sourceOrReasonSbi: "",
      sourceOrReasonCbi: "",
      sourceOrReasonCash: "",
      sourceOrReasonOther: "",
      availableInHandSbi: "",
      availableInHandCbi: "",
      availableInHandCash: "",
      availableInHandOther: "",
      availableBalanceSbi: "",
      availableBalanceCbi: "",
      availableBalanceCash: "",
      availableBalanceOther: "",
      sbiAccount: "",
      cbiAccount: "",
      cashAmount: "",
      otherAmount: "",
    });

    this.getSourceOrReasonList("", "sbi");
    this.getSourceOrReasonList("", "cbi");
    this.getSourceOrReasonList("", "cash");
    this.getSourceOrReasonList("", "other");
  }
  

  onSourceReasonChange(valueToFilter: any, accountType: string) {
    this.getSourceOrReasonList(valueToFilter.target.value, accountType);
  }

  dateChange(data: any, accountType: string) {
    this.expenseDateValueSbi.setDate(data.value);
    this.onDateValue = this.datepipe.transform(data.value, "MM-dd-yyyy");
    this.setAvailBalance(this.onDateValue, accountType);
  }

  ngOnInit(): void {
    this.expenseAdjustmentForm.controls["expenseDateSbi"].patchValue(
      this.todaysDate
    );
    this.expenseAdjustmentForm.controls["expenseDateCbi"].patchValue(
      this.todaysDate
    );
    this.expenseAdjustmentForm.controls["expenseDateCash"].patchValue(
      this.todaysDate
    );
    this.expenseAdjustmentForm.controls["expenseDateOther"].patchValue(
      this.todaysDate
    );
    this.onDateValue = this.datepipe.transform(this.todaysDate, "MM-dd-yyyy");
    this.setAvailBalance(this.onDateValue, "sbi");
    this.setAvailBalance(this.onDateValue, "cbi");
    this.setAvailBalance(this.onDateValue, "cash");
    this.setAvailBalance(this.onDateValue, "other");
  }

  setAvailBalance(availOnDate: any, accountType: any) {
    this.expenseService
      .getAvailAmount(availOnDate, accountType)
      .subscribe((res: any) => {
        if (accountType == "sbi") {
          this.availableBalanceSbi = res.data;
        } else if (accountType == "cbi") {
          this.availableBalanceCbi = res.data;
        } else if (accountType == "cash") {
          this.availableBalanceCash = res.data;
        } else if (accountType == "other") {
          this.availableBalanceOther = res.data;
        }
      });
  }

  getSourceOrReasonList(searchText: string = "", accountType: string) {
    this.expenseService
      .getSourceOrReasonList("", "", searchText)
      .subscribe((res) => {
        if (accountType == "sbi") {
          this.sourceOrReasonListSbi = res.data;
        } else if (accountType == "cbi") {
          this.sourceOrReasonListCbi = res.data;
        } else if (accountType == "cash") {
          this.sourceOrReasonListCash = res.data;
        } else if (accountType == "other") {
          this.sourceOrReasonListOther = res.data;
        }
      });
  }
  calculateAmount(data: any, accountType: string) {
    const enteredSbiValue =
      this.expenseAdjustmentForm.get("availableInHandSbi")?.value;
    const enteredCbiValue =
      this.expenseAdjustmentForm.get("availableInHandCbi")?.value;
    const enteredCashValue = this.expenseAdjustmentForm.get(
      "availableInHandCash"
    )?.value;
    const enteredOtherValue = this.expenseAdjustmentForm.get(
      "availableInHandOther"
    )?.value;
    if (accountType == "sbi") {
      this.expenseAdjustmentForm.controls["sbiAccount"].patchValue(
        this.availableBalanceSbi - enteredSbiValue
      );
    } else if (accountType == "cbi") {
      this.expenseAdjustmentForm.controls["cbiAccount"].patchValue(
        this.availableBalanceCbi - enteredCbiValue
      );
    } else if (accountType == "cash") {
      this.expenseAdjustmentForm.controls["cashAmount"].patchValue(
        this.availableBalanceCash - enteredCashValue
      );
    } else if (accountType == "other") {
      this.expenseAdjustmentForm.controls["otherAmount"].patchValue(
        this.availableBalanceOther - enteredOtherValue
      );
    }
  }
  getExpenseAdjustment(expenseId: number) {
    this.expenseService.adjustExpense(expenseId).subscribe((res: any) => {
      this.patchValues(res);
    });
  }

  patchValues(res: any) {
    this.expenseAdjustmentForm.controls["expenseId"].patchValue(
      res["expenseId"]
    );
    this.expenseAdjustmentForm.controls["expenseDate"].patchValue(
      res["expenseDate"]
    );
    this.expenseAdjustmentForm.controls["sourceOrReason"].patchValue(
      res["sourceOrReason"]
    );
    this.expenseAdjustmentForm.controls["purpose"].patchValue(res["purpose"]);
    this.expenseAdjustmentForm.controls["description"].patchValue(
      res["description"]
    );
    this.expenseAdjustmentForm.controls["sbiAccount"].patchValue(
      res["sbiAccount"]
    );
    this.expenseAdjustmentForm.controls["cashAmount"].patchValue(res["cash"]);
    this.expenseAdjustmentForm.controls["otherAmount"].patchValue(
      res["otherAmount"]
    );
    this.expenseAdjustmentForm.controls["cbiAccount"].patchValue(
      res["cbiAccount"]
    );
    this.expenseAdjustmentForm.controls["assetId"].patchValue(res["assetId"]);
  }
  sbiValid = false;
  cbiValid = false;
  cashValid = false;
  otherValid = false;

  submitExpenseAdjustment() {
    this.sbiValid =
      this.expenseAdjustmentForm.controls["sbiAccount"].value != 0 &&
      this.expenseAdjustmentForm.controls["sbiAccount"].value != "";
    this.cbiValid =
      this.expenseAdjustmentForm.controls["cbiAccount"].value != 0 &&
      this.expenseAdjustmentForm.controls["cbiAccount"].value != "";
    this.cashValid =
      this.expenseAdjustmentForm.controls["cashAmount"].value != 0 &&
      this.expenseAdjustmentForm.controls["cashAmount"].value != "";
    this.otherValid =
      this.expenseAdjustmentForm.controls["otherAmount"].value != 0 &&
      this.expenseAdjustmentForm.controls["otherAmount"].value != "";

    if (this.sbiValid || this.cbiValid || this.cashValid || this.otherValid) {
      if (!this.expenseAdjustmentForm.valid) {
        
        return;
      } else {
        try {
          const selectedDateSbi = new Date(
            this.expenseAdjustmentForm.value["expenseDateSbi"]
          );
          const selectedDateCbi = new Date(
            this.expenseAdjustmentForm.value["expenseDateCbi"]
          );
          const selectedDateCash = new Date(
            this.expenseAdjustmentForm.value["expenseDateCash"]
          );
          const selectedDateOther = new Date(
            this.expenseAdjustmentForm.value["expenseDateOther"]
          );
          this.expenseAdjustmentForm.value["expenseDateSbi"] =
            this.datepipe.transform(selectedDateSbi, "yyyy-MM-dd");
          this.expenseAdjustmentForm.value["expenseDateCbi"] =
            this.datepipe.transform(selectedDateCbi, "yyyy-MM-dd");
          this.expenseAdjustmentForm.value["expenseDateCash"] =
            this.datepipe.transform(selectedDateCash, "yyyy-MM-dd");
          this.expenseAdjustmentForm.value["expenseDateOther"] =
            this.datepipe.transform(selectedDateOther, "yyyy-MM-dd");

          this._expenseService
            .adjustExpense(this.expenseAdjustmentForm.value)
            .subscribe((result) => {
              if (result) {
                
              } else {
                
                return;
              }
            });
        } catch (error) {
          
          console.error("Error in adding data : ", error);
        }
      }
    } else {
      
      return;
    }
  }
}
