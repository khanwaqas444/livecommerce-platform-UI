import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  private baseUrl = 'http://localhost:8090/api/streams';

  constructor(private http: HttpClient) {}

  // ================================================================
  // BASIC CRUD
  // ================================================================

  getStreamsByHost(hostId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/host/${hostId}`);
  }

  getStreamById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getLiveStreams(): Observable<any> {
    return this.http.get(`${this.baseUrl}/live`);
  }

  createStream(body: any): Observable<any> {
    return this.http.post(this.baseUrl, body);
  }

  startStream(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/start`, {});
  }

  endStream(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/end`, {});
  }

  // ================================================================
  // PRODUCTS
  // ================================================================

  pinProduct(id: string, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/products`, body);
  }

  getStreamProducts(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/products`);
  }

  // ================================================================
  // ANALYTICS
  // ================================================================

  getAnalytics(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/analytics`);
  }

  // ================================================================
  // YOUTUBE STREAM MODES
  // file, camera, screen, custom
  // ================================================================

  startYouTubeStream(id: string, mode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/youtube/start`, {
      mode: mode
    });
  }
}
