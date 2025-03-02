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
  ApplicationModules,
  DBConstants
} from "../../../utils/application-constants";
import { AssetService } from "../../services/asset/asset.service";
import { DayService } from "../../services/day/day.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";

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
  dayType: any;
  userId: string ='';
  dayId: string = '';
  selectedImage!: string | ArrayBuffer | null;
  selectedImageFile: File | null = null;
  fil: File | null = null;
  formData: FormData = new FormData();
  dayDetails: any;
  assetDetails: any;
  isApprovable: boolean = false;
  isVerified: boolean = false;

  constructor(
    private _details: FormBuilder,
    private _dayService: DayService,
    private loaderService: LoaderService,
    private _assetService: AssetService,
    private _globalService: GlobalService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.dayDetailsForm = this._details.group<any>({
      dayId: 0,
      personName: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z. ]{3,40}$/)],
      ],
      dayTypeId: ["", Validators.required],
      birthdate: ["", Validators.required],
      mobileNumber: ["", Validators.pattern(/^[0-9]{8,12}$/)],
      mobileNumber2: ["", Validators.pattern(/^[0-9]{8,12}$/)],
      emailId: [
        "",
        Validators.pattern(
          /^[a-zA-Z_0-9.]{3,}@[a-zA-Z\-]{2,}[.]{1}[a-zA-Z.]{2,10}$/
        ),
      ],
      address: "",
      assetId: 0,
      gender: 0,
      image: null,
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
    this.dayDetailsForm.controls["birthdate"].patchValue(this.startDate);
  }
  ngAfterViewInit() {
    flatpickr("#birthdate", {
      dateFormat: "d/m/Y", // Adjust the date format as per your requirement
      defaultDate: new Date(),
    });
  }

  getDayDetails(dayId: string) {
    this._dayService.getDayDetails(dayId).subscribe({
      next: (res: any) => {
        console.log("res : ", res);

        this.patchValues(res[0]);
        this.dayDetails = res[0];
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
      this.dayDetailsForm.controls["dayId"].patchValue(res["birthdayId"]);
      this.dayDetailsForm.controls["personName"].patchValue(res["personName"]);
      this.dayDetailsForm.controls["dayTypeId"].patchValue(res["dayTypeId"]);
      this.dayDetailsForm.controls["birthdate"].patchValue(
        this.datepipe.transform(res["birthdate"], "dd/MM/yyyy")
      );
      this.dayDetailsForm.controls["mobileNumber"].patchValue(
        res["mobileNumber"]
      );
      this.dayDetailsForm.controls["mobileNumber2"].patchValue(
        res["mobileNumber2"]
      );
      this.dayDetailsForm.controls["emailId"].patchValue(res["emailId"]);
      this.dayDetailsForm.controls["address"].patchValue(res["address"]);
      this.dayDetailsForm.controls["gender"].patchValue(res["gender"]);
      this.dayDetailsForm.controls["image"].patchValue(res["image"]);
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
    if (!this.dayDetailsForm.valid) {
      this.toaster.showMessage("Please fill valid details.", "error");
      return;
    } else {
      try {
        if (
          typeof this.dayDetailsForm.value["birthdate"] === "string" &&
          this.dayDetailsForm.value["birthdate"].includes("/")
        ) {
          const [day, month, year] = this.dayDetailsForm.value["birthdate"]
            ?.split("/")
            .map(Number);
          this.dayDetailsForm.value["birthdate"] = new Date(
            Date.UTC(year, month - 1, day)
          ); // month is 0-indexed
        }
        // this.dayDetailsForm.value['birthdate'] = selectedDate;

        if (this.formData) {
          this.addImage();
        }
      } catch (error) {
        //this._globalService.openSnackBar("Error in adding data : " + error);
        console.error("Error in adding data : ", error);
      }
    }
  }

  openDetailsPopup(dayId: any) {
    this.loaderService.showLoader();

    this._globalService.getCommonListItems(DBConstants.DAYTYPE).subscribe({
      next: (res: any) => {
        this.dayType = res;
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
    if (dayId) {
      this.getDayDetails(dayId);
    }
  }
  closePopup() {
    const model = document.getElementById("dayDetailsPopup");
    if (model !== null) {
      model.style.display = "none";
    }
    this.dayDetailsForm.reset();
    this.selectedImage = "";
    this.renderer
      .selectRootElement(this.btnCloseDayPopup?.nativeElement)
      .click();
  }

  addDayDetails() {
    this._dayService.addDay(this.dayDetailsForm.value).subscribe({
      next: () => {
        this.toaster.showMessage("Record Added Successfully.", "success");
        this.loaderService.hideLoader();
        this.renderer
          .selectRootElement(this.btnCloseDayPopup?.nativeElement)
          .click();
        this._globalService.triggerGridReload(ApplicationModules.DAY);
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage("Some issue is in Add the data.", "error");
        return;
      },
    });
  }
  updateDayDetails() {
    this._dayService.updateDay(this.dayDetailsForm.value).subscribe({
      next: (res: any) => {
        this.toaster.showMessage("Record Updated Successfully.", "success");
        this.loaderService.hideLoader();
        this.renderer
          .selectRootElement(this.btnCloseDayPopup?.nativeElement)
          .click();
        this._globalService.triggerGridReload(ApplicationModules.DAY);
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage("Some issue is in Update the data.", "error");
        //this._globalService.openSnackBar('some issue is in update the data');
        return;
      },
    });
  }

  addOrUpdateDayDetails() {
    if (this.dayDetailsForm.value["dayId"] > 0) {
      this.updateDayDetails();
    } else {
      this.addDayDetails();
    }
  }
  addImage() {
    if (this.selectedImageFile) {
      this._dayService
        .uploadImage(
          this.dayDetailsForm.value["assetId"],
          API_URL.BIRTHDAYPERSONPIC,
          this.formData
        )
        .subscribe({
          next: (res: any) => {
            this.dayDetailsForm.value["assetId"] = res;
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
