import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamService } from '../../core/stream.service';

// child components
import { StreamSetupComponent } from './stream-setup/stream-setup.component';
import { StreamAnalyticsComponent } from './stream-analytics/stream-analytics.component';
import { RecordingsComponent } from './recordings/recordings.component';

@Component({
  selector: 'app-live-streams',
  standalone: true,
  imports: [
    CommonModule,
    StreamSetupComponent,
    StreamAnalyticsComponent,
    RecordingsComponent
  ],
  templateUrl: './live-streams.component.html',
  styleUrls: ['./live-streams.component.css']
})
export class LiveStreamsComponent implements OnInit {

  currentView: 'list' | 'setup' | 'analytics' | 'recordings' = 'list';
  streams: any[] = [];

  hostId = 'AI-123456';

  stats = {
    totalStreams: 0,
    watchHours: 0,
    avgViewers: 0,
    reservations: 0,
  };

  constructor(private streamService: StreamService) {}

  ngOnInit(): void {
    this.loadStreams();
  }

  // Load streams by host
  loadStreams() {
    this.streamService.getStreamsByHost(this.hostId).subscribe(
      (res) => {
        console.log('STREAM LIST:', res);
        this.streams = res || [];
        this.stats.totalStreams = this.streams.length;
      },
      (err) => {
        console.error('Failed to load streams', err);
      }
    );
  }

  show(view: 'list' | 'setup' | 'analytics' | 'recordings') {
    this.currentView = view;
  }

  formatDuration(start: string | null, end: string | null) {
    if (!start) return '--';
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const diff = e.getTime() - s.getTime();

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    return `${mins}m ${secs}s`;
  }

  openAnalyticsFor(streamId: string) {
    localStorage.setItem('live_stream_selected_id', streamId);
    this.currentView = 'analytics';
  }
}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { StreamService } from '../../core/stream.service';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-live-streams',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './live-streams.component.html',
//   styleUrls: ['./live-streams.component.scss']
// })
// export class LiveStreamsComponent {

//   Math = Math;
//   streams: any[] = [];
//   activeTab: 'past'|'scheduled' = 'past';
//   loading = false;
//   page = 1;
//   pageSize = 5;
//   total = 0;

//   stats = {
//     totalStreams: 0,
//     watchHours: 0,
//     avgViewers: 0,
//     totalReservations: 0
//   };

//   // local hero/thumbnail images from uploaded files
//   heroImage = '/mnt/data/0794603a-a7cd-4c80-bd83-d979022ff0c8.png';
//   setupImage = '/mnt/data/092974d4-3d1a-4b15-bbab-0b136a0cec45.png';
//   analyticsImage = '/mnt/data/c06950aa-3600-4894-8cce-0041238d6e49.png';
//   recordingsImage = '/mnt/data/33910122-e0c5-409f-844d-5164476bccc8.png';

//   constructor(
//     private streamService: StreamService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.loadStreams();
//   }

//   setTab(t: 'past'|'scheduled') {
//     this.activeTab = t;
//     this.page = 1;
//     this.loadStreams();
//   }

//   loadStreams() {
//     this.loading = true;
//     const hostId = 'host-123'; // replace with real auth user id
//     this.streamService.getStreamsByHost(hostId).subscribe({
//       next: (res: any[]) => {
//         // assume backend returns array of streams (past + scheduled). We'll filter locally.
//         const past = res.filter(s => s.endedAt);
//         const scheduled = res.filter(s => !s.endedAt && s.startedAt && new Date(s.startedAt) > new Date());
//         // For demo: if no startedAt, treat as past if endedAt exists.
//         this.streams = (this.activeTab === 'past') ? past : scheduled;
//         this.total = this.streams.length;

//         // paging
//         const start = (this.page - 1) * this.pageSize;
//         this.streams = this.streams.slice(start, start + this.pageSize);

//         // stats calculation (based on all returned streams)
//         this.computeStats(res);
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load streams', err);
//         this.loading = false;
//       }
//     });
//   }

//   computeStats(all: any[]) {
//     this.stats.totalStreams = all.length;
//     // watchHours: use provided totalWatchSeconds or rough formula
//     const totalSeconds = all.reduce((sum, s) => sum + (s.totalWatchSeconds || (s.totalViewers ? s.totalViewers * 60 : 0)), 0);
//     this.stats.watchHours = Math.round((totalSeconds / 3600) * 10) / 10; // 1 decimal

//     const totalViewers = all.reduce((sum, s) => sum + (s.totalViewers || 0), 0);
//     this.stats.avgViewers = all.length ? Math.round(totalViewers / all.length) : 0;

//     this.stats.totalReservations = all.reduce((sum, s) => sum + (s.totalOrders || 0), 0);
//   }

//   // small helper
//   formatDuration(start: string|null, end: string|null) {
//     if (!start) return '--';
//     const s = new Date(start);
//     const e = end ? new Date(end) : new Date();
//     const diffMs = Math.max(0, e.getTime() - s.getTime());
//     const minutes = Math.floor(diffMs / 60000);
//     const secs = Math.floor((diffMs % 60000) / 1000);
//     return `${minutes}m ${secs}s`;
//   }

//   // Actions
//   openSetup() {
//     this.router.navigate(['/live-streams/setup']);
//   }

//   goToAnalytics(id: string) {
//     this.router.navigate(['/live-streams/analytics', id]);
//   }

//   downloadRecording(id: string) {
//     // adopt this to your backend file download
//     this.streamService.getStreamById(id).subscribe((s: any) => {
//       // placeholder: open recording url if present
//       if (s && s.recordingUrl) {
//         window.open(s.recordingUrl, '_blank');
//       } else {
//         alert('No recording available for this stream.');
//       }
//     });
//   }

//   startYouTubeDemo(mode: string) {
//     alert('Start streaming (demo) using ' + mode);
//     // optionally call streamService.startYouTubeStream(...)
//   }

//   // pagination helpers
//   prevPage() {
//     if (this.page > 1) { this.page--; this.loadStreams(); }
//   }
//   nextPage() {
//     if ((this.page * this.pageSize) < this.total) { this.page++; this.loadStreams(); }
//   }
// }
