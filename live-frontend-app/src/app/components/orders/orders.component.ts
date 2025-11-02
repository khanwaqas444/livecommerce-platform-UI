import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, CreateOrderRequest, Order } from '../../core/order.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder?: Order;
  selectedStatus = '';

  // stats
  totalOrders = 0;
  pendingOrders = 0;
  deliveredOrders = 0;

  // create modal
  showCreateModal = false;
  newOrder: CreateOrderRequest = {
    userId: '',
    items: [{ productId: 0, quantity: 1 }]
  };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.filteredOrders = data;
        this.updateStats();
      },
      error: (err) => {
        console.error('Failed to load orders', err);
      }
    });
  }

  updateStats() {
  this.totalOrders = this.orders.length;
  this.pendingOrders = this.orders.filter(o => o.status === 'PENDING' || o.status === 'CREATED').length;
  this.deliveredOrders = this.orders.filter(o => o.status === 'DELIVERED').length;
}


  filterOrders() {
    this.filteredOrders = this.selectedStatus
      ? this.orders.filter(o => o.status === this.selectedStatus)
      : this.orders;
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
  }

  openCreateOrder() {
    this.showCreateModal = true;
    this.newOrder = { userId: '', items: [{ productId: 0, quantity: 1 }] };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  addItem() {
    this.newOrder.items.push({ productId: 0, quantity: 1 });
  }

  removeItem(index: number) {
    if (this.newOrder.items.length > 1) {
      this.newOrder.items.splice(index, 1);
    } else {
      // keep at least one item row
      this.newOrder.items[0] = { productId: 0, quantity: 1 };
    }
  }

  createOrder() {
    // basic validation
    if (!this.newOrder.userId || this.newOrder.items.length === 0) {
      alert('Please provide userId and at least one item.');
      return;
    }
    for (const it of this.newOrder.items) {
      if (!it.productId || it.quantity <= 0) {
        alert('Please check productId and quantity for each item.');
        return;
      }
    }

    this.orderService.createOrder(this.newOrder).subscribe({
      next: (created: Order) => {
        console.log('Order created', created);
        this.loadOrders();
        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Create order failed', err);
        alert('Failed to create order. Check console for details.');
      }
    });
  }

  markAsDelivered(order: Order) {
  this.orderService.updateOrderStatus(order.id, 'DELIVERED').subscribe({
    next: (res) => {
      console.log('Order marked as delivered:', res);
      this.loadOrders();
    },
    error: (err) => {
      console.error('Failed to mark delivered', err);
      alert('Failed to update order.');
    }
  });
}

}
