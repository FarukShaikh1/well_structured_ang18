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
import Cropper from 'cropperjs';
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
  NavigationURLs
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

  @ViewChild('cropImage') imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('dropFileInput') dropFileInput!: any;
  cropper!: Cropper;
  croppedImage: any = null;
  showPreview: boolean = false;
  originalImageData: any = null; // Save original to re-edit

  startDate = new Date();
  dayDetailsForm: FormGroup;
  occasionTypeList: any;
  relationList: any;
  loggedInUserId: string = "";
  specialOccasionId: string = "";
  selectedImage!: string | ArrayBuffer | null;
  selectedImageFile: File | null = null;
  originalFileName: string = '';
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
  editable: boolean = false;
  isSaving: boolean = false;
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

  ngOnInit(): void {
    this.dayDetailsForm.controls["specialOccasionDate"].patchValue(this.datepipe.transform(this.startDate, ApplicationConstants.GLOBAL_NUMERIC_DATE_FORMAT));
  }

  ngOnDestroy(): void {
    if (this.cropper) this.cropper.destroy();
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
        this.selectedImage = res.data.originalPath;
        this.croppedImage = res.data.originalPath;
        this.showPreview = true;
        this.originalImageData = res.data.originalPath;
        this.loaderService.hideLoader();
      }),
      catchError((error: any) => {
        this.showPreview = false;
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
    this.isSaving = true;
    this.loaderService.showLoader();
    this.globalService.trimAllFields(this.dayDetailsForm);

    if (this.dayDetailsForm.invalid) {
      this.isSaving = false;
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
    if (!this.occasionTypeList || this.occasionTypeList.length === 0) {
      this.globalService.setValuesInLocalStorage();
    }
  }

  loadRelationList() {
    this.relationList = this.globalService.getConfigList(DdlConfig.RELATIONS);
    if (!this.relationList || this.relationList.length === 0) {
      this.globalService.setValuesInLocalStorage();
    }
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
    if (this.cropper) this.cropper.destroy();
    this.selectedImageFile = null;
    this.editable = false;
    this.selectedImage = null;
    this.croppedImage = null;
    this.showPreview = false;
    this.originalImageData = null;
    this.renderer
      .selectRootElement(this.btnCloseDayPopup?.nativeElement)
      .click();
  }

  addDayDetails() {
    this.subscriptions.add(this._dayService.addDay(this.specialOccasionRequest).pipe(
      tap(() => {
        this.showSuccess("Record Added Successfully.");
        this.renderer.selectRootElement(this.btnCloseDayPopup?.nativeElement).click();
        localStorage.removeItem(NavigationURLs.DAY_LIST);
        localStorage.removeItem(NavigationURLs.USER_LIST);
        this.globalService.triggerGridReload(ApplicationModules.DAY);
        this.isSaving = false;
      }),
      catchError((error) => {
        this.showError("Some issue is in Add the data.");
        this.isSaving = false;
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
        this.isSaving = false;
      }),
      catchError((error) => {
        this.showError("Some issue is in Update the data.");
        this.isSaving = false;
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
  }

  uploadImageAndSaveData() {
    if (!this.selectedImageFile) {
      this.addOrUpdateDayDetails();
      this.isSaving = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedImageFile);

    const assetId = this.dayDetailsForm.value['assetId'];

    this.subscriptions.add(
      this._assetService.uploadImage(assetId, API_URL.BIRTHDAYPERSONPIC, formData)
        .pipe(
          tap((res: any) => {
            this.specialOccasionRequest.assetId = res.data;
            this.addOrUpdateDayDetails();
          }),
          catchError((error) => {
            this.isSaving = false;
            this.showError('Error uploading image. ' + error);
            return of(null);
          })
        ).subscribe()
    );
  }

  private showError(message: string): void {
    this.loaderService.hideLoader();
    this.toaster.showMessage(message, "error");
  }

  private showSuccess(message: string): void {
    this.loaderService.hideLoader();
    this.toaster.showMessage(message, "success");
  }

  DownloadImage() {
    console.log('this.selectedImage : ', this.selectedImage);
    const link = document.createElement('a');
    link.href = this.selectedImage?.toString() || '';
    link.download = "image.png";
    link.click();
  }

  // following functions are used 
  triggerFileInput() {
    if (!this.selectedImage) {
      this.dropFileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    this.editable = true;
    this.originalFileName = file.name;   // ✅ store original name
    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result;
      this.originalImageData = reader.result;
      this.showPreview = false;

      setTimeout(() => this.initCropper(), 200);
    };
    reader.readAsDataURL(file);
  }

  private initCropper() {
    if (this.cropper) this.cropper.destroy();

    const image = this.imageElement.nativeElement;

    this.cropper = new Cropper(image, {
      viewMode: 1,
      autoCropArea: 1,
      movable: true,
      zoomable: true,
      scalable: true,
      responsive: true
    });
  }

  onCropDone() {
    const canvas = this.cropper.getCroppedCanvas();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], this.originalFileName, { type: 'image/png' });
      this.selectedImageFile = file;

      this.croppedImage = URL.createObjectURL(blob);
      this.selectedImage = this.croppedImage;
      this.showPreview = true;
      this.cropper.destroy();
    }, 'image/png');
  }
  onDrop(event: any) {
    event.preventDefault();
    this.handleImageDrop(event.dataTransfer.files);
  }

  private handleImageDrop(files: FileList | null): void {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result;
      this.originalImageData = reader.result;
      this.showPreview = false;
      setTimeout(() => this.initCropper(), 200);
    };
    reader.readAsDataURL(file);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  editImage() {
    this.selectedImage = this.originalImageData;
    this.showPreview = false;
    setTimeout(() => this.initCropper(), 200);
  }
}