import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService, AvailabilityDto, BlockedDateDto, SlotDto } from '../../../core/reservation.service';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {
  days = [
    { name: 'Monday', enabled: false, openingTime: '', closingTime: '' },
    { name: 'Tuesday', enabled: false, openingTime: '', closingTime: '' },
    { name: 'Wednesday', enabled: false, openingTime: '', closingTime: '' },
    { name: 'Thursday', enabled: false, openingTime: '', closingTime: '' },
    { name: 'Friday', enabled: false, openingTime: '', closingTime: '' },
    { name: 'Saturday', enabled: false, openingTime: '', closingTime: '' },
    { name: 'Sunday', enabled: false, openingTime: '', closingTime: '' }
  ];

  durations = [15, 30, 45, 60];
  slotConfig = {
    duration: 30,
    capacity: 2,
    buffer: 0,
    advanceDays: 30,
    minNotice: 2,
    sameDay: true
  };

  blockedDates: BlockedDateDto[] = [];
  generatedSlots: SlotDto[] = [];

  loading = false;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadAvailability();
    this.loadBlockedDates();
  }

  // ✅ Load availability settings from backend
  loadAvailability() {
    this.loading = true;
    this.reservationService.getAvailability({}).subscribe({
      next: (data) => {
        console.log('✅ Loaded availability:', data);
        if (data.businessHours) {
          try {
            this.days = JSON.parse(data.businessHours);
          } catch {
            console.warn('⚠️ Invalid businessHours JSON format');
          }
        }
        if (data.slotDuration) this.slotConfig.duration = parseInt(data.slotDuration, 10);
        if (data.capacity) this.slotConfig.capacity = data.capacity;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load availability', err);
        this.loading = false;
      }
    });
  }

  // ✅ Load blocked dates from backend
  loadBlockedDates() {
    this.reservationService.getBlockedDates().subscribe({
      next: (data) => (this.blockedDates = data),
      error: (err) => console.error('❌ Failed to load blocked dates', err)
    });
  }

  addBlockedDate() {
    this.blockedDates.push({ date: '', reason: '' });
  }

  removeBlockedDate(i: number) {
    const removed = this.blockedDates[i];
    if (removed.id) {
      // Delete from backend if exists
      this.reservationService.deleteBlockedDate(String(removed.id)).subscribe({
        next: () => this.blockedDates.splice(i, 1),
        error: (err) => console.error('❌ Failed to delete blocked date', err)
      });
    } else {
      this.blockedDates.splice(i, 1);
    }
  }

  // ✅ Save availability and blocked dates to backend
  saveSettings() {
    const dto: AvailabilityDto = {
      businessHours: JSON.stringify(this.days),
      slotDuration: String(this.slotConfig.duration),
      capacity: this.slotConfig.capacity,
      blockedDates: this.blockedDates.map((b) => b.date)
    };

    this.reservationService.saveAvailability(dto).subscribe({
      next: () => {
        alert('✅ Availability settings saved successfully!');
        this.loadAvailability();
      },
      error: (err) => {
        console.error('❌ Failed to save availability', err);
        alert('Failed to save availability. Please try again.');
      }
    });
  }

  // ✅ Preview slots dynamically
  previewGeneratedSlots() {
    const today = new Date().toISOString().split('T')[0];
    const req = {
      date: today,
      slotDuration: String(this.slotConfig.duration),
      capacity: this.slotConfig.capacity
    };

    this.reservationService.previewSlots(req).subscribe({
      next: (slots) => (this.generatedSlots = slots),
      error: (err) => console.error('❌ Failed to preview slots', err)
    });
  }
}
