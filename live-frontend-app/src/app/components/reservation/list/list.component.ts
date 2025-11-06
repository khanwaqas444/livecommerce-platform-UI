import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService, Reservation } from '../../../core/reservation.service'; // ✅ single source of truth

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // 🔍 Search term
  searchTerm: string = '';

  // 🔖 Tabs
  tabs = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'today', label: 'Today', count: 0 },
    { key: 'upcoming', label: 'Upcoming', count: 0 },
    { key: 'cancelled', label: 'Cancelled', count: 0 }
  ];
  activeTab: string = 'all';

  // 📁 Filters
  filters = {
    status: '',
    dateRange: '',
    product: '',
    sortBy: 'newest'
  };

  // 📦 Product list
  productList: string[] = ['Dinner Buffet', 'Lunch Special', 'Live Event', 'Private Dining'];

  // 📋 Data
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  selectedCount: number = 0;

  constructor(
    private router: Router,
    private reservationService: ReservationService
  ) {}

  // 🔄 Load on init
  ngOnInit(): void {
    this.loadReservations();
  }

  // 📡 Load reservations from backend
  loadReservations(): void {
    this.reservationService.listReservations().subscribe({
      next: (data: Reservation[]) => {
        this.reservations = data || [];
        this.applyFilters();
      },
      error: (err) => {
        console.error('❌ Failed to load reservations', err);
      }
    });
  }

  // 🔍 Search
  search(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredReservations = this.reservations.filter(r =>
      (r.customerName?.toLowerCase().includes(term) ||
       r.customerPhone?.includes(term) ||
       r.bookingId?.toLowerCase().includes(term))
    );
  }

  // 📅 Calendar view navigation
  toggleCalendarView(): void {
    this.router.navigate(['/reservations/calendar']);
  }

  // 🧭 Tab selection
  selectTab(tabKey: string): void {
    this.activeTab = tabKey;
    this.applyFilters();
  }

  // ⚙️ Apply filters
  applyFilters(): void {
    let result = [...this.reservations];

    const today = new Date();

    if (this.activeTab === 'today') {
      result = result.filter(r =>
        new Date(r.reservationDate || '').toDateString() === today.toDateString()
      );
    } else if (this.activeTab === 'upcoming') {
      result = result.filter(r =>
        new Date(r.reservationDate || '') > today
      );
    } else if (this.activeTab === 'cancelled') {
      result = result.filter(r => r.status?.toLowerCase() === 'cancelled');
    }

    if (this.filters.status) {
      result = result.filter(r => r.status === this.filters.status);
    }

    if (this.filters.product) {
      result = result.filter(r => r.productName === this.filters.product);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.reservationDate || a.createdAt || '').getTime();
      const dateB = new Date(b.reservationDate || b.createdAt || '').getTime();
      return this.filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    this.filteredReservations = result;
    this.selectedCount = 0;
  }

  // 🔁 Clear filters
  clearFilters(): void {
    this.filters = {
      status: '',
      dateRange: '',
      product: '',
      sortBy: 'newest'
    };
    this.applyFilters();
  }

  // ✅ Select All
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.filteredReservations.forEach(r => (r.selected = checked));
    this.updateSelectedCount();
  }

  updateSelectedCount(): void {
    this.selectedCount = this.filteredReservations.filter(r => r.selected).length;
  }

  // 🔔 Actions
  sendReminders(): void {
    alert(`${this.selectedCount} reminder(s) sent successfully.`);
  }

  export(format: string): void {
    alert(`Exporting as ${format.toUpperCase()}...`);
  }

  // 🔄 Update Status
updateStatus(reservation: any, status: string): void {
  const oldStatus = reservation.status;
  reservation.status = status; // optimistic UI update

  // ✅ Use existing service method name: updateReservation
  this.reservationService.updateReservation(reservation.id, reservation).subscribe({
    next: (updated: any) => { // ✅ added type
      console.log('✅ Status updated successfully:', updated);
      reservation.status = updated.status;
      this.applyFilters(); // refresh visible list
    },
    error: (err: any) => { // ✅ added type
      console.error('❌ Failed to update status', err);
      reservation.status = oldStatus; // rollback if failed
      alert('Failed to update status. Please try again.');
    }
  });
}





  // 📞 Contact
  callCustomer(phone: string): void {
    window.open(`tel:${phone}`);
  }

  messageCustomer(phone: string): void {
    window.open(`https://wa.me/${phone}`, '_blank');
  }

  // 👁️ View details
  viewReservation(bookingId?: string): void {
    if (bookingId) this.router.navigate(['/reservations', bookingId]);
  }

  // 🔑 TrackBy
  trackByBookingId(index: number, item: Reservation): string {
    return item.bookingId || index.toString();
  }
}
