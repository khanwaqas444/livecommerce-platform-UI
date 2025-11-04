import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Reservation, ReservationService } from '../../core/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  summary: Record<string, number> = {};
  activeTab = 'today';
  selectedCount = 0;

  filters = { status: '', product: '', sortBy: '', dateRange: '' };
  searchTerm = '';
  productList: string[] = ['Mobile & Tablets', 'Fashion', 'Electronics', 'Home & Furniture', 'Beauty & Personal Care'];

  tabs = [
    { key: 'today', label: 'Today', count: 0 },
    { key: 'tomorrow', label: 'Tomorrow', count: 0 },
    { key: 'week', label: 'This Week', count: 0 },
    { key: 'past', label: 'Past', count: 0 },
    { key: 'all', label: 'All', count: 0 },
  ];

  // ✅ Calendar setup
  calendarView = false;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: false,
    selectable: true,
    events: []
  };

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadReservationsFor(this.activeTab);
  }

  toggleCalendarView(): void {
    this.calendarView = !this.calendarView;
    if (this.calendarView) {
      this.reservationService.getCalendar().subscribe(events => {
        this.calendarOptions.events = events.map(e => ({
          title: `${e.customerName} (${e.productName})`,
          start: e.startTime,
          end: e.endTime
        }));
      });
    }
  }

  loadSummary(): void {
    this.reservationService.getSummary().subscribe(data => {
      this.summary = data;
      if (data['today'] !== undefined) this.tabs[0].count = data['today'];
      if (data['tomorrow'] !== undefined) this.tabs[1].count = data['tomorrow'];
      if (data['week'] !== undefined) this.tabs[2].count = data['week'];
      if (data['past'] !== undefined) this.tabs[3].count = data['past'];
      if (data['all'] !== undefined) this.tabs[4].count = data['all'];
    });
  }

  loadReservationsFor(type: string): void {
    this.activeTab = type;
    let start: string;
    let end: string;
    const now = new Date();

    if (type === 'today') {
      const s = new Date(); s.setHours(0, 0, 0, 0);
      const e = new Date(); e.setHours(23, 59, 59, 999);
      start = s.toISOString(); end = e.toISOString();
    } else if (type === 'tomorrow') {
      const t = new Date(); t.setDate(t.getDate() + 1);
      const s = new Date(t); s.setHours(0, 0, 0, 0);
      const e = new Date(t); e.setHours(23, 59, 59, 999);
      start = s.toISOString(); end = e.toISOString();
    } else if (type === 'week') {
      const s = new Date(); const e = new Date(); e.setDate(e.getDate() + 7);
      start = s.toISOString(); end = e.toISOString();
    } else if (type === 'past') {
      start = new Date(0).toISOString(); end = now.toISOString();
    } else {
      start = new Date(0).toISOString();
      end = new Date(now.getFullYear() + 10, 0, 1).toISOString();
    }

    this.reservationService.getByDate(start, end).subscribe(data => {
      this.reservations = (data || []).map(r => ({
        ...r,
        selected: false,
        reservationDate: r.reservationDate || r.createdAt || new Date().toISOString()
      }));
      this.filteredReservations = [...this.reservations];
      this.updateSelectedCount();
    });
  }

  selectTab(tabKey: string): void {
    this.loadReservationsFor(tabKey);
  }

  search(): void {
    const keyword = this.searchTerm?.trim();
    if (!keyword) {
      this.filteredReservations = [...this.reservations];
      return;
    }
    this.reservationService.search(keyword).subscribe(data => {
      this.filteredReservations = data || [];
      this.updateSelectedCount();
    });
  }

  applyFilters(): void {
    const { status, product, sortBy } = this.filters;
    this.reservationService.filter(status, product, sortBy).subscribe(data => {
      this.filteredReservations = data || [];
      this.updateSelectedCount();
    });
  }

  clearFilters(): void {
    this.filters = { status: '', product: '', sortBy: '', dateRange: '' };
    this.filteredReservations = [...this.reservations];
    this.updateSelectedCount();
  }

  updateStatus(r: Reservation, newStatus: string): void {
    this.reservationService.updateStatus(r.id, newStatus).subscribe(updated => {
      const target = this.filteredReservations.find(x => x.id === updated.id);
      if (target) target.status = updated.status;
      alert(`Reservation ${updated.bookingId} updated to ${updated.status}`);
    });
  }

  callCustomer(phone: string) {
  if (phone) {
    window.open(`tel:${phone}`, '_self');
  }
}

messageCustomer(phone: string) {
  if (phone) {
    // WhatsApp direct message link
    window.open(`https://wa.me/${phone.replace('+', '')}`, '_blank');
  }
}


  toggleSelectAll(e: any): void {
    const checked = e.target.checked;
    this.filteredReservations.forEach(r => (r.selected = checked));
    this.updateSelectedCount();
  }

  updateSelectedCount(): void {
    this.selectedCount = this.filteredReservations.filter(r => r.selected).length;
  }

  sendReminders(): void {
    const ids = this.filteredReservations.filter(r => r.selected).map(r => r.id);
    if (!ids.length) return alert('Select at least one reservation.');
    this.reservationService.sendReminders(ids).subscribe(() => alert('Reminders sent successfully.'));
  }

  export(format: string): void {
    this.reservationService.export(format).subscribe(url => {
      if (url) window.open(url, '_blank');
    });
  }
}
