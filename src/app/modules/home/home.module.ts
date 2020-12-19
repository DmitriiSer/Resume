import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HomeComponent } from './home.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    // Material
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatRippleModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeModule { }
