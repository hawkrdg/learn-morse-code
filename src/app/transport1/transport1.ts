import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './transport1.scss',
})
export class Transport1 {
  data = inject(GlobalData);

  replayCode = async () => {
    if (this.data.audioCtx.state === 'suspended') {
      await this.data.audioCtx.resume();
    }
    this.data.abortPlayback.set(true);
    setTimeout(() => {
      this.data.currentPlayState.set('playing');
      this.data.playCode(this.data.sampleTextCode)
    }, 2000);
  }
  
  playCode = async () => {
    if (this.data.audioCtx.state === 'suspended') {
      await this.data.audioCtx.resume()
    }

    if (this.data.currentPlayState() != 'playing') {
      this.data.abortPlayback.set(false);
      this.data.currentPlayState.set('playing');
      this.data.currentPlayIndex.set(0);
      setTimeout(() => {
        this.data.playCode(this.data.sampleTextCode)
      }, 2000);  
    }
  }

  pause = async () => {
    if (this.data.currentPlayState() === 'paused') {
      this.data.currentPlayState.set('playing');
      await this.data.audioCtx.resume();
    } else {
      this.data.audioCtx.suspend();
      this.data.currentPlayState.set('paused');
    }
  }
}
