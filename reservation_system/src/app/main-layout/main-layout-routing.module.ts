import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';
import { AdvancedSearchComponent } from './pages/advanced-search/advanced-search.component';
import { BookingComponent } from './pages/booking/booking.component';
import { DiscoverPlacesComponent } from './pages/discover-places/discover-places.component';
import { FavouritePlacesComponent } from './pages/favourite-places/favourite-places.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';

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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
