import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamService } from '../../../core/stream.service';

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

    const id = localStorage.getItem('live_stream_selected_id');

    if (id) {
      this.streamService.getAnalytics(id).subscribe(
        (res: any) => {
          console.log("ANALYTICS:", res);

          this.stream = res.stream || res;
          this.viewers = res.viewersOverTime || [10, 30, 50, 80, 60];
        },
        () => {
          this.stream = { title: 'Demo Stream', peakViewers: 89 };
          this.viewers = [10, 30, 50, 80, 60];
        }
      );
    }
  }

  getPath(data: number[], w = 600, h = 150) {
    if (!data || data.length === 0) return '';
    const max = Math.max(...data);
    const step = w / (data.length - 1);

    return data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ');
  }
}
