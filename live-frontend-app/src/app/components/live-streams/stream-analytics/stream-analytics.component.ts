import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamService } from '../../../../core/stream.service';


@Component({
  selector: 'app-stream-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stream-analytics.component.html',
  styleUrls: ['./stream-analytics.component.css']
})
export class StreamAnalyticsComponent {
  stream: any = {};
  viewers: number[] = [];

  constructor(private streamService: StreamService) {
    // try load selected id saved by parent if any
    const id = localStorage.getItem('live_stream_selected_id');
    if (id) {
      this.streamService.getAnalytics(id).subscribe((res:any) => {
        this.stream = res.stream || res;
        this.viewers = res.viewersOverTime || [10,40,80,120,90,60];
      }, () => {
        // fallback demo
        this.stream = { title: 'Demo Stream', peakViewers: 127, totalViewers: 245, watchHours: 89.2, reservations: 18 };
        this.viewers = [10,30,80,120,95,60,30];
      });
    } else {
      // demo fallback
      this.stream = { title: 'Demo Stream', peakViewers: 127, totalViewers: 245, watchHours: 89.2, reservations: 18 };
      this.viewers = [10,30,80,120,95,60,30];
    }
  }

  // simple svg path generator (small)
  getPath(data:number[], w=600, h=150) {
    if (!data || data.length===0) return '';
    const max = Math.max(...data);
    const step = w / (data.length - 1);
    return data.map((v,i) => `${i*step},${h - (v/max)*h}`).join(' ');
  }
}
