import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import Cropper from 'cropperjs';
import { API_URL } from "../../../utils/api-url";
import { ActionConstant, ApplicationModules, DdlConfig, NavigationURLs } from "../../../utils/application-constants";
import { CoinNoteCollectionRequest } from "../../interfaces/coin-note-collection-request";
import { AssetService } from "../../services/asset/asset.service";
import { CurrencyCoinService } from "../../services/currency-coin/currency-coin.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";


@Component({
  selector: "app-currency-details",
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: "./currency-coin-details.component.html",
  styleUrls: ["./currency-coin-details.component.scss"],
})
export class CurrencyCoinDetailsComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseDetailsPopup") btnCloseDayPopup!: ElementRef;

  @ViewChild('cropImage') imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('dropFileInput') dropFileInput!: any;
  selectedImage!: string | ArrayBuffer | null;
  cropper!: Cropper;
  croppedImage: any = null;
  showPreview: boolean = false;
  originalImageData: any = null; // Save original to re-edit

  currencyCoinDetailsForm: FormGroup;
  user: any;
  countryList: any;
  currencyTypeList: any;
  collectionCoinId: string = "";
  selectedImageFile: File | null = null;
  fil: File | null = null;
  currencyCoinDetails: any;
  assetDetails: any;
  isSaving: boolean = false;
  coinNoteCollectionRequest: CoinNoteCollectionRequest = {
  }
  ActionConstant = ActionConstant;
  originalFileName: string = '';
  editable: boolean = false;
  constructor(
    private _details: FormBuilder,
    private _currencyCoinService: CurrencyCoinService,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    public globalService: GlobalService,
    private renderer: Renderer2,
    private _assetService: AssetService,
  ) {
    this.currencyCoinDetailsForm = this._details.group<any>({
      collectionCoinId: '',
      coinNoteName: [
        "",
        [Validators.required],
      ],
      collectionCoinType: [null, Validators.required],
      countryId: [0, Validators.required],
      address: "",
      assetId: null,
      picture: null,
      coinWeightInGrams: [0],
      actualValue: [0],
      indianValue: [0],
      printedYear: [null],
      speciality: [""],
      diameterOfCoin: [0],
      lengthOfNote: [0],
      breadthOfNote: [0],
      description: [""],
      extractedText: [""],
      generatedDescription: [""],
      metalsUsed: [""],
      isVerified: [false],
      isEditable: [false],
    });
  }

  ngOnInit(): void { }

  openDetailsPopup(currencyCoinId: string) {

    this.loaderService.showLoader();
    this.currencyTypeList = this.localStorageService.getCommonListItems(DdlConfig.COIN_TYPES);

    this.countryList = this.localStorageService.getCountryList();

    this.currencyCoinDetailsForm?.reset();
    const model = document.getElementById("detailsPopup");
    if (model !== null) {
      model.style.display = "block";
    }
    if (currencyCoinId) {
      this.getCurrencyCoinDetails(currencyCoinId);
    }
    else {
      this.loaderService.hideLoader();

    }
  }

  closePopup() {
    const model = document.getElementById("detailsPopup");
    if (model) {
      this.renderer.setStyle(model, "display", "none");
    }
    this.currencyCoinDetailsForm.reset();
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

  getCurrencyCoinDetails(collectionCoinId: string) {
    this._currencyCoinService
      .getCurrencyCoinDetails(collectionCoinId)
      .subscribe({
        next: (res: any) => {
          this.patchValues(res.data);
          this.currencyCoinDetails = res.data;

          if (this.currencyCoinDetails?.assetId) {
            this.getAssetDetails(this.currencyCoinDetails.assetId);
            this.loaderService.hideLoader();
          }
          this.loaderService.hideLoader();
        },
        error: (err) => {
          this.loaderService.hideLoader();
        }
      });
  }

  getAssetDetails(assetId: string) {
    this._assetService.getAssetDetails(assetId).subscribe({
      next: (res: any) => {
        this.selectedImage = res.data.originalPath;
        this.croppedImage = res.data.originalPath;
        this.showPreview = true;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        this.showPreview = false;
        this.loaderService.hideLoader();
      },
    });
  }

  patchValues(res: any) {
    if (res != undefined) {
      this.currencyCoinDetailsForm.controls["collectionCoinId"].patchValue(
        res["id"]
      );
      this.currencyCoinDetailsForm.controls["collectionCoinType"].patchValue(
        res["collectionCurrencyTypeId"]
      );
      this.currencyCoinDetailsForm.controls["coinNoteName"].patchValue(
        res["coinNoteName"]
      );
      this.currencyCoinDetailsForm.controls["countryId"].patchValue(
        res["countryId"]
      );
      this.currencyCoinDetailsForm.controls["coinWeightInGrams"].patchValue(
        res["coinWeightInGrams"]
      );
      this.currencyCoinDetailsForm.controls["actualValue"].patchValue(
        res["actualValue"]
      );
      this.currencyCoinDetailsForm.controls["indianValue"].patchValue(
        res["indianValue"]
      );
      this.currencyCoinDetailsForm.controls["printedYear"].patchValue(
        res["printedYear"]
      );
      this.currencyCoinDetailsForm.controls["speciality"].patchValue(
        res["speciality"]
      );
      this.currencyCoinDetailsForm.controls["diameterOfCoin"].patchValue(
        res["diameterOfCoin"]
      );
      this.currencyCoinDetailsForm.controls["lengthOfNote"].patchValue(
        res["lengthOfNote"]
      );
      this.currencyCoinDetailsForm.controls["breadthOfNote"].patchValue(
        res["breadthOfNote"]
      );
      this.currencyCoinDetailsForm.controls["description"].patchValue(
        res["description"]
      );
      this.currencyCoinDetailsForm.controls["extractedText"].patchValue(
        res["extractedText"]
      );
      this.currencyCoinDetailsForm.controls["generatedDescription"].patchValue(
        res["generatedDescription"]
      );

      this.currencyCoinDetailsForm.controls["metalsUsed"].patchValue(
        res["metalsUsed"]
      );
      this.currencyCoinDetailsForm.controls["picture"].patchValue(res["image"]);
      this.currencyCoinDetailsForm.controls["assetId"].patchValue(
        res["assetId"]
      );
      this.currencyCoinDetailsForm.controls["isVerified"].patchValue(
        res["isVerified"]
      );
      this.currencyCoinDetailsForm.controls["isEditable"].patchValue(
        res["isEditable"]
      );
    }
  }

  submitCurrencyCoinDetails() {
    this.isSaving = true;
    this.loaderService.showLoader();
    this.globalService.trimAllFields(this.currencyCoinDetailsForm);
    this.coinNoteCollectionRequest = {
      id: this.currencyCoinDetailsForm.value["collectionCoinId"],
      coinNoteName: this.currencyCoinDetailsForm.value["coinNoteName"],
      collectionCoinTypeId: this.currencyCoinDetailsForm.value["collectionCoinType"],
      countryId: this.currencyCoinDetailsForm.value["countryId"],
      metalsUsed: this.currencyCoinDetailsForm.value["metalsUsed"],
      coinWeightInGrams: this.currencyCoinDetailsForm.value["coinWeightInGrams"],
      actualValue: this.currencyCoinDetailsForm.value["actualValue"],
      indianValue: this.currencyCoinDetailsForm.value["indianValue"],
      printedYear: this.currencyCoinDetailsForm.value["printedYear"],
      speciality: this.currencyCoinDetailsForm.value["speciality"],
      diameterOfCoin: this.currencyCoinDetailsForm.value["diameterOfCoin"],
      lengthOfNote: this.currencyCoinDetailsForm.value["lengthOfNote"],
      breadthOfNote: this.currencyCoinDetailsForm.value["breadthOfNote"],
      description: this.currencyCoinDetailsForm.value["description"],
      extractedText: this.currencyCoinDetailsForm.value["extractedText"],
      generatedDescription: this.currencyCoinDetailsForm.value["generatedDescription"],
      assetId: this.currencyCoinDetailsForm.value["assetId"],
    };

    if (!this.currencyCoinDetailsForm.valid) {
      this.isSaving = false;
      this.loaderService.hideLoader();
      this.toaster.showMessage("Please fill all required fields.", "error");
      return;
    } else {
      try {
        if (this.selectedImageFile) {
          this.uploadImageAndSaveData();
        }
      } catch (error) {
        this.isSaving = false;
        this.loaderService.hideLoader();
        this.toaster.showMessage("Error in adding data.", "error");
        console.error("Error in adding data : ", error);
      }
    }
  }

  addCurrencyCoinDetails() {
    this._currencyCoinService
      .addCurrencyCoin(this.coinNoteCollectionRequest)
      .subscribe({
        next: (res: any) => {
          this.toaster.showMessage("Record Updated Successfully.", "success");
          this.loaderService.hideLoader();
          this.renderer
            .selectRootElement(this.btnCloseDayPopup?.nativeElement)
            .click();
          this.isSaving = false;
          localStorage.removeItem(NavigationURLs.CURRENCY_LIST);
          localStorage.removeItem(NavigationURLs.CURRENCY_SUMMARY);
          this.globalService.triggerGridReload(ApplicationModules.COIN_NOTE_COLLECTION);
        },
        error: (error: any) => {
          this.isSaving = false;
          this.loaderService.hideLoader();
          this.toaster.showMessage(error?.message, "error");
          return;
        },
      });
  }
  updateCurrencyCoinDetails() {
    this._currencyCoinService.updateCurrencyCoin(this.coinNoteCollectionRequest).subscribe({
      next: (res: any) => {
        this.toaster.showMessage("Record Updated Successfully.", "success");
        this.loaderService.hideLoader();
        this.isSaving = false;
        this.renderer
          .selectRootElement(this.btnCloseDayPopup?.nativeElement)
          .click();
        localStorage.removeItem(NavigationURLs.CURRENCY_LIST);
        localStorage.removeItem(NavigationURLs.CURRENCY_SUMMARY);
        this.globalService.triggerGridReload(ApplicationModules.COIN_NOTE_COLLECTION);
      },
      error: (error: any) => {
        this.isSaving = false;
        this.loaderService.hideLoader();
        this.toaster.showMessage(error?.message, "error");
        return;
      },
    });
  }

  addOrUpdateCurrencyCoinDetails() {
    if (this.coinNoteCollectionRequest.id) {
      this.updateCurrencyCoinDetails();
    } else {
      this.addCurrencyCoinDetails();
    }
  }
  uploadImageAndSaveData() {
    if (this.selectedImageFile) {
      const formData = new FormData();
      formData.append('file', this.selectedImageFile);

      this._assetService.uploadImage(this.currencyCoinDetailsForm.value["assetId"], API_URL.COLLECTIONCOINS, formData)
        .subscribe({
          next: (res: any) => {
            if (this.currencyCoinDetailsForm.value["assetId"] == null || this.currencyCoinDetailsForm.value["assetId"] == undefined) {
              this.currencyCoinDetailsForm.value["assetId"] = res.data;
              this.coinNoteCollectionRequest.assetId = res.data;

              this.addOrUpdateCurrencyCoinDetails();
            }
            else {
              this.isSaving = false;
            }
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            this.isSaving = false;
            this.toaster.showMessage(error?.message, "error");
            this.loaderService.hideLoader();
          },
        });
    } else {
      this.addOrUpdateCurrencyCoinDetails();
    }
  }

  DownloadImage() {
    console.log('this.selectedImage : ', this.selectedImage);
    const link = document.createElement('a');
    link.href = this.selectedImage?.toString() || '';
    link.download = "image.png";
    link.click();
  }

  ngOnDestroy(): void {
    if (this.cropper) this.cropper.destroy();
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
