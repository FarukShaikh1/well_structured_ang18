import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpService } from './http.service';
import { HttpHeaders, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [HttpService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request with correct URL, params, and headers', () => {
    const url = 'https://api.example.com/data';
    const params = new HttpParams().set('key', 'value');
    const headers = new HttpHeaders().set('Authorization', 'Bearer token');

    service.get(url, params, headers).subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === url &&
        request.params.has('key') &&
        request.headers.has('Authorization')
    );

    expect(req.request.method).toBe('GET');
    req.flush({}); // Mocking an empty response
  });

  it('should make a POST request with correct URL, body, and headers', () => {
    const url = 'https://api.example.com/data';
    const requestBody = { key: 'value' };
    const headers = new HttpHeaders().set('Authorization', 'Bearer token');

    service.post(url, requestBody, headers).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url === url && request.headers.has('Authorization')
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestBody);
    req.flush({}); // Mocking an empty response
  });

  it('should make a PUT request with correct URL, body, and headers', () => {
    const url = 'https://api.example.com/data';
    const requestBody = { key: 'new-value' };
    const headers = new HttpHeaders().set('Authorization', 'Bearer token');

    service.put(url, requestBody, headers).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url === url && request.headers.has('Authorization')
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestBody);
    req.flush({}); // Mocking an empty response
  });

  it('should make a DELETE request with correct URL and headers', () => {
    const url = 'https://api.example.com/data/1';
    const headers = new HttpHeaders().set('Authorization', 'Bearer token');

    service.delete(url, headers).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url === url && request.headers.has('Authorization')
    );

    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Mocking an empty response
  });
});
