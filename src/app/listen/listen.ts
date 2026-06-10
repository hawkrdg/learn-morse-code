import { Component, inject, ChangeDetectorRef, DOCUMENT } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button'; 
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GlobalData } from "../services/global-data";
import { Transport1 } from "../transport1/transport1"
@Component({
  selector: 'app-listen',
  imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSliderModule,
        MatIconModule,
        MatTooltipModule,
        Transport1
  ],
  templateUrl: './listen.html',
  styleUrl: './listen.scss',
})
export class Listen {
  data = inject(GlobalData);
  document = inject(DOCUMENT);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log(`ngOnInit() fires...`);
  }
  ngAfterViewInit() {
    console.log(`ngAfterViewInit() fires...`);
    this.generateSampleText();
    this.cdr.detectChanges();
  }

  generateSampleText = async () => {
    this.data.generateSampleText(this.data.blockCount)
    await this.data.delay(1000);
    this.cdr.detectChanges();
  }
}
