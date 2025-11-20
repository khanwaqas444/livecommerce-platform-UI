import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Reservation, ReservationService, TimelineStep } from '../../../core/reservation.service';
import { FormsModule } from '@angular/forms';
import { ProductService, Product  } from '../../../core/products.service';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class ReservationDetailComponent implements OnInit {
  reservation?: Reservation;
  loading = true;
  id!: string;
  newNote: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const idParam = params.get('reservationId') || params.get('id');

    console.log("param = ", idParam);

    if (idParam) {
      this.id = idParam; // KEEP STRING
      this.fetchReservation();
    } else {
      this.loading = false;
    }
  });
}


  fetchReservation(): void {
  console.log("Fetching reservation for ID:", this.id);

  this.reservationService.getReservationById(this.id).subscribe({
    next: (res) => {
      this.reservation = res;

      // ✅ Check reservation and productIds exist
      if (this.reservation && this.reservation.productIds?.length) {
        this.productService.getProducts().subscribe({
          next: (allProducts: Product[]) => {
            if (!this.reservation) return; // ✅ extra safety guard

            // ✅ Filter only matching products
            this.reservation.products = allProducts.filter(p =>
              this.reservation!.productIds!.includes(p.id!)
            );

             console.log('✅ Matched Products:', this.reservation!.products); 

            // ✅ Calculate total value
            this.reservation.totalValue = (this.reservation.products || [])
              .reduce((sum, p) => sum + (p.price || 0), 0);
          },
          error: (err: any) => console.error("❌ Failed to fetch products:", err)
        });
      }

      this.loading = false;
    },
    error: (err: any) => {
      console.error("❌ Failed to load reservation:", err);
      this.loading = false;
    }
  });
}






  backToList(): void {
    this.router.navigate(['/reservations/list']);
  }

 updateStatus(status: string): void {
  if (!this.id) return;
  this.reservationService.updateStatus(this.id, status).subscribe({
    next: (res) => {
      this.reservation = res;
      alert(`✅ Status updated to ${status}`);
    },
    error: (err) => console.error('❌ Failed to update status:', err)
  });
}

  addNote(): void {
  if (!this.newNote.trim()) return;
  this.reservationService.updateNotes(this.id, this.newNote).subscribe({
    next: (res) => {
      if (!this.reservation?.internalNotes) this.reservation!.internalNotes = [];
      this.reservation!.internalNotes.unshift({
        author: 'You',
        message: this.newNote,
        timeAgo: 'just now'
      });
      this.newNote = '';
    },
    error: (err) => console.error('❌ Failed to add note:', err)
  });
}

performAction(action: string): void {
  this.reservationService.performAction(this.id, action).subscribe({
    next: (res) => {
      this.reservation = {
        ...this.reservation,
        ...res
      };

      // 🟢 If reminder action is successful, update timeline data immediately
      if (action === 'reminder') {
        this.reservation.status = 'REMINDER_SENT';
        this.reservation.reminderSentAt = new Date().toISOString(); // mark current time
      }

      alert(`✅ Action "${action}" executed successfully`);
    },
    error: (err) => console.error(`❌ Failed to perform ${action}:`, err)
  });
}


  editReservation(): void {
  this.router.navigate(['/reservations/edit', this.id]);
}

printReservation(): void {
  window.print();
}

getTimelineSteps(): TimelineStep[] {
  const status = this.reservation?.status?.toUpperCase() || 'PENDING';

  const steps: TimelineStep[] = [
    { label: 'Reservation Created', time: this.reservation?.createdAt || undefined, done: true },
    { label: 'Confirmed by Customer', time: this.reservation?.confirmedAt || undefined, done: false },
    { label: 'Reminder Sent (24h)', time: this.reservation?.reminderSentAt || undefined, done: false },
    { label: 'Customer Arrival', time: undefined, done: false },
    { label: 'Visit Completed', time: undefined, done: false }
  ];

  switch (status) {
    case 'CONFIRMED':
      steps[1].done = true;
      break;
    case 'REMINDER_SENT':
      steps[1].done = true;
      steps[2].done = true;
      break;
    case 'ARRIVED':
      steps[1].done = true;
      steps[2].done = true;
      steps[3].done = true;
      break;
    case 'COMPLETED':
      steps.forEach(s => s.done = true);
      break;
    case 'CANCELLED':
      steps.forEach(s => s.done = false);
      steps.push({
        label: 'Reservation Cancelled',
        time: this.reservation?.updatedAt || undefined,
        done: true,
        cancelled: true
      });
      break;
    default:
      // only created step stays done
      break;
  }

  return steps;
}

getFullImageUrl(imageUrl?: string): string {
  if (!imageUrl) return 'assets/images/no-image.png';

  if (imageUrl.startsWith('http')) return imageUrl;

  return `http://localhost:8082${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
}

onImgError(event: any) {
  event.target.src = 'assets/images/no-image.png';
}

}
