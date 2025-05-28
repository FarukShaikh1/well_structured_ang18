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
import { DateUtils } from "../../../utils/date-utils";

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
  businessPaymentRequest: FormArray;
  brokerPaymentRequest: FormArray;
  driverPaymentRequest: FormArray;
  commonSuggestionList: any;
  get brokerRequestGroup(): FormGroup {
    return this.businessDetailsForm.get('brokerRequest') as FormGroup;
  }

  get driverRequestGroup(): FormGroup {
    return this.businessDetailsForm.get('driverRequest') as FormGroup;
  }
  constructor(
    private _details: FormBuilder,
    private businessService: BusinessService,
    public globalService: GlobalService,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.businessDetailsForm = this._details.group({
      businessId: '',
      dealDate: ["", Validators.required],
      clientName: ["", Validators.required],
      paymentStatus: ["Pending", Validators.required],
      dealAmount: ["", [Validators.required, Validators.min(0)]],
      productName: ["", Validators.required],
      quantity: ["", [Validators.required, Validators.min(0)]],
      unit: ["", Validators.required],
      deliveryDate: ["", Validators.required],
      description: "",

      // Business Payments
      businessPaymentRequest: this._details.array([]),

      // Broker Section
      brokerRequest: this._details.group({
        brokerId: [""],
        brokerName: [""],
        brokerPaymentStatus: [""],
        brokerPaymentAmount: ["", [Validators.min(0)]],
        brokerDescription: [""],
      }),
      brokerPaymentRequest: this._details.array([
      ]),

      // Driver Section
      driverRequest: this._details.group({
        driverId: [""],
        driverName: [""],
        driverPaymentStatus: [""],
        driverPaymentAmount: [0, [Validators.min(0)]],
        driverDescription: [""]
      }),
      driverPaymentRequest: this._details.array([
        //   {
        //   paymentId: [""],
        //   paymentDate: [""],
        //   paymentAmount: [""],
        //   paymentMode: [""],
        //   pendingAmount: [""],
        // }
      ]),
    });

    this.businessPaymentRequest = this.businessDetailsForm.get('businessPaymentRequest') as FormArray;
    this.brokerPaymentRequest = this.businessDetailsForm.get('brokerPaymentRequest') as FormArray;
    this.driverPaymentRequest = this.businessDetailsForm.get('driverPaymentRequest') as FormArray;
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
      this.businessDetailsForm.controls["dealDate"].patchValue(
        this.datepipe.transform(
          this.lastBusinessDate,
          ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT
        )
      );
      this.addBusinessPayment();
      this.addBrokerPayment();
      this.addDriverPayment();

      this.loaderService.hideLoader();
    }
    // this.getBusinessSuggestionList();
  }

  closePopup() {
    const model = document.getElementById("businessDetailsPopup");
    if (model !== null) {
      model.style.display = "none";
    }
    this.businessDetailsForm.reset();
  }

  ngAfterViewInit() {
    // flatpickr("#dealDate", {
    //   dateFormat: "d/m/Y",
    //   defaultDate: new Date(),
    // });
    // flatpickr("#deliveryDate", {
    //   dateFormat: "d/m/Y",
    //   defaultDate: new Date(),
    // });
    // flatpickr("#paymentDate", {
    //   dateFormat: "d/m/Y",
    //   defaultDate: new Date(),
    // });
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
        this.patchBusinessForm(res);
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
  }

  patchBusinessForm(business: any) {
    // Patch top-level business info
    this.businessDetailsForm.patchValue({
      businessId: business.businessId,
      dealDate: business.dealDate,//this.datepipe.transform(business.dealDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT),
      deliveryDate: business.deliveryDate,//this.datepipe.transform(business.deliveryDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT),
      // dealDate: this.datepipe.transform(business.dealDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT),
      clientName: business.clientName,
      paymentStatus: business.paymentStatus,
      dealAmount: business.dealAmount,
      productName: business.productName,
      quantity: business.quantity,
      unit: business.unit,
      // deliveryDate: this.datepipe.transform(business.deliveryDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT),
      description: business.description,

      // Broker section
      brokerRequest: {
        brokerId: business.brokerResponse?.brokerId || '',
        brokerName: business.brokerResponse?.brokerName || '',
        brokerPaymentStatus: business.brokerResponse?.brokerPaymentStatus || '',
        brokerPaymentAmount: business.brokerResponse?.brokerPaymentAmount || 0,
        brokerDescription: business.brokerResponse?.brokerDescription || '',
      },

      // Driver section
      driverRequest: {
        driverId: business.driverResponse?.driverId || '',
        driverName: business.driverResponse?.driverName || '',
        driverPaymentStatus: business.driverResponse?.driverPaymentStatus || '',
        driverPaymentAmount: business.driverResponse?.driverPaymentAmount || 0,
        driverDescription: business.driverResponse?.driverDescription || '',
      }
    });

    setTimeout(() => {
    // Clear and patch Business Payments
    const businessPaymentsFGs = business.businessPaymentResponse?.map((p: any) => this.createPaymentGroup(p)) || [];
    this.businessPaymentRequest.clear();
    businessPaymentsFGs.forEach((fg: any) => this.businessPaymentRequest.push(fg));
}, 1000)

    setTimeout(() => {
    // Clear and patch Broker Payments
    const brokerPaymentsFGs = business.brokerPaymentResponse?.map((p: any) => this.createPaymentGroup(p)) || [];
    this.brokerPaymentRequest.clear();
    brokerPaymentsFGs.forEach((fg: any) => this.brokerPaymentRequest.push(fg));
}, 1000)

    setTimeout(() => {
    // Clear and patch Driver Payments
    const driverPaymentsFGs = business.driverPaymentResponse?.map((p: any) => this.createPaymentGroup(p)) || [];
    this.driverPaymentRequest.clear();
    driverPaymentsFGs.forEach((fg: any) => this.driverPaymentRequest.push(fg));
}, 1000)
  }

  // Create Payment FormGroup
  createPaymentGroup(data?: any): FormGroup {
    return this._details.group({
      // paymentId: [data?.paymentId || ''],
      paymentDate: [data?.paymentDate || ''],
      paidAmount: [data?.paidAmount || ''],
      paymentMode: [data?.paymentMode || ''],  // Assuming 'paymentMode' in UI maps to 'paymentMode' from backend
      pendingAmount: [data?.pendingAmount || '']
    });
  }

  patchPaymentArray(formArray: FormArray, payments: any[]): void {
    formArray.clear();
    payments.forEach(payment => {
      const paymentGroup = this.createPaymentEntry();
      paymentGroup.patchValue({
        paymentId: payment.paymentId,
        paymentDate: this.datepipe.transform(payment.paymentDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT),
        paidAmount: payment.paidAmount,
        paymentMode: payment.paymentMode,
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
      alert('Check Consol Logs')
      console.log('Invalid controls:', invalid);
    }
  }
  submitBusinessDetails() {
    this.logInvalidControls(this.businessDetailsForm);
    this.loaderService.showLoader();
    if (!this.businessDetailsForm.valid) {
      this.toaster.showMessage("Please fill valid details.", "error");
      this.loaderService.hideLoader();
      // return;
    }
    try {
      const formValue = this.businessDetailsForm.getRawValue();
      formValue.dealDate = this.formatFlatPckrDate(formValue.dealDate);
      formValue.deliveryDate = this.formatFlatPckrDate(formValue.deliveryDate);
      this.formatPaymentDates(formValue.businessPaymentRequest);
      this.formatPaymentDates(formValue.brokerPaymentRequest);
      this.formatPaymentDates(formValue.driverPaymentRequest);

      const submitCall = formValue.businessId
        ? this.businessService.updateBusiness(formValue)
        : this.businessService.addBusiness(formValue);

      submitCall.subscribe({
        next: (result: any) => this.handleSuccessResponse(result, formValue.businessId > 0 ? "Record Updated Successfully." : "Record Added Successfully."),
        error: (error: any) => this.handleErrorResponse(error)
      });
    } catch (error) {
      this.handleErrorResponse(error);
    }
    this.loaderService.hideLoader();
  }

  // private formatFlatPckrDate(date: string): string {
  //   const [year, month, day] =date.split(/[-\/]/);
  //   return `${day}/${month}/${year}`;
  // }

  private formatFlatPckrDate(date: string): string {
    const parsedDate = new Date(date);
    return this.datepipe.transform(parsedDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT) ?? '';
  }

  private formatPaymentDates(payments: any[]): void {
    if (payments) {
      payments.forEach(payment => {
        if (payment.paymentDate) {
          payment.paymentDate = this.formatFlatPckrDate(payment.paymentDate);
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
      paymentId: '',
      paymentDate: ['', Validators.required],
      paidAmount: [0, [Validators.required, Validators.min(0)]],
      paymentMode: [''],
      pendingAmount: [{ value: 0, disabled: true }]
    });
  }

  addBusinessPayment(): void {
    const paymentEntry = this.createPaymentEntry();
    this.businessPaymentRequest.push(paymentEntry);
    this.updatePendingAmount(paymentEntry);
  }

  addBrokerPayment(): void {
    const paymentEntry = this.createPaymentEntry();
    this.brokerPaymentRequest.push(paymentEntry);
    this.updatePendingAmount(paymentEntry);
  }

  addDriverPayment(): void {
    const paymentEntry = this.createPaymentEntry();
    this.driverPaymentRequest.push(paymentEntry);
    this.updatePendingAmount(paymentEntry);
  }

  removeBusinessPayment(index: number): void {
    this.businessPaymentRequest.removeAt(index);
  }

  removeBrokerPayment(index: number): void {
    this.brokerPaymentRequest.removeAt(index);
  }

  removeDriverPayment(index: number): void {
    this.driverPaymentRequest.removeAt(index);
  }

  updatePendingAmount(paymentEntry: FormGroup): void {
    const dealAmount = this.businessDetailsForm.get('dealAmount')?.value || 0;
    const paidAmount = paymentEntry.get('paidAmount')?.value || 0;
    const pendingAmount = dealAmount - paidAmount;
    paymentEntry.get('pendingAmount')?.setValue(pendingAmount, { emitEvent: false });
  }

  get businessPaymentControls() {
    return this.businessPaymentRequest.controls;
  }

  get brokerPaymentControls() {
    return this.brokerPaymentRequest.controls;
  }

  get driverPaymentControls() {
    return this.driverPaymentRequest.controls;
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
