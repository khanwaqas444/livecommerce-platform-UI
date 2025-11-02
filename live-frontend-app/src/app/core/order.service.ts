import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 👇 define separate type for creating new order
export interface CreateOrderRequest {
  userId: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8084/api/orders';

  constructor(private http: HttpClient) {}

  // ✅ Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // ✅ Create new order using CreateOrderRequest
  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }
  
 updateOrderStatus(orderId: string, status: string): Observable<Order> {
  const params = new HttpParams().set('status', status);
  return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, {}, { params });
}


   updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order);
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }
}
