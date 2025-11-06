import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Reservation, ReservationService } from '../../../core/reservation.service';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit {
  reservation?: Reservation;
  loading = true;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadReservation();
    } else {
      this.loading = false;
    }
  }

  loadReservation(): void {
    this.reservationService.getReservationById(this.id).subscribe({
      next: (data) => {
        this.reservation = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reservation:', err);
        this.loading = false;
      }
    });
  }

  backToList(): void {
    this.router.navigate(['/reservations']);
  }
}
