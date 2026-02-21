import { Component, signal, inject } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav'; 

import { GlobalData } from "./services/global-data";
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher.component";
import { TheCode } from "./the-code/the-code";
import { Listen } from "./listen/listen";
import { Test } from "./test/test";
import { Send } from "./send/send";
import { About } from "./about/about";

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatSidenavModule,
    ThemeSwitcherComponent,
    TheCode,
    Listen,
    Test,
    Send,
    About
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Learn Morse Code');
  data = inject(GlobalData);
  tabIdx = signal(2);
  playMode;

  ngOnInit() {
    console.log(`ngOnInit() fires...`);
  }

  ngAfterViewInit() {
    console.log(`ngAfterViewInit() fires...`);
    this.data.updateWPM();
    this.data.updateAlphabet(this.data.alphaOptions[0]);
  }

  changeMainTab = (idx) => {
    console.log(`change tab to ${idx}...`);
    this.tabIdx.set(idx);
  }

  //-- cancel any web audio stuff and release...
  //
  tabChangeHandler = () => {
      this.data.audioPower.set(false);
      this.data.oscillator.stop();
      this.data.oscillator.disconnect();
      this.data.gainNode.disconnect();
      this.data.audioCtx.close();
      this.data.gainNode = null;
      this.data.oscillator = null;
      this.data.audioCtx = null;
  }
}
