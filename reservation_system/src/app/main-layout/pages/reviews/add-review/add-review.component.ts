import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Review } from '../../../models/review.model';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent implements OnInit {

  addReviewForm;
  placeId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private _reviewService: ReviewService
    ) { }

  ngOnInit() {
    this.addReviewForm = this.formBuilder.group({
      placeId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', [Validators.maxLength(200)]],
      rating: [1, Validators.required],
    });

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/discover-places');
        return;
      }

      this.placeId = paramMap.get('placeId');
      this.addReviewForm = this.formBuilder.group({
        placeId: [this.placeId],
        title: ['', Validators.required],
        description: ['', [Validators.maxLength(200)]],
        rating: [1, Validators.required],
      });
    });
  }

  addReview() {
    if(this.addReviewForm.invalid)
    {
      return;
    }

    this._reviewService.createReviewAPIPromise(this.addReviewForm.value as Review)
    .then(
      (data) => this.navCtrl.navigateBack('/reviews/' + this.addReviewForm.value.placeId)
    );
  }
}
