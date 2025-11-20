import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StreamService } from '../../core/stream.service';

@Component({
  selector: 'app-stream-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stream-setup.component.html',
  styleUrls: ['./stream-setup.component.css']
})
export class StreamSetupComponent {
  model: any = {
    title: '',
    category: 'Electronics',
    privacy: 'public',
    rtmpUrl: 'rtmp://live.shoplive/stream',
    streamKey: 'sk_live_' + Math.random().toString(36).slice(2,12),
    selectedProducts: []
  };

  products = [
    { id: 'p1', name: 'iPhone 14 128GB', price: '₹79,999' },
    { id: 'p2', name: 'Samsung Galaxy S23', price: '₹74,999' },
    { id: 'p3', name: 'OnePlus 11', price: '₹56,999' }
  ];

  saving = false;

  constructor(private streamService: StreamService) {}

  toggleProduct(id: string) {
    const idx = this.model.selectedProducts.indexOf(id);
    if (idx === -1) this.model.selectedProducts.push(id);
    else this.model.selectedProducts.splice(idx, 1);
  }

  regenerateKey() {
    this.model.streamKey = 'sk_live_' + Math.random().toString(36).slice(2,12);
  }

  save() {
    this.saving = true;
    this.streamService.createStream(this.model).subscribe({
      next: (res) => {
        this.saving = false;
        alert('Stream saved');
      },
      error: () => {
        this.saving = false;
        alert('Save failed');
      }
    });
  }
}
