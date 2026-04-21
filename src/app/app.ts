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
  tabIdx = signal(1);
  playMode;

  ngOnInit() {
    console.log(`ngOnInit() fires...`);
  }

  ngAfterViewInit() {
    console.log(`ngAfterViewInit() fires...`);
    this.data.updateWPM();
    this.data.updateAlphabet(this.data.alphaOptions[0]);
    this.changeMainTab(1);
  }

  changeMainTab = (idx) => {
    console.log(`change tab to ${idx}...`);
    switch (idx) {
      case 0:
        this.data.audioPower.set(true);
        break;
      case 1:
        this.data.audioPower.set(false);
        break;
      case 2:
        this.data.audioPower.set(false);
        break;
      case 3:
        this.data.audioPower.set(true);
        break;
      case 4:
        this.data.audioPower.set(true);
        break;
      default:
        this.data.audioPower.set(true);
        break;
    }
  }

  //-- cancel any web audio stuff and release...
  //
  tabChangeHandler = async () => {
    this.data.abortPlayback.set(true);
    if (this.data.audioCtx) {
      this.data.audioPower.set(false);
      this.data.oscillator.stop();
      this.data.oscillator.disconnect();
      this.data.gainNode.disconnect();
      this.data.audioCtx.close();
      this.data.gainNode = null;
      this.data.oscillator = null;
      this.data.audioCtx = null;
    }
    this.data.currentPlayIndex.set(0);
    this.data.currentPlayState.set('stopped');
    this.changeMainTab(this.tabIdx());
  }
}
