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

// Component
import { DetailedBookingInfoComponent } from './components/detailed-booking-info/detailed-booking-info.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    DiscoverPlacesComponent,
    FavouritePlacesComponent,
    MyBookingsComponent,
    AdvancedSearchComponent,
    DetailedBookingInfoComponent,
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
