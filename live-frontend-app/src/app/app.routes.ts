import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LiveStreamsComponent } from './components/live-streams/live-streams.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ListComponent } from './components/reservation/list/list.component';
import { ReservationDetailComponent } from './components/reservation/details/details.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },

      // ✅ Reservation section (lazy + nested)
      {
        path: 'reservations',
        loadComponent: () =>
          import('./components/reservation/reservation.component')
            .then(m => m.ReservationComponent),
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },

          {
            path: 'list',
            loadComponent: () =>
              import('./components/reservation/list/list.component')
                .then(m => m.ListComponent),
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./components/reservation/calendar/calendar.component')
                .then(m => m.CalendarComponent),
          },
          {
            path: 'availability',
            loadComponent: () =>
              import('./components/reservation/availability/availability.component')
                .then(m => m.AvailabilityComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import('./components/reservation/details/details.component')
                .then(m => m.ReservationDetailComponent),
          },
          {
            path: 'manual',
            loadComponent: () =>
              import('./components/reservation/manual/manual.component')
                .then(m => m.ManualComponent),
          },
        ],
      },
      
      { path: 'products', component: ProductsComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'streams', component: LiveStreamsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
