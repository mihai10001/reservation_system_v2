import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from '../../models/place.model';

@Component({
  selector: 'app-place-info',
  templateUrl: './place-info.component.html',
  styleUrls: ['./place-info.component.scss'],
})
export class PlaceInfoComponent implements OnInit {

  @Input() selectedPlace: Place;
  nonCachedImage: string; 

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.nonCachedImage = this.selectedPlace?.imageUrl + '#' + new Date().getTime();
  }

  onReviewsButton() {
    this.modalController.dismiss({ redirectToReviews: true });
  }

  onReserveButton() {
    this.modalController.dismiss({ redirectToBooking: true });
  }

  onFavouriteButton() {
    this.modalController.dismiss({ onFavouriteButton: true });
  }
}
