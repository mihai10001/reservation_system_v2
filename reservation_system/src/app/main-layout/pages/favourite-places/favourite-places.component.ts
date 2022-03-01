import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { Place } from '../../models/place.model';
import { FavouritePlace } from '../../models/favouritePlaces.model';
import { AuthService } from 'src/app/auth/auth.service';
import { FavouritePlacesService } from '../../services/favourite-places.service';
import { PlacesService } from '../../services/places.service';



@Component({
  selector: 'app-favourite-places',
  templateUrl: './favourite-places.component.html',
  styleUrls: ['./favourite-places.component.scss'],
})
export class FavouritePlacesComponent {
  isLoading: boolean | null = null;
  favouritePlaceObject: FavouritePlace;
  myFavouritePlaces: Place[] = [];

  constructor(
    private _favouritePlaces: FavouritePlacesService,
    private _placesService: PlacesService,
    private _authService: AuthService,
    private actionSheetCtrl: ActionSheetController
    ) { }

  ionViewWillEnter() {
    this.getFavouritePlaces();
  }

  getFavouritePlaces() {
    this.isLoading = true;
    this.myFavouritePlaces = [];
  
    this._favouritePlaces.getFavouritePlaceAPIObservableAsData(this._authService.getUserId)
      .subscribe(data => {
        this.favouritePlaceObject = data.pop();

        if (this.favouritePlaceObject?.favouritePlacesIds && this.favouritePlaceObject?.favouritePlacesIds.length) {
          for (let placeId of this.favouritePlaceObject.favouritePlacesIds) {
            this._placesService.getPlaceAPIObservable(placeId)
              .subscribe(place => { 
                this.myFavouritePlaces.push({id: place.id, ...(place.data() as {})} as Place);
                this.isLoading = false;
              });
          }
        } else {
          this.isLoading = false;
        }
    }, (error) => this.isLoading = false);
  }


  openWarningModal(placeId: string){
    this.actionSheetCtrl
      .create({
        header: 'Sunteți sigur că doriți să ștergeți intrarea de la favorite?',
        buttons: [
          {
            text: 'Nu sunt sigur!',
            role: 'cancel',
            icon: 'close',
          },
          {
            text: 'Da! Doresc să șterg intrarea.',
            handler: () => {
              this._favouritePlaces.deleteFavouritePlaceAPIPromise(placeId, this.favouritePlaceObject)
                .then(_ => this.getFavouritePlaces());
            },
            icon: 'trash',
          }
        ]
      })
      .then(actionSheetEl =>{
        actionSheetEl.present();
      });
  }

}
