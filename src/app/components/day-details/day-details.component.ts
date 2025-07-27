import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
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
import { API_URL } from "../../../utils/api-url";
import {
  ActionConstant,
  ApplicationConstants,
  ApplicationModules,
  DBConstants,
} from "../../../utils/application-constants";
import { AssetService } from "../../services/asset/asset.service";
import { DayService } from "../../services/day/day.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";
import { SpecialOccasionRequest } from "../../interfaces/special-occasion-request";
import { DateUtils } from "../../../utils/date-utils";

@Component({
  selector: "app-day-details",
  standalone: true,
  templateUrl: "./day-details.component.html",
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  styleUrls: ["./day-details.component.scss"],
  providers: [DatePipe],
})
export class DayDetailsComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseDayDetailsPopup") btnCloseDayPopup!: ElementRef;
  startDate = new Date();
  dayDetailsForm: FormGroup;
  user: any;
  dayTypeList: any;
  relationList: any;
  userId: string = "";
  specialOccasionId: string = "";
  selectedImage!: string | ArrayBuffer | null;
  selectedImageFile: File | null = null;
  fil: File | null = null;
  formData: FormData = new FormData();
  dayDetails: any;
  assetDetails: any;
  isApprovable: boolean = false;
  isVerified: boolean = false;
  specialOccasionRequest: SpecialOccasionRequest = {
    id: '',
    specialOccasionDate: '',
    personName: '',
    dayTypeId: '',
    relationId: '',
    mobileNumber: '',
    contactNumber: '',
    emailId: '',
    gender: '',
    address: '',
    assetId: ''
  }
  ActionConstant = ActionConstant;
  constructor(
    private _details: FormBuilder,
    private _dayService: DayService,
    private loaderService: LoaderService,
    private _assetService: AssetService,
    public globalService: GlobalService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.dayDetailsForm = this._details.group<any>({
      specialOccasionId: '',
      personName: ["",
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-&() ]{3,60}$/)],
      ],
      dayTypeId: ["", Validators.required],
      relationId: [""],
      specialOccasionDate: ["", Validators.required],
      mobileNumber: ["", Validators.pattern(/^[0-9]{8,12}$/)],
      contactNumber: ["", Validators.pattern(/^[0-9]{8,12}$/)],
      emailId: [
        "",
        Validators.pattern(
          /^[a-zA-Z_0-9.]{3,}@[a-zA-Z\-]{2,}[.]{1}[a-zA-Z.]{2,10}$/
        ),
      ],
      address: "",
      assetId: '',
      gender: 'M',
      picture: null,
      createdBy: "",
      createdOn: "",
      modifiedBy: "",
      modifiedOn: "",
    });
  }

  onDragOver(event: any) {
    event.preventDefault();
  }
  onDrop(event: any) {
    event.preventDefault();
    this.handleImageDrop(event.dataTransfer.files);
  }
  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.handleImageDrop(inputElement.files);
  }

  private handleImageDrop(files: FileList | null): void {
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedImageFile = files[0];
      if (file.type.startsWith("image/")) {
        this.formData.append("file", file);

        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file.");
      }
    }
  }

  ngOnInit(): void {
    this.dayDetailsForm.controls["specialOccasionDate"].patchValue(this.startDate);
  }
  ngAfterViewInit() {
    flatpickr("#specialOccasionDate", {
      dateFormat: "d/m/Y",
      defaultDate: new Date(),
    });
  }

  getDayDetails(specialOccasionId: string) {
    this._dayService.getDayDetails(specialOccasionId).subscribe({
      next: (res: any) => {
        console.log("res : ", res);

        this.patchValues(res);
        this.dayDetails = res;
        console.log("this.dayDetails?.assetId : ", this.dayDetails?.assetId);

        if (this.dayDetails?.assetId) {
          this.getAssetDetails(this.dayDetails.assetId);
          this.loaderService.hideLoader();
        }
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
  }
  getAssetDetails(assetId: string) {
    this._assetService.getAssetDetails(assetId).subscribe({
      next: (res: any) => {
        console.log();

        this.selectedImage = API_URL.ATTACHMENT + res.originalPath;
        console.log("this.selectedImage : ", this.selectedImage);

        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
  }

  patchValues(res: any) {
    if (res != undefined) {
      this.isApprovable = res["isApprovable"];
      this.isVerified = res["isVerified"];
      this.dayDetailsForm.controls["specialOccasionId"].patchValue(res["id"]);
      this.dayDetailsForm.controls["personName"].patchValue(res["personName"]);
      this.dayDetailsForm.controls["dayTypeId"].patchValue(res["dayTypeId"]);
      this.dayDetailsForm.controls["relationId"].patchValue(res["relationId"]);
      this.dayDetailsForm.controls["specialOccasionDate"].patchValue(
        this.datepipe.transform(res["specialOccasionDate"], ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT)
      );
      this.dayDetailsForm.controls["mobileNumber"].patchValue(
        res["mobileNumber"]
      );
      this.dayDetailsForm.controls["contactNumber"].patchValue(
        res["contactNumber"]
      );
      this.dayDetailsForm.controls["emailId"].patchValue(res["emailId"]);
      this.dayDetailsForm.controls["address"].patchValue(res["address"]);
      this.dayDetailsForm.controls["gender"].patchValue(res["gender"] ?? 'M');
      this.dayDetailsForm.controls["picture"].patchValue(res["image"]);
      this.dayDetailsForm.controls["assetId"].patchValue(res["assetId"]);
      // if(res['isApprovable'] && !res['isVerified']){
      this.dayDetailsForm.controls["createdOn"].patchValue(res["createdOn"]);
      this.dayDetailsForm.controls["createdBy"].patchValue(res["createdBy"]);
      this.dayDetailsForm.controls["modifiedOn"].patchValue(res["modifiedOn"]);
      this.dayDetailsForm.controls["modifiedBy"].patchValue(res["modifiedBy"]);
      // }
    }
  }

  submitDayDetails() {
    
    this.globalService.trimAllFields(this.dayDetailsForm);
    this.dayDetailsForm.value["specialOccasionDate"] = DateUtils.CorrectedDate(this.dayDetailsForm.value["specialOccasionDate"]);
    console.log('this.dayDetailsForm.value["specialOccasionDate"] : ', this.dayDetailsForm.value["specialOccasionDate"]);

    this.specialOccasionRequest = {
      id: this.dayDetailsForm.value["specialOccasionId"] ?? null,
      specialOccasionDate: this.dayDetailsForm.value["specialOccasionDate"],
      personName: this.dayDetailsForm.value["personName"],
      dayTypeId: this.dayDetailsForm.value["dayTypeId"],
      relationId: this.dayDetailsForm.value["relationId"],
      mobileNumber: this.dayDetailsForm.value["mobileNumber"],
      contactNumber: this.dayDetailsForm.value["contactNumber"],
      emailId: this.dayDetailsForm.value["emailId"],
      gender: this.dayDetailsForm.value["gender"],
      address: this.dayDetailsForm.value["address"],
      assetId: this.dayDetailsForm.value["assetId"],
    }
    if (!this.dayDetailsForm.valid) {
      this.toaster.showMessage("Please fill valid details.", "error");
      return;
    }
    if (this.formData) {
      this.uploadImageAndSaveData();
    }

  }

  openDetailsPopup(specialOccasionId: any) {
    this.loaderService.showLoader();

    this.globalService.getCommonListItems(DBConstants.DAYTYPE).subscribe({
      next: (res: any) => {
        this.dayTypeList = res;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });
    this.globalService.getCommonListItems(DBConstants.RELATION).subscribe({
      next: (res: any) => {
        this.relationList = res;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });

    const model = document.getElementById("dayDetailsPopup");
    if (model !== null) {
      model.style.display = "block";
      this.loaderService.hideLoader();
    }
    if (specialOccasionId) {
      this.getDayDetails(specialOccasionId);
    }
  }
  closePopup() {
    const model = document.getElementById("dayDetailsPopup");
    if (model !== null) {
      model.style.display = "none";
    }
    this.dayDetailsForm.reset();
    this.selectedImage = "";
    this.selectedImageFile = null;
    this.renderer
      .selectRootElement(this.btnCloseDayPopup?.nativeElement)
      .click();
  }

  addDayDetails() {
    
    this._dayService.addDay(this.specialOccasionRequest).subscribe({
      next: () => {
        this.toaster.showMessage("Record Added Successfully.", "success");
        this.loaderService.hideLoader();
        this.renderer
          .selectRootElement(this.btnCloseDayPopup?.nativeElement)
          .click();
        this.globalService.triggerGridReload(ApplicationModules.DAY);
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage("Some issue is in Add the data.", "error");
        return;
      },
    });
  }
  updateDayDetails() {
    
    this._dayService.updateDay(this.specialOccasionRequest).subscribe({
      next: (res: any) => {
        this.toaster.showMessage("Record Updated Successfully.", "success");
        this.loaderService.hideLoader();
        this.renderer
          .selectRootElement(this.btnCloseDayPopup?.nativeElement)
          .click();
        this.globalService.triggerGridReload(ApplicationModules.DAY);
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage("Some issue is in Update the data.", "error");
        //this.globalService.openSnackBar('some issue is in update the data');
        return;
      },
    });
  }

  addOrUpdateDayDetails() {
    
    if (this.specialOccasionRequest.id) {
      this.updateDayDetails();
      this.formData = new FormData();
    } else {
      this.addDayDetails();
      this.formData = new FormData();
    }
  }
  uploadImageAndSaveData() {
    if (this.selectedImageFile) {
      
      this._assetService.uploadImage(this.dayDetailsForm.value["assetId"], API_URL.BIRTHDAYPERSONPIC, this.formData)
        .subscribe({
          next: (res: any) => {
            this.dayDetailsForm.value["assetId"] = res;
            this.specialOccasionRequest.assetId = res;
            this.addOrUpdateDayDetails();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    } else {
      this.addOrUpdateDayDetails();
    }
  }
}
