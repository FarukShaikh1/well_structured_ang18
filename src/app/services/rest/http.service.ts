import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(
    url: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.get<T>(url, { params, headers });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers });
  }

  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(url, body, { headers });
  }

  delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(url, { headers });
  }

  patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(url, body, { headers });
  }

  // New method to handle FormData requests
  postFormData<T>(
    url: string,
    formData: FormData,
    headers?: HttpHeaders
  ): Observable<T> {
    // Set the content type to 'multipart/form-data' (optional, as the browser sets it automatically)
    const options = headers ? { headers } : {};
    return this.http.post<T>(url, formData, options);
  }
  // Generic method for downloading a blob
  downloadBlob(
    url: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<HttpResponse<Blob>> {
    return this.http.get<Blob>(url, {
      params,
      headers,
      observe: 'response', // Observe full response
      responseType: 'blob' as 'json', // Explicitly specify responseType as 'blob'
    });
  }
  downloadReport(url: string): Observable<HttpResponse<Blob>> {
    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
