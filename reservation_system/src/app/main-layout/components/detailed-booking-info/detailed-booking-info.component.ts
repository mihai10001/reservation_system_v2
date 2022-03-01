import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { Booking, BookingViewDTO } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-detailed-booking-info',
  templateUrl: './detailed-booking-info.component.html',
  styleUrls: ['./detailed-booking-info.component.scss'],
})
export class DetailedBookingInfoComponent implements OnInit {

  @Input() bookingView: BookingViewDTO;
  @ViewChildren('checkboxes', {read: ElementRef}) checkboxes: QueryList<any>;
  
  nrRows: BehaviorSubject<number[]> = new BehaviorSubject([...Array(1)]);
  nrCols: BehaviorSubject<number[]> = new BehaviorSubject([...Array(1)]);

  constructor(
    private placesService: PlacesService,
    private bookingService: BookingService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.placesService.getPlaceAPIObservable(this.bookingView.placeId).subscribe(data => {
      let place = { id: data.id, ...(data.data() as {}) } as Place;
      this.nrRows.next([...Array(place.availableGridRows)]);
      this.nrCols.next([...Array(place.availableGridCols)]);
      this.highlightRedReservedSeats(place.id, this.bookingView.dateISONoTime);
      
    });
  }

  highlightRedReservedSeats(placeId: string, dateISONoTime: string) {
    this.bookingService.getBookingsForSpecificPlaceAPIObservable(placeId)
      .subscribe(data => {
        const bookings = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {})
          } as Booking;
        }).filter(e => e.dateISONoTime === dateISONoTime);

        // This should be separate function !
        for (var booking of bookings) {
          for (var seat of booking.reservedSeats) {
            const i = seat['i'];
            const j = seat['j'];

            this.checkboxes
              .filter(checkbox => checkbox.nativeElement.innerHTML[0] === i && checkbox.nativeElement.innerHTML[2] === j)
              .map(checkbox => { 
                checkbox.nativeElement.style.border = '5px solid #a50016';
                checkbox.nativeElement.style.borderRadius = '2px';
              });
          }
        }
        this.highlightGreenBookingReservedSeats(this.bookingView);
    });
  }

  highlightGreenBookingReservedSeats(currentBooking: BookingViewDTO) {
    for (var seat of currentBooking.reservedSeats) {
      const i = seat['i'];
      const j = seat['j'];

      this.checkboxes
        .filter(checkbox => checkbox.nativeElement.innerHTML[0] === i && checkbox.nativeElement.innerHTML[2] === j)
        .map(checkbox => { 
          checkbox.nativeElement.style.border = '5px solid green';
          checkbox.nativeElement.style.borderRadius = '2px';
        });
    }
  }

  onDeleteButton() {
    this.modalController.dismiss(
      {
        delete: true,
        bookingViewId: this.bookingView.id
      }
    );
  }

}
