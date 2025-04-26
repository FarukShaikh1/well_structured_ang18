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
  FormArray,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import flatpickr from "flatpickr";
import {
  ApplicationConstants,
  ApplicationModules,
} from "../../../utils/application-constants";
import { BusinessService } from "../../services/business/business.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";

@Component({
  selector: "app-business-details",
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: "./business-details.component.html",
  styleUrls: ["./business-details.component.scss"],
})
export class BusinessDetailsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseBusinessDetailsPopup") btnCloseBusinessPopup!: ElementRef;
  @Input() lastBusinessDate!: Date;

  businessDetailsForm: FormGroup;
  businessPayments: FormArray;
  brokerPayments: FormArray;
  driverPayments: FormArray;
  commonSuggestionList: any;

  constructor(
    private _details: FormBuilder,
    private businessService: BusinessService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.businessDetailsForm = this._details.group({
      businessId: 0,
      businessDate: ["", Validators.required],
      customerName: ["", Validators.required],
      businessPaymentStatus: ["Pending", Validators.required],
      dealAmount: ["", [Validators.required, Validators.min(0)]],
      productName: ["", Validators.required],
      quantity: ["", [Validators.required, Validators.min(0)]],
      unit: ["", Validators.required],
      deliveryDate: ["", Validators.required],
      description: "",
      
      // Business Payments
      businessPayments: this._details.array([]),
      
      // Broker Section
      brokerName: "",
      brokerPaymentStatus: "",
      brokerAmount: ["", [Validators.min(0)]],
      brokerPayments: this._details.array([]),
      brokerDescription: "",
      
      // Driver Section
      driverName: "",
      driverPaymentStatus: "",
      driverAmount: ["", [Validators.min(0)]],
      driverPayments: this._details.array([]),
      driverDescription: ""
    });

    this.businessPayments = this.businessDetailsForm.get('businessPayments') as FormArray;
    this.brokerPayments = this.businessDetailsForm.get('brokerPayments') as FormArray;
    this.driverPayments = this.businessDetailsForm.get('driverPayments') as FormArray;
  }

  openDetailsPopup(businessId: string) {
    this.businessDetailsForm?.reset();
    this.loaderService.showLoader();
    const model = document.getElementById("businessDetailsPopup");
    if (model !== null) {
      model.style.display = "block";
    }
    if (businessId) {
      this.getBusinessDetails(businessId);
    } else {
      this.businessDetailsForm.controls["businessDate"].patchValue(
        this.datepipe.transform(
          this.lastBusinessDate,
          ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
        )
      );
      this.loaderService.hideLoader();
    }
    this.getBusinessSuggestionList();
  }

  closePopup() {
    const model = document.getElementById("businessDetailsPopup");
    if (model !== null) {
      model.style.display = "none";
    }
    this.businessDetailsForm.reset();
  }

  ngAfterViewInit() {
    flatpickr("#businessDate", {
      dateFormat: "d/m/Y",
      defaultDate: new Date(),
    });
  }

  getBusinessSuggestionList() {
    this.businessService.getBusinessSuggestionList().subscribe({
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

  getBusinessDetails(businessId: string) {
    this.businessService.getBusinessDetails(businessId).subscribe({
      next: (res: any) => {
        console.log("res : ", res);
        this.patchValues(res);
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
  }

  patchValues(res: any) {
    this.businessDetailsForm.controls["businessId"].patchValue(
      res["businessId"]
    );
    this.businessDetailsForm.controls["businessDate"].patchValue(
      this.datepipe.transform(
        res["businessDate"],
        ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
      )
    );

    // Patch payment arrays
    if (res.businessPayments) {
      this.patchPaymentArray(this.businessPayments, res.businessPayments);
    }
    if (res.brokerPayments) {
      this.patchPaymentArray(this.brokerPayments, res.brokerPayments);
    }
    if (res.driverPayments) {
      this.patchPaymentArray(this.driverPayments, res.driverPayments);
    }
  }

  patchPaymentArray(formArray: FormArray, payments: any[]): void {
    formArray.clear();
    payments.forEach(payment => {
      const paymentGroup = this.createPaymentEntry();
      paymentGroup.patchValue({
        paymentId: payment.paymentId,
        paymentDate: this.datepipe.transform(payment.paymentDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT),
        paidAmount: payment.paidAmount,
        paidBy: payment.paidBy,
        pendingAmount: payment.pendingAmount
      });
      formArray.push(paymentGroup);
    });
  }

  logInvalidControls(form: FormGroup): void {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.warn(`Control "${name}" is invalid`, controls[name].errors);
      }
    }
    if (invalid.length === 0) {
      console.log('All controls are valid!');
    } else {
      console.log('Invalid controls:', invalid);
    }
  }
  submitBusinessDetails() {
    debugger
    this.logInvalidControls(this.businessDetailsForm);
    debugger
    this.loaderService.showLoader();
      if (!this.businessDetailsForm.valid) {
        this.toaster.showMessage("Please fill valid details.", "error");
        this.loaderService.hideLoader();
        return;
      }
      try {
        const formValue = this.businessDetailsForm.getRawValue();
        
        // Format dates
        formValue.businessDate = this.formatDate(formValue.businessDate);
        
        // Format payment dates
        this.formatPaymentDates(formValue.businessPayments);
        this.formatPaymentDates(formValue.brokerPayments);
        this.formatPaymentDates(formValue.driverPayments);

        if (formValue.businessId > 0) {
          this.businessService.updateBusiness(formValue).subscribe({
            next: (result: any) => {
              this.handleSuccessResponse(result, "Record Updated Successfully.");
            },
            error: (error: any) => {
              this.handleErrorResponse(error);
            }
          });
        } else {
          this.businessService.addBusiness(formValue).subscribe({
            next: (result: any) => {
              this.handleSuccessResponse(result, "Record Added Successfully.");
            },
            error: (error: any) => {
              this.handleErrorResponse(error);
            }
          });
        }
      } catch (error) {
        this.handleErrorResponse(error);
      }
      this.loaderService.hideLoader();
  }

  private formatDate(date: string): string {
    const [day, month, year] = date.split('/');
    return `${day}/${month}/${year}`;
  }

  private formatPaymentDates(payments: any[]): void {
    if (payments) {
      payments.forEach(payment => {
        if (payment.paymentDate) {
          payment.paymentDate = this.formatDate(payment.paymentDate);
        }
      });
    }
  }

  private handleSuccessResponse(result: any, message: string): void {
    if (result) {
      this.toaster.showMessage(message, "success");
      this.loaderService.hideLoader();
      this.renderer.selectRootElement(this.btnCloseBusinessPopup?.nativeElement).click();
      this.globalService.triggerGridReload(ApplicationModules.BUSINESS);
    } else {
      this.toaster.showMessage("Some issue occurred while processing the data.", "error");
      this.loaderService.hideLoader();
    }
  }

  private handleErrorResponse(error: any): void {
    this.toaster.showMessage(error?.message || "An error occurred", "error");
    this.loaderService.hideLoader();
  }

  createPaymentEntry(): FormGroup {
    return this._details.group({
      paymentId: 0,
      paymentDate: ['', Validators.required],
      paidAmount: [0, [Validators.required, Validators.min(0)]],
      paidBy: [''],
      pendingAmount: [{ value: 0, disabled: true }]
    });
  }

  addBusinessPayment(): void {
    const paymentEntry = this.createPaymentEntry();
    this.businessPayments.push(paymentEntry);
    this.updatePendingAmount(paymentEntry);
  }

  addBrokerPayment(): void {
    const paymentEntry = this.createPaymentEntry();
    this.brokerPayments.push(paymentEntry);
    this.updatePendingAmount(paymentEntry);
  }

  addDriverPayment(): void {
    const paymentEntry = this.createPaymentEntry();
    this.driverPayments.push(paymentEntry);
    this.updatePendingAmount(paymentEntry);
  }

  removeBusinessPayment(index: number): void {
    this.businessPayments.removeAt(index);
  }

  removeBrokerPayment(index: number): void {
    this.brokerPayments.removeAt(index);
  }

  removeDriverPayment(index: number): void {
    this.driverPayments.removeAt(index);
  }

  updatePendingAmount(paymentEntry: FormGroup): void {
    const dealAmount = this.businessDetailsForm.get('cash')?.value || 0;
    const paidAmount = paymentEntry.get('paidAmount')?.value || 0;
    const pendingAmount = dealAmount - paidAmount;
    paymentEntry.get('pendingAmount')?.setValue(pendingAmount, { emitEvent: false });
  }

  get businessPaymentControls() {
    return this.businessPayments.controls;
  }

  get brokerPaymentControls() {
    return this.brokerPayments.controls;
  }

  get driverPaymentControls() {
    return this.driverPayments.controls;
  }

  togleDriverData(): void {
    const driverForm = document.getElementById('driver-form');
    if (driverForm) {
      driverForm.style.display = driverForm.style.display === 'none' ? 'block' : 'none';
    }
  }

  togleBrokerData(): void {
    const brokerForm = document.getElementById('broker-form');
    if (brokerForm) {
      brokerForm.style.display = brokerForm.style.display === 'none' ? 'block' : 'none';
    }
  }
}
