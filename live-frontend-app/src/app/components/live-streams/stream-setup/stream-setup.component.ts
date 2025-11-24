import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stream-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stream-setup.component.html',
  styleUrls: ['./stream-setup.component.css']
})
export class StreamSetupComponent {

  stream = {
    title: '',
    category: 'Electronics',
    privacy: 'public',
    streamKey: 'sk_live_' + Math.random().toString(36).slice(2, 10),
  };

  products = [
    { name: "iPhone 14", price: 79999, selected: false },
    { name: "Samsung Galaxy S23", price: 74999, selected: false },
    { name: "OnePlus 11", price: 56999, selected: false },
  ];

  toggleProduct(p: any) {
    p.selected = !p.selected;
  }

  regenerateKey() {
    this.stream.streamKey = 'sk_live_' + Math.random().toString(36).slice(2, 10);
  }

  saveStream() {
    alert("Stream Saved Successfully!");
  }

  startBroadcast() {
    alert("Starting Broadcast…");
  }
}
