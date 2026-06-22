import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { GlobalData } from "../services/global-data";

@Component({
  selector: 'app-the-code',
  imports: [],
  templateUrl: './the-code.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './the-code.scss',
})
export class TheCode {
  data = inject(GlobalData);

}
