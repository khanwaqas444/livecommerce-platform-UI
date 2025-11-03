import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { ReservationsComponent } from './components/reservation/reservation.component';
import { LiveStreamsComponent } from './components/live-streams/live-streams.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reservations/:id', component: ReservationsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'streams', component: LiveStreamsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
