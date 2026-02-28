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
  
  //-- set focus to first char, if playing 'coninuous', wait 3 seconds before starting...
  //
  replayCode = async () => {
    if (this.data.currentPlayMode() === 'continuous') {
      if (!this.data.audioCtx) {
        console.log(`No AudioContext !`);
      }  
  
      if (this.data.audioCtx.state === 'suspended') {
        await this.data.audioCtx.resume();
      }
      this.data.abortPlayback.set(true);
      for (const i of this.data.inputs) {
        i.value = '';
      }
      this.data.inputs[0].focus();
      setTimeout(() => {
        this.data.playCode(this.data.sampleTextCode)
      }, 2000);
    } else {
      this.data.inputs[this.data.currentPlayIndex()].focus();
      setTimeout(() => {
        this.data.playSingleCode(this.data.sampleSingleTextCode[this.data.currentPlayIndex()]);
      }, 1000);  
    }
  }

  playCode = async () => {
    if (!this.data.audioCtx) {
      console.log(`No AudioContext !`);
    }  

    if (this.data.currentPlayMode() === 'continuous') {
      if (this.data.currentPlayState() === 'paused') {
        this.data.inputs[this.data.currentPlayIndex()].focus();
        setTimeout(() => {
          this.data.playCode(this.data.sampleTextCode)
        }, 2000);  
      } else if (this.data.currentPlayState() === 'stopped') {
        this.data.inputs[0].focus();
        setTimeout(() => {
          this.data.playCode(this.data.sampleTextCode)
        }, 2000);  
      }  
    } else {
      if (this.data.currentPlayState() === 'stopped') {
        this.data.inputs[this.data.currentPlayIndex()].focus();
        await this.data.audioCtx.resume();
        this.data.currentPlayState.set('playing');
        setTimeout(() => {
          this.data.playSingleCode(this.data.sampleSingleTextCode[this.data.currentPlayIndex()]);
        }, 2000);  
      }  
    }  
  }  

  pause = async () => {
    await this.data.audioCtx.suspend();
    this.data.currentPlayState.set('paused');
  }
}
