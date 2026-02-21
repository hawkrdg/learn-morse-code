import { Component, inject, DOCUMENT } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button'; 
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GlobalData } from "../services/global-data";
import { Transport1 } from "../transport1/transport1";

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
        Transport1,
  ],
  templateUrl: './listen.html',
  styleUrl: './listen.scss',
})
export class Listen {
  data = inject(GlobalData);

}
