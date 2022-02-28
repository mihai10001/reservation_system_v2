import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private firestore: AngularFirestore) { }

  getReviewsForSpecificPlaceAPIObservable(placeId: string) {
    return this.firestore.collection('reviews', ref => ref.where('placeId', '==', placeId)).snapshotChanges();
  }

  createReviewAPIPromise(review: Review) {
    delete review.id;
    return this.firestore.collection('reviews').add(review);
  }
}
