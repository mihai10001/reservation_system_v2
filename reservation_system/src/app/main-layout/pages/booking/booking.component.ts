import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { Booking } from '../../models/booking.model';
import { Place } from '../../models/place.model';
import { BookingService } from '../../services/booking.service';
import { PlacesService } from '../../services/places.service';
import { AuthService } from '../../../auth/auth.service';

import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {

  isLoading: boolean | null = null;
  currentDate = new Date().toISOString();
  place: Place;
  bookingForm;
  nrRows: BehaviorSubject<number[]> = new BehaviorSubject([...Array(1)]);
  nrCols: BehaviorSubject<number[]> = new BehaviorSubject([...Array(1)]);
  hoursInterval: string[] = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
    "20:00 - 22:00",
    "22:00 - 00:00",
  ];
  selectedHour: string = "08:00 - 10:00";
  isHourClicked = false;
  @ViewChildren('checkboxes', {read: ElementRef}) checkboxes: QueryList<any>;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private bookingService: BookingService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    public alertController: AlertController,
    private pickerController: PickerController
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.bookingForm = this.formBuilder.group({
      name: ['', Validators.required],
      userId: [this.authService.getUserId, Validators.required],
      dateISONoTime: [new Date().toISOString(), Validators.required],
      placeId: [''],
      reservedSeats: ['', Validators.required],
    });

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/discover-places');
        this.isLoading = false;
        return;
      }

      // This should be separate function !
      this.placesService.getPlaceAPIObservable(paramMap.get('placeId')).subscribe(data => {
        this.place = { id: data.id, ...(data.data() as {}) } as Place;
        this.nrRows.next([...Array(this.place.availableGridRows)]);
        this.nrCols.next([...Array(this.place.availableGridCols)]);
        this.ref.detectChanges();
        this.disableUnvailableSeats(this.place);
        this.disableReservedSeats(this.place.id, 
          this.bookingForm.value.dateISONoTime.substring(0, 10) + " Ora: " + this.selectedHour.substring(0, 2));
        this.onDateValueChanges(this.place.id);
      });

      this.bookingForm = this.formBuilder.group({
        name: ['', Validators.required],
        userId: [this.authService.getUserId, Validators.required],
        dateISONoTime: [new Date().toISOString(), Validators.required],
        placeId: [paramMap.get('placeId')],
        reservedSeats: ['', Validators.required]
      });

      this.isLoading = false;
    });
  }

  onDateValueChanges(placeId: string) {
    this.bookingForm?.controls.dateISONoTime.valueChanges.subscribe( val => {
      this.disableUnvailableSeats(this.place);
      this.disableReservedSeats(placeId, val.substring(0, 10) + " Ora: " + this.selectedHour.substring(0, 2));
    });
  }

  onCheckboxValidate() {
    const reservedSeatsControl = this.bookingForm.controls.reservedSeats;
    const isCheckboxValid = this.checkboxes.find(checkbox => checkbox.nativeElement.checked);
  
    if (isCheckboxValid) { reservedSeatsControl.setValidators([]); reservedSeatsControl.updateValueAndValidity(); }
    else { reservedSeatsControl.setValidators([Validators.required]); reservedSeatsControl.updateValueAndValidity(); }
  }


  createBooking() {
    if(this.bookingForm.invalid)
    {
      return;
    }

    // This should be separate function !
    this.bookingForm.value.reservedSeats = this.checkboxes
      .filter(checkbox => checkbox.nativeElement.checked)
      .map(checkbox => {
          const i = checkbox.nativeElement.innerHTML[0];
          const j = checkbox.nativeElement.innerHTML[2];
          return {i, j};
      });
    
    this.bookingForm.value.dateISONoTime = this.bookingForm.value.dateISONoTime.substring(0, 10)
      + " Ora: " + this.selectedHour.substring(0, 2);
    this.bookingService.createBookingAPIPromise(this.bookingForm.value as Booking)
      .then(val => this.presentAlert());
  }

  disableUnvailableSeats(place: Place) {
    this.checkboxes.map(checkbox => {
      checkbox.nativeElement.disabled = true;
      checkbox.nativeElement.style.border = '';
      checkbox.nativeElement.style.borderRadius = '';
    });

    // This should be separate function !
    for (var seat of place.availableSeats) {
      const i = seat['i'];
      const j = seat['j'];

      this.checkboxes
        .filter(checkbox => checkbox.nativeElement.innerHTML[0] === i && checkbox.nativeElement.innerHTML[2] === j)
        .map(checkbox => checkbox.nativeElement.disabled = false);
    }
  }

  disableReservedSeats(placeId: string, dateISONoTime: string) {
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
                checkbox.nativeElement.disabled = true;
                checkbox.nativeElement.style.border = '5px solid #a50016';
                checkbox.nativeElement.style.borderRadius = '2px';
              });
          }
        }
    });
  }

  presentAlert() {
    this.alertController
      .create({
        header: 'Felicitări!',
        message: 'Rezervarea a fost înregistrată cu success.',
        buttons: [
          {
            text: 'OK',
            handler: () => this.navCtrl.navigateBack('/discover-places')
          }
        ]
      })
      .then(alert => {
        alert.present();
        alert.onDidDismiss().then((data) => this.navCtrl.navigateBack('/discover-places'));
      });
  }

  showPicker() {
    this.isHourClicked = true;
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Ok',
          handler:(value:any) => {
            this.selectedHour = value.Ora.value;
            this.disableUnvailableSeats(this.place);
            this.disableReservedSeats(this.place.id,
              this.bookingForm?.controls.dateISONoTime.value.substring(0, 10) + " Ora: " + this.selectedHour.substring(0, 2));
          }
        }
      ],
      columns:[{
        name:'Ora',
        options: this.getColumnOptions()
      }]
    };

    this.pickerController.create(options).then(picker => picker.present());
  }

  getColumnOptions(){
    return this.hoursInterval.map(x => {return {text:x, value:x}});
  }
}
