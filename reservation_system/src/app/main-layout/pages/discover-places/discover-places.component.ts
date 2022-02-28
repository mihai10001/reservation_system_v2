import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from '../../models/place.model';
import { AuthService } from 'src/app/auth/auth.service';
import { FavouritePlacesService } from '../../services/favourite-places.service';
import { PlacesService } from '../../services/places.service';
import { PlaceInfoComponent } from '../../components/place-info/place-info.component';


@Component({
  selector: 'app-discover-places',
  templateUrl: './discover-places.component.html',
  styleUrls: ['./discover-places.component.scss'],
})
export class DiscoverPlacesComponent {

  allPlaces: Place[] = [];
  isLoading: boolean | undefined = undefined;
  isMoreInfoVisible: boolean = false;
  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private placesService: PlacesService,
    private favouritePlacesService: FavouritePlacesService,
    public alertController: AlertController,
    public modalController: ModalController
  ) { }

  ionViewWillEnter() {
    this.getAllPlaces();
  }

  getAllPlaces() {
    this.isLoading = true;

    this.subscriptions.add(
      this.placesService.getPlacesAPIObservable()
        .subscribe(data => {
          this.allPlaces = data.map(e => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as {})
              } as Place;
          });
          this.isLoading = false;
        }, (error) => this.isLoading = false)
    );
  }

  presentAlert(title:string, placeId: string) {
    this.alertController
      .create({
        header: 'Adaugă la favorite',
        message: `Adaugă ${title} la locații favorite?`,
        buttons: [
          { text: 'Nu', role: 'cancel'},
          { text: 'Da',
            handler: () => { this.addToFavourites(placeId); return true; }
          }
        ]
      })
      .then(alert => {
        alert.present();
      });
  }

  addToFavourites(placeId: string) {
    this.favouritePlacesService.getFavouritePlaceAPIObservableAsData(this.authService.getUserId)
      .subscribe(data => {
        if (Array.isArray(data) && data.length) {
          let favouritePlaceObject = data.pop();
          this.favouritePlacesService.addFavouritePlaceAPI(placeId, favouritePlaceObject);
        } else {
          this.favouritePlacesService.createFavouritePlaceAPIPromise(this.authService.getUserId, placeId);
        }
      });
  }

  openDetailedInfo(selectedPlace: Place) {
    this.modalController.create({
      component: PlaceInfoComponent,
      cssClass: 'my-custom-modal-css',
      backdropDismiss: true,
      componentProps: {
        'selectedPlace': selectedPlace,
      }
    }).then(modal => {
      modal.present();
      modal.onWillDismiss().then((result) => {
        if (result.data?.redirectToReviews)
          this.router.navigate([`/reviews/${selectedPlace.id}`]);
        else if (result.data?.redirectToBooking)
        this.router.navigate([`/booking/${selectedPlace.id}`]);
        else if (result.data?.onFavouriteButton)
          this.presentAlert(selectedPlace.title, selectedPlace.id)
      });
    });
  }

  toggleMoreInfoVisibility() {
    this.isMoreInfoVisible = !this.isMoreInfoVisible;
  }
}
