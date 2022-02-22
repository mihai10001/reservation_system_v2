import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './main-layout.component';

import { MainLayoutRoutingModule } from './main-layout-routing.module';


@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainLayoutRoutingModule
  ]
})
export class MainLayoutModule { }
