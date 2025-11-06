import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../core/reservation.service';
import { Router } from '@angular/router';
import { AvailabilityComponent } from '../availability/availability.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, AvailabilityComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendarComponent') calendarComponent!: FullCalendarComponent;
  selectedStatus = 'ALL';
  events: any[] = [];
  filteredEvents: any[] = [];
  showAvailabilityModal = false;
  calendarTitle = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    editable: false,
    events: [],
    eventDisplay: 'block',
    eventColor: '#6c63ff',
    headerToolbar: false,
    datesSet: this.onDatesSet.bind(this),
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this)
  };

  constructor(private reservationService: ReservationService, private router: Router,
  private cdr: ChangeDetectorRef,
  private zone: NgZone
  ) {}

  ngOnInit() {
    this.loadCalendarEvents();
  }

  loadCalendarEvents() {
    this.reservationService.getCalendarEvents().subscribe((events: any[]) => {
      this.events = events;
      this.filterEvents();
    });
  }

  filterEvents() {
    this.filteredEvents =
      this.selectedStatus === 'ALL'
        ? this.events
        : this.events.filter(e => e.status === this.selectedStatus);

    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.filteredEvents.map(e => ({
        id: e.id,
        title: `${e.count} reservations`,
        start: e.date,
        color:
          e.status === 'CONFIRMED'
            ? '#22c55e'
            : e.status === 'PENDING'
            ? '#eab308'
            : e.status === 'COMPLETED'
            ? '#3b82f6'
            : e.status === 'CANCELLED'
            ? '#ef4444'
            : e.status === 'NO_SHOW'
            ? '#9ca3af'
            : '#6b7280'
      }))
    };
  }

  onDatesSet(arg: any) {
    const date = new Date(arg.start);
    this.calendarTitle = date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  goToToday() {
    this.calendarComponent.getApi().today();
    this.updateTitle();
  }

  goNext() {
    this.calendarComponent.getApi().next();
    this.updateTitle();
  }

  goPrev() {
    this.calendarComponent.getApi().prev();
    this.updateTitle();
  }

  updateTitle() {
    const api = this.calendarComponent.getApi();
    const currentDate = api.getDate();
    this.calendarTitle = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  onDateClick(info: any) {
    alert(`You clicked ${info.dateStr}`);
  }

  onEventClick(info: any) {
    alert(`Reservation Details:\n${info.event.title}`);
  }

  goToAvailabilityPage() {
    this.router.navigate(['/reservations/availability']);
  }

   goToListPage() {
    this.router.navigate(['/reservations/list']);
  }
}
