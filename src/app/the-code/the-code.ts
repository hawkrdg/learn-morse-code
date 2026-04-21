import { Component, inject } from '@angular/core';
import { GlobalData } from "../services/global-data";

@Component({
  selector: 'app-the-code',
  imports: [],
  templateUrl: './the-code.html',
  styleUrl: './the-code.scss',
})
export class TheCode {
  data = inject(GlobalData);

}
