import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id: number;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  people: number;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt?: string;
  reservationDate?: string;
  selected?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private baseUrl = 'http://localhost:8088/api/reservations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }

  getByDate(start: string, end: string): Observable<Reservation[]> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<Reservation[]>(`${this.baseUrl}/by-date`, { params });
  }

  filter(status?: string, product?: string, sortBy?: string): Observable<Reservation[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (product) params = params.set('product', product);
    if (sortBy) params = params.set('sortBy', sortBy);
    return this.http.get<Reservation[]>(`${this.baseUrl}/filter`, { params });
  }

  search(keyword: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/search`, {
      params: new HttpParams().set('keyword', keyword),
    });
  }

  getSummary(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/summary`);
  }

  getCalendar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/calendar`);
  }

  updateStatus(id: number, status: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/status`, null, {
      params: new HttpParams().set('status', status),
    });
  }

  sendReminders(ids: number[]): Observable<string> {
    return this.http.post(`${this.baseUrl}/reminder`, ids, { responseType: 'text' });
  }

  export(format: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/export`, {
      params: new HttpParams().set('format', format),
      responseType: 'text',
    });
  }
}
