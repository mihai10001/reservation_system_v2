import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-admin-places',
  templateUrl: './admin-places.component.html',
  styleUrls: ['./admin-places.component.scss'],
})
export class AdminPlacesComponent {

  isLoading: boolean | null = null;
  allPlaces: Place[];

  constructor(
    private _placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController
    ) { }

  ionViewWillEnter() {
    this.getPlaces();
  }

  getPlaces() {
    this.isLoading = true;
    let getSubscription = this._placesService.getPlacesAPIObservable();
    getSubscription.subscribe(data => {
      this.allPlaces = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {})
          } as Place;
        });
        this.isLoading = false;
    }, (error) => this.isLoading = false);
  }

  deletePlace(place: Place) {
    this._placesService.deletePlace(place);
  }

  openWarningModal(place: Place){
    this.actionSheetCtrl
      .create({
        header: 'Sunteți sigur că doriți să ștergeți intrarea?',
        buttons: [
          {
            text: 'Nu sunt sigur!',
            role: 'cancel',
            icon: 'close',
          },
          {
            text: 'Da! Doresc să șterg intrarea.',
            handler: () => {
              this.deletePlace(place);
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
