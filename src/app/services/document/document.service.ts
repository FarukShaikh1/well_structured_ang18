import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { LocalStorageConstants } from "../../../utils/application-constants";
import { SpecialOccasionRequest } from "../../interfaces/special-occasion-request";
import { DocumentItem } from "../../interfaces/document-item";
@Injectable({
  providedIn: "root",
})
export class DocumentService {
  loggedInUserId: string;
  constructor(private http: HttpClient) {
    this.loggedInUserId = String(localStorage.getItem(LocalStorageConstants.USERID));
  }

  getDocumentList() {
    const params = new HttpParams()
      .set("userid", String(localStorage.getItem(LocalStorageConstants.USERID)))
    //   .set("documentItem", JSON.stringify(DocumentItem));
    return this.http.get(API_URL.GET_DOCUMENT_List, { params: params });
  }

  /**
* Backend endpoint that returns a short-lived SAS URL or redirect URL for direct access to blob.
* Using SAS makes preview and download fast and does not stream through backend.
*/
  getSasUrl(documentId: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${API_URL.GET_DOCUMENT_SAS_URL}${documentId}`);
  }

  addDocument(specialOccasionRequest: SpecialOccasionRequest): Observable<any> {
    specialOccasionRequest.id = null;
    return this.http.post(
      API_URL.ADD_SPECIAL_OCCASION + this.loggedInUserId,
      specialOccasionRequest
    );
  }
  upload(formData: FormData) {
    return this.http.post(API_URL.UPLOAD_DOCUMENT + this.loggedInUserId, formData);
  }

  updateDocument(specialOccasionRequest: SpecialOccasionRequest): Observable<any> {
    return this.http.post(API_URL.UPDATE_SPECIAL_OCCASION + String(localStorage.getItem(LocalStorageConstants.USERID)), specialOccasionRequest);
  }

  deleteDocument(dayId: string): Observable<any> {
    return this.http.get(
      API_URL.DELETE_SPECIAL_OCCASION +
      dayId +
      "&userId=" +
      String(localStorage.getItem(LocalStorageConstants.USERID))
    );
  }

  approveDocument(dayId: string): Observable<any> {
    return this.http.get(
      API_URL.APPROVE_SPECIAL_OCCASION +
      dayId +
      "&userId=" +
      String(localStorage.getItem(LocalStorageConstants.USERID))
    );
  }
}
