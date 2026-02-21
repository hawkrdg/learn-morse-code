import { Component, inject, ViewChild, ViewChildren, QueryList, ElementRef, DOCUMENT } from '@angular/core';

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
  document = inject(DOCUMENT);
  window = this.document.defaultView;
  currentIndex = 0;
  @ViewChild(Transport2) transportRef!: Transport2;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  playMode = 'continuous';  //-- continuous or single
  currentCodeIndex = 0;

  ngAfterViewInit() {
    this.data.sampleText = '';
    // setTimeout(() => {
      this.generateSampleText()
    // }, 4000);
  }

  showTestChar = (idx) => {
    this.data.testInputVisibilityArray[idx] = false;
  }

  focusInput = (idx) => {
    this.showTestChar(idx)
    const newInput = this.inputs.find((x, i) => i === idx + 1);
    newInput.nativeElement.focus()
    if (this.playMode === 'single') {
      console.log(`idx ${idx}`);
      setTimeout(() => {
        this.data.playSingleCode(this.data.sampleSingleTextCode[idx + 1]);
      }, 1500);
    }
  }

  generateSampleText = () => {
    this.data.sampleText = '';
    this.data.generateSampleText(this.data.blockCount)
    setTimeout(() => {
      this.inputs.forEach(i => i.nativeElement.value = '');
      this.inputs.first.nativeElement.focus();
    }, 500);
  }
}
