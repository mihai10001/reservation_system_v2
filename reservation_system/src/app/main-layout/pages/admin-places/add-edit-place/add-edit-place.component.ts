import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { Place } from '../../../models/place.model';
import { PlacesService } from '../../../services/places.service';

@Component({
  selector: 'app-add-edit-place',
  templateUrl: './add-edit-place.component.html',
  styleUrls: ['./add-edit-place.component.scss'],
})
export class AdminAddEditPlaceComponent implements OnInit, AfterViewInit {

  addEditPlaceForm;
  addOrEdit: 'add' | 'edit' | null = null;
  nrRows: BehaviorSubject<number[]> = new BehaviorSubject([...Array(1)]);
  nrCols: BehaviorSubject<number[]> = new BehaviorSubject([...Array(1)]);
  @ViewChildren('checkboxes', {read: ElementRef}) checkboxes: QueryList<any>;

  constructor(
    private formBuilder: FormBuilder,
    private _placesService: PlacesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.createAddForm();
  }

  ngAfterViewInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('placeId')) {
        this._placesService.getPlaceAPIObservable(paramMap.get('placeId')).subscribe(data => {
          let thisPlace = { id: data.id, ...(data.data() as {}) } as Place;
          this.createEditForm(thisPlace);
        });
      }
    });
  }

  createAddForm() {
    this.addOrEdit = 'add';

    this.addEditPlaceForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      schedule: ['', Validators.required],
      imageUrl: ['', Validators.required],
      openDays: 
        this.formBuilder.group({
          week: [false],
          saturday: [false],
          sunday: [false]
        }),
      defaultTableSize: ['', Validators.required],
      availableGridRows: [1, Validators.required],
      availableGridCols: [1, Validators.required],
      availableSeats: [''],
    });
    this.onGridValueChanges();
  }

  createEditForm(thisPlace: Place) {
    this.addOrEdit = 'edit';
    this.nrRows.next([...Array(thisPlace.availableGridRows)]);
    this.nrCols.next([...Array(thisPlace.availableGridCols)]);
    this.ref.detectChanges();

    this.addEditPlaceForm = this.formBuilder.group({
      id: [thisPlace.id, Validators.required],
      title: [thisPlace.title, Validators.required],
      description: [thisPlace.description, [Validators.required, Validators.maxLength(200)]],
      schedule: [thisPlace.schedule, Validators.required],
      imageUrl: [thisPlace.imageUrl, Validators.required],
      openDays: 
        this.formBuilder.group({
          week: [thisPlace.openDays.week],
          saturday: [thisPlace.openDays.saturday],
          sunday: [thisPlace.openDays.sunday]
        }),
      defaultTableSize: [thisPlace.defaultTableSize, Validators.required],
      availableGridRows: [thisPlace.availableGridRows, Validators.required],
      availableGridCols: [thisPlace.availableGridCols, Validators.required],
      availableSeats: [''],
    });
    this.onGridValueChanges();

    // This should be separate function !
    for (var seat of thisPlace.availableSeats) {
      const i = seat['i'];
      const j = seat['j'];

      this.checkboxes
        .filter(checkbox => checkbox.nativeElement.innerHTML[0] === i && checkbox.nativeElement.innerHTML[2] === j)
        .map(checkbox => checkbox.nativeElement.checked = true);
    }
  }

  onGridValueChanges() {
    this.addEditPlaceForm?.controls.availableGridRows.valueChanges.subscribe( val => {
      this.nrRows.next([...Array(val)]);
    });

    this.addEditPlaceForm?.controls.availableGridCols.valueChanges.subscribe( val => {
      this.nrCols.next([...Array(val)]);
    });
  }

  onAddOrEditPlace() {
    if(this.addEditPlaceForm.invalid || !this.addOrEdit)
    {
      return;
    }

    // This should be separate function !
    this.addEditPlaceForm.value.availableSeats = this.checkboxes
      .filter(checkbox => checkbox.nativeElement.checked)
      .map(checkbox => {
          const i = checkbox.nativeElement.innerHTML[0];
          const j = checkbox.nativeElement.innerHTML[2];
          return {i, j};
      });

    if (this.addOrEdit === 'add') {
      this._placesService.createPlaceAPIPromise(this.addEditPlaceForm.value as Place)
        .then(
          (data) => this.router.navigateByUrl('/admin-places')
        );
    } else if (this.addOrEdit === 'edit') {
      this._placesService.updatePlaceAPIPromise(this.addEditPlaceForm.value as Place)
      .then(
        (data) => this.router.navigateByUrl('/admin-places')
      );
    }
  }

}
