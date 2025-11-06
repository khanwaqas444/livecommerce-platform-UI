import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Reservation {
   id?: number;                 
  bookingId?: string;            
  customerName?: string;
  customerPhone?: string;      
  customerEmail?: string;
  productName?: string;           
  date?: string;       
  people?: number;    
  startTime?: string; 
  endTime?: string;      
  time?: string;                 
  status?: string;                
  notes?: string;
  totalGuests?: number;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  selected?: boolean;            
  reservationDate?: string; 
}

export interface ManualReservationRequest {
  customerName: string;
  phone: string;
  product: string;
  date: string;
  time: string;
  notes?: string;
}

export interface NotesRequest {
  notes: string;
}

export interface AvailabilityDto {
  businessHours: string;
  slotDuration: string;
  capacity: number;
  blockedDates: string[];
}

export interface BlockedDateDto {
  id?: number;
  date: string;
  reason?: string;
}

export interface SlotDto {
  startTime: string;
  time: string;
  available: boolean;
  capacity?: number;
}

export interface SlotPreviewRequest {
  date: string;
  slotDuration?: string;
  capacity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = 'http://localhost:8088/api/reservations';

  constructor(private http: HttpClient) {}

  // ----------------------------------
  // Create Reservation / Manual
  // ----------------------------------
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, reservation);
  }

  createManualReservation(req: ManualReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/manual`, req);
  }

  // ----------------------------------
  // List / Search / Summary
  // ----------------------------------
  listReservations(params?: any): Observable<Reservation[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined)
          httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<Reservation[]>(this.baseUrl, { params: httpParams });
  }

  searchReservations(keyword: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/search`, { params: { keyword } });
  }

  getSummary(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/summary`);
  }

  // ----------------------------------
  // Details / Update / Status / Notes
  // ----------------------------------
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}`, reservation);
  }

  updateStatus(id: number, status: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/status`, null, { params: { status } });
  }

  performAction(id: number, action: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/action`, null, { params: { action } });
  }

  updateNotes(id: number, notes: string): Observable<Reservation> {
    const body: NotesRequest = { notes };
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/notes`, body);
  }

  // ----------------------------------
  // Calendar
  // ----------------------------------
   getCalendarEvents() {
    return of([
      { id: 1, date: '2025-01-02', count: 1, status: 'PENDING' },
      { id: 2, date: '2025-01-03', count: 3, status: 'CONFIRMED' },
      { id: 3, date: '2025-01-08', count: 2, status: 'CANCELLED' },
      { id: 4, date: '2025-01-18', count: 8, status: 'CONFIRMED' },
    ]);
  }

  getCalendarSummary(monthStart?: string, monthEnd?: string): Observable<any[]> {
    let params = new HttpParams();
    if (monthStart) params = params.set('monthStart', monthStart);
    if (monthEnd) params = params.set('monthEnd', monthEnd);
    return this.http.get<any[]>(`${this.baseUrl}/calendar/summary`, { params });
  }

  // ----------------------------------
  // Availability
  // ----------------------------------

  createAvailability(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/availability`, data);
  }

  getAvailability(value: any): Observable<AvailabilityDto> {
    return this.http.get<AvailabilityDto>(`${this.baseUrl}/availability`);
  }

  saveAvailability(dto: AvailabilityDto): Observable<AvailabilityDto> {
    return this.http.put<AvailabilityDto>(`${this.baseUrl}/availability`, dto);
  }

  getBlockedDates(): Observable<BlockedDateDto[]> {
    return this.http.get<BlockedDateDto[]>(`${this.baseUrl}/availability/blocked`);
  }

  addBlockedDate(dto: BlockedDateDto): Observable<BlockedDateDto> {
    return this.http.post<BlockedDateDto>(`${this.baseUrl}/availability/blocked`, dto);
  }

  deleteBlockedDate(idOrDate: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/availability/blocked/${idOrDate}`);
  }

  previewSlots(req: SlotPreviewRequest): Observable<SlotDto[]> {
    return this.http.post<SlotDto[]>(`${this.baseUrl}/availability/preview`, req);
  }

  getSlotsForDate(date: string): Observable<SlotDto[]> {
    return this.http.get<SlotDto[]>(`${this.baseUrl}/availability/slots`, { params: { date } });
  }

  // ----------------------------------
  // Reminders / Export / Aggregates
  // ----------------------------------
  sendReminders(reservationIds: number[]): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/reminder`, reservationIds);
  }

  exportReservations(format = 'csv', status?: string, startDate?: string, endDate?: string): Observable<string> {
    let params = new HttpParams().set('format', format);
    if (status) params = params.set('status', status);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get(`${this.baseUrl}/export`, { params, responseType: 'text' });
  }

  getAggregates(by?: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.baseUrl}/aggregates`, { params: { by: by || '' } });
  }
}
