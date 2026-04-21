import { Component, inject } from '@angular/core';
import { GlobalData } from "../services/global-data";

@Component({
  selector: 'app-about',
  imports: [
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  data = inject(GlobalData);

}
