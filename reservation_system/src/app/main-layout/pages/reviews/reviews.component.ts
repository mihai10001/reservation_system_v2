import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {

  averateRating: number = 0;
  place: Place;
  placeId: string;
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private _reviewService: ReviewService,
    private placesService: PlacesService,
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/discover-places');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.getReviews(this.placeId);
      this.placesService.getPlaceAPIObservable(this.placeId).subscribe(data => {
        this.place = { id: data.id, ...(data.data() as {}) } as Place;
      });
    });
  }

  getReviews(placeId: string) {
    this._reviewService.getReviewsForSpecificPlaceAPIObservable(placeId).subscribe(data =>
      {
        if (data) {
          this.reviews = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {})
            } as Review;
          });

          this.averateRating = this.reviews.reduce((acc, element) => acc + element.rating, 0) / this.reviews.length;
      }
    });
  }

}
