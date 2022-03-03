import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';
import { AdminBookingsComponent } from './pages/admin-bookings/admin-bookings.component';
import { AdminPlacesComponent } from './pages/admin-places/admin-places.component';
import { AdvancedSearchComponent } from './pages/advanced-search/advanced-search.component';
import { BookingComponent } from './pages/booking/booking.component';
import { DiscoverPlacesComponent } from './pages/discover-places/discover-places.component';
import { FavouritePlacesComponent } from './pages/favourite-places/favourite-places.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { AddReviewComponent } from './pages/reviews/add-review/add-review.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'discover-places',
        component: DiscoverPlacesComponent
      },
      {
        path: 'my-favourite-places',
        component: FavouritePlacesComponent
      },
      {
        path: 'my-bookings',
        component: MyBookingsComponent
      },
      {
        path: 'search',
        component: AdvancedSearchComponent
      },
      {
        path: 'booking/:placeId',
        component: BookingComponent
      },
      {
        path: 'reviews/:placeId',
        component: ReviewsComponent
      },
      {
        path: 'add-review/:placeId',
        component: AddReviewComponent
      },
      {
        path: 'admin-bookings',
        component: AdminBookingsComponent
      },
      {
        path: 'admin-places',
        component: AdminPlacesComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
