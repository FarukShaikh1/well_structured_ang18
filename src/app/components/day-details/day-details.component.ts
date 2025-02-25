import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { API_URL } from '../../../utils/api-url';
import { AssetService } from '../../services/asset/asset.service';
import { DayService } from '../../services/day/day.service';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-day-details',
  standalone: true,
  templateUrl: './day-details.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./day-details.component.scss'],
  providers: [DatePipe]
})
export class DayDetailsComponent implements OnInit {
  [x: string]: any;
  startDate = new Date();
  dayDetailsForm: FormGroup;
  user: any;
  relation: any;
  dayType: any;
  userId: number = 0;
  dayId: number = 0;
  selectedImage!: string | ArrayBuffer | null;
  selectedImageFile: File | null = null;
  fil: File | null = null;
  formData: FormData = new FormData();
  dayDetails: any;
  assetDetails: any;
  IsApprovable: boolean = false;
  IsVerified: boolean = false;

  constructor(private _details: FormBuilder, private _dayService: DayService, 
    private loaderService: LoaderService,
    private _assetService: AssetService,
    private datepipe: DatePipe
  ) {
    // this._httpClient.get(_globalService.getCommonListItems(API_URL.RELATION)).subscribe(res => {
    //   this.relation = res;
    // });

    // this._httpClient.get(_globalService.getCommonListItems(API_URL.DAYTYPE)).subscribe(res => {
    //   this.dayType = res;
    // });

    this.dayDetailsForm = this._details.group<any>({
      dayId: 0,
      personName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z. ]{3,40}$/)]],
      dayTypeId: [0, Validators.required],
      birthdate: ['', Validators.required],
      relationId: [0, Validators.required],
      mobileNumber: ['', Validators.pattern(/^[0-9]{8,12}$/)],
      mobileNumber2: ['', Validators.pattern(/^[0-9]{8,12}$/)],
      emailId: ['', Validators.pattern(/^[a-zA-Z_0-9.]{3,}@[a-zA-Z\-]{2,}[.]{1}[a-zA-Z.]{2,10}$/)],
      address: '',
      assetId: 0,
      gender: 0,
      image: null,
      createdBy: '',
      createdOn: '',
      modifiedBy: '',
      modifiedOn: ''

    })
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
      if (file.type.startsWith('image/')) {
        this.formData.append('file', file);

        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    }
  }

  ngOnInit(): void {
    this.dayDetailsForm.controls['birthdate'].patchValue(this.startDate);
  }
  ngAfterViewInit() {
    flatpickr('#birthdate', {
      dateFormat: 'd/m/Y', // Adjust the date format as per your requirement
      defaultDate: new Date(),
    });
  }

  getDayDetails(dayId: number) {
    this._dayService.getDayDetails(dayId)
      .subscribe({
        next: (res: any) => {
          this.patchValues(res[0]);
          this.dayDetails = res[0];
          if (this.dayDetails.AssetId) {
            this.getAssetDetails(this.dayDetails.AssetId);
            this.loaderService.hideLoader();
          }
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }
  getAssetDetails(assetId: number) {
    this._assetService.getAssetDetails(assetId)
      .subscribe({
        next: (res: any) => {
          this.selectedImage = API_URL.ATTACHMENT + res.OriginalPath;
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }

  patchValues(res: any) {
    if (res != undefined) {
      this.IsApprovable = res['IsApprovable'];
      this.IsVerified = res['IsVerified'];
      this.dayDetailsForm.controls['dayId'].patchValue(res['BirthdayId']);
      this.dayDetailsForm.controls['personName'].patchValue(res['PersonName']);
      this.dayDetailsForm.controls['relationId'].patchValue(res['SuperAdminRelationId']);
      this.dayDetailsForm.controls['dayTypeId'].patchValue(res['DayTypeId']);
      this.dayDetailsForm.controls['birthdate'].patchValue(this.datepipe.transform(res['Birthdate'], 'dd/MM/yyyy'));
      this.dayDetailsForm.controls['mobileNumber'].patchValue(res['MobileNumber']);
      this.dayDetailsForm.controls['mobileNumber2'].patchValue(res['ContactNumber']);
      this.dayDetailsForm.controls['emailId'].patchValue(res['EmailId']);
      this.dayDetailsForm.controls['address'].patchValue(res['Address']);
      this.dayDetailsForm.controls['gender'].patchValue(res['Gender']);
      this.dayDetailsForm.controls['image'].patchValue(res['Image']);
      this.dayDetailsForm.controls['assetId'].patchValue(res['AssetId']);
      // if(res['IsApprovable'] && !res['IsVerified']){
      this.dayDetailsForm.controls['createdOn'].patchValue(res['CreatedOn']);
      this.dayDetailsForm.controls['createdBy'].patchValue(res['CreatedBy']);
      this.dayDetailsForm.controls['modifiedOn'].patchValue(res['ModifiedOn']);
      this.dayDetailsForm.controls['modifiedBy'].patchValue(res['ModifiedBy']);
      // }
    }
  }

  submitDayDetails() {
    if (!this.dayDetailsForm.valid) {
      //this._globalService.openSnackBar('Some issue is there');
      return;
    }
    else {
      try {
        if (typeof this.dayDetailsForm.value['birthdate'] === 'string' && this.dayDetailsForm.value['birthdate'].includes('/')) {
          const [day, month, year] = this.dayDetailsForm.value['birthdate']?.split('/').map(Number);
          this.dayDetailsForm.value['birthdate'] = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed
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

  openDetailsPopup() {
    const model = document.getElementById('dayDetailsPopup');
    if (model !== null) {
      model.style.display = 'block';
    }
  }
  closePopup() {
    const model = document.getElementById('dayDetailsPopup');
    if (model !== null) {
      model.style.display = 'none';
    }
  }

  addDayDetails() {
    this._dayService.addDay(this.dayDetailsForm.value)
      .subscribe({
        next: () => {
          this.loaderService.hideLoader();
        },
        error: (error: any) => {
          console.log('error : ', error);
          this.loaderService.hideLoader();
        }
      });
  }
  updateDayDetails() {
    this._dayService.updateDay(this.dayDetailsForm.value)
      .subscribe({
        next: (res: any) => {
          if (res) {
            
            //this._globalService.openSnackBar("Record updated successfully");

          }
          else {
            //this._globalService.openSnackBar('some issue is in updating the data');
          }
        }
      });
  }

  addOrUpdateDayDetails() {
    if (this.dayDetailsForm.value['dayId'] > 0) {
      this.updateDayDetails()
    }
    else {
      this.addDayDetails();
    }
  }
  addImage() {
    if (this.selectedImageFile) {
      this._dayService.uploadImage(this.dayDetailsForm.value['assetId'], API_URL.BIRTHDAYPERSONPIC, this.formData)
        .subscribe({
          next: (res: any) => {
            this.dayDetailsForm.value['assetId'] = res;
            this.addOrUpdateDayDetails();
            this.loaderService.hideLoader();
          },
          error: (error: any) => {
            console.log('error : ', error);
            this.loaderService.hideLoader();
          }
        });
    }
    else {
      this.addOrUpdateDayDetails();
    }
  }

}
