import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ListComponent
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent {
  activeTab: string = 'list';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
