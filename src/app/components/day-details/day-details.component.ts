import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
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
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from "../../../utils/api-url";
import {
  ActionConstant,
  ApplicationConstants,
  ApplicationModules,
  DdlConfig,
  LocalStorageConstants,
  NavigationURLs,
  UserConfig
} from "../../../utils/application-constants";
import { DateUtils } from "../../../utils/date-utils";
import { SpecialOccasionRequest } from "../../interfaces/special-occasion-request";
import { AssetService } from "../../services/asset/asset.service";
import { ConfigurationService } from "../../services/configuration/configuration.service";
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
export class DayDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseDetailsPopup") btnCloseDayPopup!: ElementRef;
  startDate = new Date();
  dayDetailsForm: FormGroup;
  user: any;
  occasionTypeList: any;
  relationList: any;
  loggedInUserId: string = "";
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
    occasionTypeId: '',
    relationId: '',
    mobileNumber: '',
    contactNumber: '',
    emailId: '',
    gender: '',
    address: '',
    assetId: ''
  }
  ActionConstant = ActionConstant;
  private subscriptions = new Subscription();
  constructor(
    private _details: FormBuilder,
    private _dayService: DayService,
    private loaderService: LoaderService,
    private _assetService: AssetService,
    public configService: ConfigurationService,
    public globalService: GlobalService,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    this.dayDetailsForm = this._details.group<any>({
      specialOccasionId: '',
      personName: ["",
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-&() ]{3,60}$/)],
      ],
      occasionTypeId: ["", Validators.required],
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
        this.formData.set("file", file);

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
    this.dayDetailsForm.controls["specialOccasionDate"].patchValue(this.datepipe.transform(this.startDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngAfterViewInit() {
    flatpickr("#specialOccasionDate", {
      dateFormat: "d/m/Y",
      defaultDate: new Date(),
    });
  }

  getDayDetails(specialOccasionId: string) {
    this.loaderService.showLoader();
    this.subscriptions.add(this._dayService.getDayDetails(specialOccasionId).pipe(
      tap((res: any) => {
        this.dayDetails = res.data;
        this.patchValues(res.data);
        if (this.dayDetails?.assetId) {
          this.getAssetDetails(this.dayDetails.assetId);
        } else {
          this.loaderService.hideLoader();
        }
      }),
      catchError((error: any) => {
        this.showError("Error fetching day details.");
        return of(null);
      })
    ).subscribe());
  }
  getAssetDetails(assetId: string) {
    this.subscriptions.add(this._assetService.getAssetDetails(assetId).pipe(
      tap((res: any) => {
        this.selectedImage = API_URL.ATTACHMENT + res.data.originalPath;
        this.loaderService.hideLoader();
      }),
      catchError((error: any) => {
        this.showError("Error fetching asset details.");
        return of(null);
      })
    ).subscribe());
  }

  patchValues(res: any) {
    if (res) {
      this.isApprovable = res["isApprovable"];
      this.isVerified = res["isVerified"];
      this.dayDetailsForm.patchValue({
        specialOccasionId: res["id"],
        personName: res["personName"],
        occasionTypeId: res["dayTypeId"],
        relationId: res["relationId"],
        specialOccasionDate: this.datepipe.transform(res["specialOccasionDate"], ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT),
        mobileNumber: res["mobileNumber"],
        contactNumber: res["contactNumber"],
        emailId: res["emailId"],
        address: res["address"],
        gender: res["gender"] ?? 'M',
        assetId: res["assetId"],
        createdBy: res["createdBy"],
        createdOn: res["createdOn"],
        modifiedBy: res["modifiedBy"],
        modifiedOn: res["modifiedOn"],
      });
    }
  }

  submitDayDetails() {
    this.loaderService.showLoader();
    this.globalService.trimAllFields(this.dayDetailsForm);

    if (this.dayDetailsForm.invalid) {
      this.showError("Please fill valid details.");
      return;
    }

    this.specialOccasionRequest = {
      id: this.dayDetailsForm.value["specialOccasionId"] ?? null,
      specialOccasionDate: DateUtils.CorrectedDate(this.dayDetailsForm.value["specialOccasionDate"]),
      personName: this.dayDetailsForm.value["personName"],
      occasionTypeId: this.dayDetailsForm.value["occasionTypeId"],
      relationId: this.dayDetailsForm.value["relationId"],
      mobileNumber: this.dayDetailsForm.value["mobileNumber"],
      contactNumber: this.dayDetailsForm.value["contactNumber"],
      emailId: this.dayDetailsForm.value["emailId"],
      gender: this.dayDetailsForm.value["gender"],
      address: this.dayDetailsForm.value["address"],
      assetId: this.dayDetailsForm.value["assetId"],
    };

    if (this.selectedImageFile) {
      this.uploadImageAndSaveData();
    } else {
      this.addOrUpdateDayDetails();
    }
  }

  loadOccasionTypeList() {
    this.occasionTypeList = this.globalService.getConfigList(DdlConfig.OCCASION_TYPES);
  }
  loadRelationList() {
    this.relationList = this.globalService.getConfigList(DdlConfig.RELATIONS);
  }

  openDetailsPopup(specialOccasionId: any) {
    this.loaderService.showLoader();
    this.loggedInUserId = localStorage.getItem(LocalStorageConstants.USERID) || '';
    this.loadOccasionTypeList();
    this.loadRelationList();
    const model = document.getElementById("detailsPopup");
    if (model) {
      this.renderer.setStyle(model, "display", "block");
      this.loaderService.hideLoader();
    }
    if (specialOccasionId) {
      this.getDayDetails(specialOccasionId);
    }
  }
  closePopup() {
    const model = document.getElementById("detailsPopup");
    if (model) {
      this.renderer.setStyle(model, "display", "none");
    }
    this.dayDetailsForm.reset();
    this.selectedImage = null;
    this.selectedImageFile = null;
    this.formData = new FormData();
  }

  addDayDetails() {
    this.subscriptions.add(this._dayService.addDay(this.specialOccasionRequest).pipe(
      tap(() => {
        this.showSuccess("Record Added Successfully.");
        this.renderer.selectRootElement(this.btnCloseDayPopup?.nativeElement).click();
        localStorage.removeItem(NavigationURLs.DAY_LIST);
        localStorage.removeItem(NavigationURLs.USER_LIST);
        this.globalService.triggerGridReload(ApplicationModules.DAY);
      }),
      catchError((error) => {
        this.showError("Some issue is in Add the data.");
        return of(null);
      })
    ).subscribe());
  }
  updateDayDetails() {
    this.subscriptions.add(this._dayService.updateDay(this.specialOccasionRequest).pipe(
      tap(() => {
        this.showSuccess("Record Updated Successfully.");
        this.renderer.selectRootElement(this.btnCloseDayPopup?.nativeElement).click();
        localStorage.removeItem(NavigationURLs.DAY_LIST);
        localStorage.removeItem(NavigationURLs.USER_LIST);
        this.globalService.triggerGridReload(ApplicationModules.DAY);
      }),
      catchError((error) => {
        this.showError("Some issue is in Update the data.");
        return of(null);
      })
    ).subscribe());
  }

  addOrUpdateDayDetails() {
    if (!this.specialOccasionRequest.assetId)
      this.specialOccasionRequest.assetId = null;

    if (this.specialOccasionRequest.id) {
      this.updateDayDetails();
    } else {
      this.addDayDetails();
    }
    this.formData = new FormData();
  }
  uploadImageAndSaveData() {
    const assetId = this.dayDetailsForm.value["assetId"];
    this.subscriptions.add(this._assetService.uploadImage(assetId, API_URL.BIRTHDAYPERSONPIC, this.formData).pipe(
      tap((res: any) => {
        this.specialOccasionRequest.assetId = res.data;
        this.addOrUpdateDayDetails();
      }),
      catchError((error) => {
        this.showError("Error uploading image.");
        return of(null);
      })
    ).subscribe());
  }
  private showError(message: string): void {
    this.loaderService.hideLoader();
    this.toaster.showMessage(message, "error");
  }

  private showSuccess(message: string): void {
    this.loaderService.hideLoader();
    this.toaster.showMessage(message, "success");
  }
}