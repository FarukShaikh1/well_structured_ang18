import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { API_URL } from "../../../utils/api-url";
import { LocalStorageConstants } from "../../../utils/application-constants";
import { DocumentRequest } from "../../interfaces/document-request";
@Injectable({
  providedIn: "root",
})
export class DocumentService {
  constructor(private http: HttpClient) {
  }

  getDocumentList() {
    return this.http.get(API_URL.GET_DOCUMENT_List);
  }

  /**
* Backend endpoint that returns a short-lived SAS URL or redirect URL for direct access to blob.
* Using SAS makes preview and download fast and does not stream through backend.
*/
  getDownloadUrl(documentId: string, fileName:string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(
      `${API_URL.GET_DOCUMENT_DOWNLOAD_SAS_URL}${documentId}`
      // `${API_URL.GET_DOCUMENT_DOWNLOAD_SAS_URL}${documentId}&fileName=${encodeURIComponent(fileName)}`
    );
  }

  // addDocument(documentRequest: DocumentRequest): Observable<any> {
  //   documentRequest.id = null;
  //   return this.http.post(
  //     API_URL.ADD_DOCUMENT,
  //     documentRequest
  //   );
  // }
  uploadDocument(formData: FormData) {
    return this.http.post(API_URL.UPLOAD_DOCUMENT, formData);
  }

  updateDocument(documentRequest: DocumentRequest): Observable<any> {
    return this.http.post(API_URL.UPDATE_DOCUMENT, documentRequest);
  }

  deleteDocument(docId: string): Observable<any> {
    return this.http.delete(
      API_URL.DELETE_DOCUMENT +
      docId
    );
  }

  approveDocument(dayId: string): Observable<any> {
    return this.http.get(
      API_URL.APPROVE_SPECIAL_OCCASION +
      dayId);
  }
}
