import { Component, signal, inject } from '@angular/core';
import { FormsModule, FormControl } from "@angular/forms";

import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';

import { GlobalData } from "../services/global-data";

@Component({
  selector: 'app-transport1',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule
  ],
  templateUrl: './transport1.html',
  styleUrl: './transport1.scss',
})
export class Transport1 {
  data = inject(GlobalData);

  replayFromBeginning = () => {
    this.data.abortPlayback.set(true);
    setTimeout(() => {
      this.data.playCode(this.data.sampleTextCode)
    }, 2000);
  }
}
