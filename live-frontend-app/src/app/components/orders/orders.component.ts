import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { OrderService, Order } from '../../core/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'] 
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder?: Order;
  error: string | null = null;
  loading = false;
  selectedStatus: string = '';

  totalOrders = 0;
  pendingOrders = 0;
  deliveredOrders = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalOrders = this.orders.length;
    this.pendingOrders = this.orders.filter(o => o.status === 'CREATED' || o.status === 'SHIPPED').length;
    this.deliveredOrders = this.orders.filter(o => o.status === 'DELIVERED').length;
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  filterOrders(): void {
    if (!this.selectedStatus) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.selectedStatus);
    }
  }

  markAsDelivered(order: Order): void {
    order.status = 'DELIVERED';
    this.calculateStats();
  }

  showCreateModal = false;
newOrder = {
  userId: '',
  totalAmount: 0,
  status: 'CREATED'
};

openCreateOrder(): void {
  this.showCreateModal = true;
}

closeCreateModal(): void {
  this.showCreateModal = false;
  this.newOrder = { userId: '', totalAmount: 0, status: 'CREATED' };
}

createOrder(): void {
  if (!this.newOrder.userId || this.newOrder.totalAmount <= 0) {
    alert('Please fill all fields correctly.');
    return;
  }

  const order: Order = {
    id: '', // will come from backend
    userId: this.newOrder.userId,
    totalAmount: this.newOrder.totalAmount,
    status: this.newOrder.status,
    deleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  this.orderService.createOrder(order).subscribe({
    next: (created) => {
      this.orders.unshift(created);
      this.filteredOrders = [...this.orders];
      this.calculateStats();
      this.closeCreateModal();
    },
    error: () => {
      alert('Failed to create order');
    }
  });
}
}
