import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReservationService, ManualReservationRequest } from '../../../core/reservation.service';

type Product = { id: number; name: string; price: number; imageUrl?: string };

@Component({
  selector: 'app-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss'],
})
export class ManualComponent implements OnInit {
  loading = false;

  // form model
  form = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    people: 1,
    reservationDate: '',
    timeSlot: '', // "10:30"
    specialRequests: '',
    internalNotes: '',
  };

  // UI state
  products: Product[] = [];
  filtered: Product[] = [];
  search = '';
  selectedProductIds: number[] = [];

  // confirmation toggles (display only)
  sendSms = true;
  sendWhatsapp = true;
  sendEmail = false;

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // fetch products for the picker
    this.http.get<Product[]>('http://localhost:8082/api/products').subscribe({
      next: (data) => {
        this.products = data || [];
        this.filtered = [...this.products];
      },
      error: () => (this.products = this.filtered = []),
    });
  }

  onSearch(): void {
    const q = this.search.trim().toLowerCase();
    this.filtered = !q
      ? [...this.products]
      : this.products.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            String(p.price).toLowerCase().includes(q)
        );
  }

  toggleProduct(id: number): void {
    const i = this.selectedProductIds.indexOf(id);
    if (i >= 0) this.selectedProductIds.splice(i, 1);
    else this.selectedProductIds.push(id);
  }

  isSelected(id: number): boolean {
    return this.selectedProductIds.includes(id);
  }

  get selectedProducts(): Product[] {
    return this.products.filter((p) => this.selectedProductIds.includes(p.id));
  }

  get estimatedValueInr(): number {
    return this.selectedProducts.reduce((s, p) => s + (p.price || 0), 0);
  }

  get isCreateDisabled(): boolean {
    return (
      this.loading ||
      !this.form.customerName.trim() ||
      !this.form.customerPhone.trim() ||
      !this.form.reservationDate ||
      !this.form.timeSlot
    );
  }

  createReservation(): void {
    if (this.isCreateDisabled) return;
    this.loading = true;

    const body: ManualReservationRequest = {
      customerName: this.form.customerName,
      customerPhone: this.form.customerPhone,
      customerEmail: this.form.customerEmail,
      reservationDate: this.form.reservationDate, // yyyy-MM-dd from <input type="date">
      timeSlot: this.form.timeSlot,               // "HH:mm"
      people: this.form.people,
      bookingSource: 'manual',
      productIds: this.selectedProductIds,
      specialRequests: this.form.specialRequests,
      autoConfirm: true,
    };

    this.reservationService.createManualReservation(body).subscribe({
      next: (res) => {
        this.loading = false;
        const bookingId = res?.bookingId;
        if (bookingId) this.router.navigate([`/reservations/details/${bookingId}`]);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to create reservation');
      },
    });
  }

  cancel(): void {
    history.back();
  }
}
