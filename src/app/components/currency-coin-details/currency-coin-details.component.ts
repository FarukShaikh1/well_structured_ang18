import { CommonModule, DatePipe } from "@angular/common";
import { GlobalService } from "../../services/global/global.service";
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { API_URL } from "../../../utils/api-url";
import { AssetService } from "../../services/asset/asset.service";
import { CurrencyCoinService } from "../../services/currency-coin/currency-coin.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";
import { LoaderService } from "../../services/loader/loader.service";
import { ApplicationModules, DBConstants } from "../../../utils/application-constants";
import { CoinNoteCollectionRequest } from "../../interfaces/coin-note-collection-request";


@Component({
  selector: "app-currency-details",
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: "./currency-coin-details.component.html",
  styleUrls: ["./currency-coin-details.component.scss"],
})
export class CurrencyCoinDetailsComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  @ViewChild("btnCloseCoinDetailsPopup") btnCloseDayPopup!: ElementRef;
  currencyCoinDetailsForm: FormGroup;
  user: any;
  countryList: any;
  currencyTypeList: any;
  collectionCoinId: string = "";
  selectedImage!: string | ArrayBuffer | null;
  selectedImageFile: File | null = null;
  fil: File | null = null;
  formData: FormData = new FormData();
  currencyCoinDetails: any;
  assetDetails: any;
  coinNoteCollectionRequest: CoinNoteCollectionRequest = {
  }

  constructor(
    private _details: FormBuilder,
    private _currencyCoinService: CurrencyCoinService,
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
      collectionCoinType: [null, Validators.required], // Already present
      countryId: [0, Validators.required],
      address: "", // Already present
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
      metalsUsed: [""],
      isVerified: [false],
      isEditable: [false],
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

  ngOnInit(): void { }

  openDetailsPopup(currencyCoinId: string) {
    this.loaderService.showLoader();
    this.globalService.getCommonListItems(DBConstants.COINTYPE).subscribe({
      next: (res: any) => {
        this.currencyTypeList = res;
        console.log('currencyTypeList : ', this.currencyTypeList);

        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });

    this.globalService.getCountryList().subscribe({
      next: (res: any) => {
        this.countryList = res;
        this.loaderService.hideLoader();
      },
      error: (error: any) => {
        console.log("error : ", error);
        this.loaderService.hideLoader();
      },
    });

    this.currencyCoinDetailsForm?.reset();
    const model = document.getElementById("currencyCoinDetailsPopup");
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
    const model = document.getElementById("currencyCoinDetailsPopup");
    if (model !== null) {
      model.style.display = "none";
    }
    this.currencyCoinDetailsForm.reset();
    this.selectedImage = "";
    this.selectedImageFile = null;
    this.renderer
      .selectRootElement(this.btnCloseDayPopup?.nativeElement)
      .click();

  }



  getCurrencyCoinDetails(collectionCoinId: string) {
    this._currencyCoinService
      .getCurrencyCoinDetails(collectionCoinId)
      .subscribe({
        next: (res: any) => {
          console.log("res : ", res);
          this.patchValues(res);
          this.currencyCoinDetails = res;
          console.log("this.currencyCoinDetails?.assetId : ", this.currencyCoinDetails?.assetId);

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
    debugger
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
      assetId: this.currencyCoinDetailsForm.value["assetId"],
    };

    if (!this.currencyCoinDetailsForm.valid) {
      //this.globalService.openSnackBar('Some issue is there');
      return;
    } else {
      try {
        if (this.formData) {
          this.uploadImageAndSaveData();
        }
      } catch (error) {
        //this.globalService.openSnackBar("Error in adding data : " + error);
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
          this.globalService.triggerGridReload(ApplicationModules.COIN_NOTE_COLLECTION);
        },
        error: (error: any) => {
          this.loaderService.hideLoader();
          this.toaster.showMessage("Some issue is in Update the data.", "error");
          //this.globalService.openSnackBar('some issue is in update the data');
          return;
        },
      });
  }
  updateCurrencyCoinDetails() {
    this._currencyCoinService.updateCurrencyCoin(this.coinNoteCollectionRequest).subscribe({
      next: (res: any) => {
        this.toaster.showMessage("Record Updated Successfully.", "success");
        this.loaderService.hideLoader();
        this.renderer
          .selectRootElement(this.btnCloseDayPopup?.nativeElement)
          .click();
        this.globalService.triggerGridReload(ApplicationModules.COIN_NOTE_COLLECTION);
      },
      error: (error: any) => {
        this.loaderService.hideLoader();
        this.toaster.showMessage("Some issue is in Update the data.", "error");
        //this.globalService.openSnackBar('some issue is in update the data');
        return;
      },
    });
  }

  addOrUpdateCurrencyCoinDetails() {
    if (this.coinNoteCollectionRequest.id) {
      this.updateCurrencyCoinDetails();
      this.formData = new FormData();
    } else {
      this.addCurrencyCoinDetails();
      this.formData = new FormData();
    }
  }
  uploadImageAndSaveData() {
    if (this.selectedImageFile) {
      this._assetService.uploadImage(this.currencyCoinDetailsForm.value["assetId"], API_URL.COLLECTIONCOINS, this.formData)
        .subscribe({
          next: (res: any) => {
            this.currencyCoinDetailsForm.value["assetId"] = res;
            this.coinNoteCollectionRequest.assetId = res;
            this.addOrUpdateCurrencyCoinDetails();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log("error : ", error);
            this.loaderService.hideLoader();
          },
        });
    } else {
      this.addOrUpdateCurrencyCoinDetails();
    }
  }
}
