import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private firestore: AngularFirestore) { }

  getBookingsAPIObservable() {
    return this.firestore.collection('bookings').snapshotChanges();
  }

  getBookingsForSpecificPlaceAPIObservable(placeId: string) {
    return this.firestore.collection('bookings', ref => ref.where('placeId', '==', placeId)).snapshotChanges();
  }

  getBookingsForSpecificUserAPIObservable(userId: string) {
    return this.firestore.collection('bookings', ref => ref.where('userId', '==', userId)).snapshotChanges();
  }

  getBookingAPIObservable(id: string) {
    return this.firestore.collection('bookings').doc(id).get();
  }

  createBookingAPIPromise(booking: Booking) {
    // Normalise model for Firebase
    delete booking.id;
    booking = {...booking};

    return this.firestore.collection('bookings').add(booking);
  }

  updateBookingAPIPromise(booking: Booking) {
    // Normalise model for Firebase
    booking = {...booking};

    return this.firestore.doc('bookings/' + booking.id).update(booking);
  }

  deleteBooking(bookingId: string) {
    this.firestore.doc('bookings/' + bookingId).delete();
  }
}


