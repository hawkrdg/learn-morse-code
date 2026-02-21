import { Component, input, model, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';

import { GlobalData } from "../services/global-data";

@Component({
  selector: 'app-transport2',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    MatRadioModule
  ],
  templateUrl: './transport2.html',
  styleUrl: './transport2.scss',
})
export class Transport2 {
  data = inject(GlobalData);
  inputs = input<any>([]);
  currentCodeIndex = input<number>(0);
  playMode = model('single');  //-- continuous or single

  
  //-- set focus to first char, if playing 'coninuous', wait 3 seconds before starting...
  //
  playCode = () => {
    this.inputs().first.nativeElement.focus();
    if (this.playMode() === 'continuous') {
      setTimeout(() => {
        this.data.playCode(this.data.sampleTextCode);
      }, 3000);
    } else {
      setTimeout(() => {
        this.data.playSingleCode(this.data.sampleSingleTextCode[this.currentCodeIndex()]);
      }, 1000);
    }
  }

  replayCode = () => {
    this.data.playSingleCode(this.data.sampleTextCode[this.currentCodeIndex()]);
  }

  pause = () => {
    if (this.playMode() === 'continuous') {
      this.data.audioCtx.suspend();
    }
  }
}
