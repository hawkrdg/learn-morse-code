import { Component, inject, model, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button'; 
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';

import { GlobalData } from "../services/global-data";
import { Transport2 } from "../transport2/transport2";

@Component({
  selector: 'app-test',
  imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSliderModule,
        MatIconModule,
        MatTooltipModule,
        MatRadioModule,
        Transport2,
  ],
  templateUrl: './test.html',
  styleUrl: './test.scss',
})
export class Test {
  data = inject(GlobalData);
  
  constructor(private cdr: ChangeDetectorRef) {}  
  
  ngAfterViewInit() {
    this.data.sampleText = '';
    // setTimeout(() => {
      this.generateSampleText()
    // }, 4000);
  }

  tabNextChar = (idx: number) => {
    const newInput = this.data.inputs[idx + 1];
    newInput.focus()
    if (this.data.currentPlayMode() === 'single') {
      console.log(`tab idx ${idx}`);
      setTimeout(() => {
        this.data.playSingleCode(this.data.sampleSingleTextCode[idx + 1]);
        this.data.currentPlayIndex.set(idx + 1);
      }, 1500);
    }
  }

  enterNextChar = (idx: number) => {
    const newInput = this.data.inputs[idx + 1];
    newInput.focus()
    if (this.data.currentPlayMode() === 'single') {
      console.log(`enter idx ${idx}`);
      setTimeout(() => {
        this.data.playSingleCode(this.data.sampleSingleTextCode[idx + 1]);
        this.data.currentPlayIndex.set(idx + 1);
      }, 1500);
    }
  }

  generateSampleText = async () => {
    this.data.sampleText = '';
    this.data.generateSampleText(this.data.blockCount)
    await this.data.audioCtx.suspend();
    this.data.currentPlayState.set('stopped');
    
    setTimeout(() => {
      for (const i of this.data.inputs) {
        i.value = '';
      }
      this.data.inputs[0].focus();
    }, 500);
    this.cdr.detectChanges()
  }
}
