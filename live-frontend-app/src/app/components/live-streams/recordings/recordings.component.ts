import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recordings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css']
})
export class RecordingsComponent {
  recordings = [
    { id: 'r1', title: 'iPhone Launch', views: 245, duration: '45:23', date: 'Jan 24, 2025' },
    { id: 'r2', title: 'Samsung Showcase', views: 187, duration: '38:15', date: 'Jan 23, 2025' }
  ];

  play(id: string) { alert('Play ' + id); }
  download(id: string) { alert('Download ' + id); }
}
