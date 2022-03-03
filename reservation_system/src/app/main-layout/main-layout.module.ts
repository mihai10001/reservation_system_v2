import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainLayoutComponent } from './main-layout.component';

// Pages
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { DiscoverPlacesComponent } from './pages/discover-places/discover-places.component';
import { FavouritePlacesComponent } from './pages/favourite-places/favourite-places.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { AdvancedSearchComponent } from './pages/advanced-search/advanced-search.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { AddReviewComponent } from './pages/reviews/add-review/add-review.component';
import { AdminBookingsComponent } from './pages/admin-bookings/admin-bookings.component';

// Component
import { DetailedBookingInfoComponent } from './components/detailed-booking-info/detailed-booking-info.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    DiscoverPlacesComponent,
    FavouritePlacesComponent,
    MyBookingsComponent,
    AdvancedSearchComponent,
    BookingComponent,
    ReviewsComponent,
    AddReviewComponent,
    DetailedBookingInfoComponent,
    AdminBookingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MainLayoutRoutingModule
  ]
})
export class MainLayoutModule { }
