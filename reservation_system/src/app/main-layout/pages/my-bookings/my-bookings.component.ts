import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { Place } from '../../models/place.model';
import { Booking, BookingViewDTO } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { PlacesService } from '../../services/places.service';
import { AuthService } from '../../../auth/auth.service';
import { DetailedBookingInfoComponent } from '../../components/detailed-booking-info/detailed-booking-info.component';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {

  isLoading: boolean | null = null;
  myBookings: BookingViewDTO[];

  constructor(
    private _placesService: PlacesService,
    private _bookingsService: BookingService,
    private _authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    public modalController: ModalController
    ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getBookings();
  }

  getBookings() {
    this.isLoading = true;

    this._bookingsService.getBookingsForSpecificUserAPIObservable(this._authService.getUserId)
    .subscribe(data =>
      {
        let bookingsRaw = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {})
          } as Booking;
        });

        this.myBookings = bookingsRaw.map(booking => {
          let bookingView = {} as BookingViewDTO;
          this._placesService.getPlaceAPIObservable(booking.placeId)
            .pipe(map(place => ({ id: place.id, ...(place.data() as {}) } as Place)))
            .subscribe(place => {
              bookingView.placeId = place.id;
              bookingView.placeTitle = place.title;
              bookingView.placeImage = place.imageUrl;
            });
          bookingView.id = booking.id;
          bookingView.name = booking.name;
          bookingView.dateISONoTime = booking.dateISONoTime;
          bookingView.reservedSeats = booking.reservedSeats;
          bookingView.nrOfReservedSeats = booking.reservedSeats.length; 
          return bookingView;
        });

        this.isLoading = false;
      }, (error) => this.isLoading = false);
  }

  deleteBooking(bookingViewId: string) {
    this._bookingsService.deleteBooking(bookingViewId);
  }

  openWarningModal(bookingViewId: string){
    this.actionSheetCtrl
      .create({
        header: 'Sunteți sigur că doriți să ștergeți rezervarea?',
        buttons: [
          {
            text: 'Nu sunt sigur!',
            role: 'cancel',
            icon: 'close',
          },
          {
            text: 'Da! Doresc să șterg rezervarea.',
            handler: () => {
              this.deleteBooking(bookingViewId);
            },
            icon: 'trash',
          }
        ]
      })
      .then(actionSheetEl =>{
        actionSheetEl.present();
      });
  }

  openDetailedInfo(bookingView: BookingViewDTO) {
    this.modalController.create({
      component: DetailedBookingInfoComponent,
      cssClass: 'my-custom-booking-modal-css',
      backdropDismiss: true,
      componentProps: {
        'bookingView': bookingView,
      }
    }).then(modal => {
      modal.present();
      modal.onWillDismiss().then((result) => {
        if (result.data?.delete)
          this.openWarningModal(result.data?.bookingViewId);
      });
    });
  }
}