import { Component, inject, signal, ViewChild, DOCUMENT, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button'; 
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';

import { GlobalData } from "../services/global-data";
import { Transport3 } from "../transport3/transport3";
import { timestamp } from 'rxjs';

const testString = [
  {char: 'S', code: '...', isRead: signal(false)},
  {char: 'P', code: '.--.', isRead: signal(false)},
  {char: 'E', code: '.', isRead: signal(false)},
  {char: 'E', code: '.', isRead: signal(false)},
  {char: 'D', code: '-..', isRead: signal(false), addSpace: true},
  {char: 'T', code: '-', isRead: signal(false), newWord: true},
  {char: 'E', code: '.', isRead: signal(false)},
  {char: 'S', code: '...', isRead: signal(false)},
  {char: 'T', code: '-', isRead: signal(false)},
];


@Component({
  selector: 'app-send',
  imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSliderModule,
        MatIconModule,
        MatTooltipModule,
        MatRadioModule,
        Transport3,
  ],
  templateUrl: './send.html',
  styleUrl: './send.scss',
})
export class Send {
  data = inject(GlobalData);
  document = inject(DOCUMENT);
  window = this.document.defaultView;
  navigator = this.window.navigator;
  @ViewChild('selAlphabet') selAlphabet!: any;

  //-- control stuff...
  //
  codes = this.data.alphabet;
  testString = testString;
  codeString = [];
  codeResultString = [];
  codeIdx = signal(0);
  
  alphabet = this.data.testAlphabet;
  testIsRunning = signal(false);
  firstKeyDownTS = 0;
  lastKeyUpTS = 0;
  keyDownTS = 0;
  keyUpTS = 0;
  keyIsDown = signal(false);

  dotThreshold = 250;
  betweenCharThreshold = 600;
  betweenWordThreshold = 800;

  //-- result data...
  //
  dots = [];
  dashes = [];
  interChars = [];
  betweenChars = [];
  betweenWords = [];
  WPM = 0;
  testWPM = 0

  dotAvg:number     = 0;
  dotMin            = 0;
  dotMax            = 0;
  dotStdDev         = 0;

  dashAvg           = 0;
  dashMin           = 0;
  dashMax           = 0;
  dashStdDev        = 0;

  interCharAvg      = 0;
  interCharMin      = 0;
  interCharMax      = 0;
  interCharStdDev   = 0;

  betweenCharAvg    = 0;
  betweenCharMin    = 0;
  betweenCharMax    = 0;
  betweenCharStdDev = 0;

  betweenWordAvg    = 0;
  betweenWordMin    = 0;
  betweenWordMax    = 0;
  betweenWordStdDev = 0;


  constructor(private cdr: ChangeDetectorRef) {}  
  
  ngOnInit() {
    console.log(`ngOnInit() fires...`);
    this.testIsRunning.set(false);
    this.data.cancelCodeTest.set(false);
    this.generateSampleText();
    // this.data.inputs = this.document.getElementsByClassName('userTestInput');
  }
  
  ngAfterViewInit() {
    // this.data.sampleText = '';
  }

  generateSampleText = async () => {
    this.data.generateSampleText(this.data.blockCount)

    console.log(`sampleTextArray `, this.data.sampleTextArray);
  
    //-- build the testString......
    this.codeString = [];
    this.codeResultString = [];
    for (let idx = 0; idx < this.data.sampleTextArray.length; idx++) {
      const codeObj = {
        char: this.data.sampleTextArray[idx],
        code: this.data.sampleSingleTextCode[idx].replace('|', ''),
        isRead: signal(false)
      };
      this.codeString.push(codeObj);
      this.codeResultString.push('');
    }
    setTimeout(() => {
      this.cdr.detectChanges()
    }, 500);
  }

  //-- low level set key down/up timings...
  //

  onKeyDown = (ev) => {
    if (ev.repeat) {
      return;
    } else {
      this.keyIsDown.set(true);
      this.data.gainNode.gain.setValueAtTime(this.data.volume, 0);
      this.keyDownTS = performance.now();
    }
  }

  onKeyUp = (ev) => {
    this.keyIsDown.set(false);
    this.data.gainNode.gain.setValueAtTime(0, 0);
    this.keyUpTS = performance.now();
  }

  //-- methods for starting a tone or space...
  //

  waitForTone = () => {
    return new Promise<number>((resolve) => {
      const intervalId = setInterval(() => {
        if (this.data.cancelCodeTest()) {
          console.log(`waitForTone() - test cancelled...`);
          clearInterval(intervalId);
          resolve(0);
        }
        if (this.data.cancelPromise()) {
          console.log(`waitForTone() - promise cancelled...`);
          clearInterval(intervalId);
          resolve(0);
        }
        if (this.keyIsDown()) {
          resolve(this.keyDownTS);
          clearInterval(intervalId);
        }
      }, 10);
    });
  }

  waitForSpace = () => {
    return new Promise<number>((resolve) => {
      const intervalId = setInterval(() => {
        if (this.data.cancelCodeTest()) {
          console.log(`waitForTone() - test cancelled...`);
          clearInterval(intervalId);
          resolve(0);
        }
        if (this.data.cancelPromise()) {
          console.log(`waitForTone() - promise cancelled...`);
          clearInterval(intervalId);
          resolve(0);
        }
        if (!this.keyIsDown()) {
          resolve(this.keyUpTS);
          clearInterval(intervalId);
        }
      }, 10);
    });
  }

  //-- methods for setting timing props...
  //

  getTone = async () => {
    if (this.data.cancelCodeTest()) {
     return 0;
    }
    const start: any = await this.waitForTone();
    const end: any = await this.waitForSpace()
    return (end - start)
  }

  getTestTone = async (spaceStartTS) => {
    if (this.data.cancelCodeTest()) {
     return 0;
    }
    const start: any = await this.waitForTone();
    const end: any = await this.waitForSpace()
    return {toneLength: end - start, spaceLength: spaceStartTS === 0 ? 0 : start - spaceStartTS};
  }

  getSpace = async () => {
    if (this.data.cancelCodeTest()) {
     return 0;
    }
    const start: any = await this.waitForSpace();
    const end: any = await this.waitForTone()
    return (end - start);
  }

  getCharTiming = async (char) => {

    for (let idx = 0; idx < char.code.length; idx++) {
      if (this.data.cancelCodeTest()) {
        break;
      } else {
        const tTone = await this.getTone();
        if (idx === 0) {
          this.firstKeyDownTS = this.keyDownTS;
          if (this.lastKeyUpTS != 0) {
            if (char.newWord) {
              this.betweenWords.push(this.firstKeyDownTS - this.lastKeyUpTS);
            } else {
              this.betweenChars.push(this.firstKeyDownTS - this.lastKeyUpTS);
            }
          }
        }
        if (char.code[idx] === '.') {
          this.dots.push(tTone);
        } else {
          this.dashes.push(tTone);
        }
        if (idx < char.code.length - 1) {
          const tSpace = await this.getSpace()
          this.interChars.push(tSpace);
        }
        char.isRead.set(true);
      }
    }

    if (this.data.cancelCodeTest()) {
      return;
    }

    this.lastKeyUpTS = this.keyUpTS;
    console.log(`done...`, char);
  }

  getStringTiming = async (str) => {
    
    for (let idx = 0; idx < str.length; idx++) {
      if (this.data.cancelCodeTest()) {
        break;
      } else {
        await this.getCharTiming(str[idx]);
      }
    }

    if (this.data.cancelCodeTest()) {
      return;
    }

    this.testIsRunning.set(false);
    this.analyzeTest();
    this.testWPM = this.calcWPM(this.dotAvg)
    this.WPM = this.testWPM;
    console.log(`done with code string...`);

    //-- set testing thresholds...
    //
    this.dotThreshold = this.dashMin - 10;
    this.betweenCharThreshold = this.betweenCharMin;
    this.betweenWordThreshold = this.betweenCharMax + 20;
}

  startSpeedTest = async () => {
    const keypad = this.document.getElementById('key');
    this.firstKeyDownTS = 0;
    this.lastKeyUpTS = 0;
    this.alphabet = this.data.testAlphabet;
    this.WPM = 0;
    this.clearMeters();

    if (this.data.audioCtx.state != 'running') {
      this.data.audioCtx.resume();
    }

    this.testIsRunning.set(true);
    this.data.cancelCodeTest.set(false);
    keypad.focus();
    
    await this.getStringTiming(this.testString);
    
    if (this.data.cancelCodeTest()) {
      console.log(`Cancelling the test...`);
      this.testIsRunning.set(false);
    }
  }


  //-- methods for actual code test...
  //
  startCodeTest = async () => {
    const keypad = this.document.getElementById('key');
    this.firstKeyDownTS = 0;
    this.lastKeyUpTS = 0;
    this.codeIdx.set(0);
    this.alphabet = this.data.alphabet;
    this.clearMeters();

    if (this.data.audioCtx.state != 'running') {
      this.data.audioCtx.resume();
    }
    this.testIsRunning.set(true);
    this.data.cancelCodeTest.set(false);
    this.data.cancelPromise.set(false);
    keypad.focus();
    
    let code;
    let charCode = '';
    let currentChar;
    let lastKeyUpTS = 0;
    let firstTone = true;

    for (let idx = 0; idx < this.data.blockCount * 5; idx++) {
    // for (let idx = 0; idx < this.codeResultString.length; idx++) {
      this.codeIdx.set(idx);
      
      if (this.data.cancelCodeTest()) {
        break;
      }
      
      do {
        if (this.data.cancelCodeTest()) {
          break;
        }
        
        code = await this.getTestTone(firstTone ? 0 : lastKeyUpTS);
        
        if (code.toneLength > this.dotThreshold) {
          charCode += '-';
          this.dashes.push(code.toneLength);
        } else {
          charCode += '.';
          this.dots.push(code.toneLength);
        }
        // console.log(`getting? character idx ${idx}\n   charCode ${charCode}`);

        lastKeyUpTS = this.keyUpTS;

        // console.log(`tone ${code.toneLength} space ${code.spaceLength}`);

        if (code.spaceLength > this.betweenCharThreshold) {
          if (code.spaceLength > this.betweenWordThreshold) {
            this.betweenWords.push(code.spaceLength);
          } else {
            this.betweenChars.push(code.spaceLength);
          }

          currentChar = await this.alphabet.find(c => c.code === charCode.slice(0, charCode.length - 1
          ));
          if (currentChar === undefined) {
            this.codeResultString[idx] = '?';
          } else {
            this.codeResultString[idx] = currentChar.char;
          }

          charCode = charCode.slice(charCode.length - 1);
          console.log(`break...`);
          break;
        } else {
          if (!firstTone) {
            this.interChars.push(code.spaceLength);
          }
          firstTone = false;
        }

      } while (true);
      console.log(`currentChar[${idx}] ${this.codeResultString[this.codeIdx()]}`)
    }
    await this.testIsRunning.set(false);

    if (this.data.cancelCodeTest()) {
      console.log(`Cancelling the test...`);
    } else {
      this.analyzeTest();
      console.log(`done with code string...`);
    }
  }


  //-- methods for analyzing either the speed test code or the actual test string code...
  // 

  //-- zero out the result fields...
  //
  clearMeters = () => {
    this.testString.forEach(c => c.isRead.set(false));
    this.codeResultString.fill('');
    this.dots = [];
    this.dashes = [];
    this.interChars = [];
    this.betweenChars = [];
    this.betweenWords = [];
    // this.WPM = 0;
    
    this.dotMin = 0;
    this.dotMax = 0;
    this.dotAvg = 0;
    
    this.dashMin = 0;
    this.dashMax = 0;
    this.dashAvg = 0;

    this.interCharMin = 0;
    this.interCharMax = 0;
    this.interCharAvg = 0;
    
    this.betweenCharMin = 0;
    this.betweenCharMax = 0;
    this.betweenCharAvg = 0;

    this.betweenWordMin = 0;
    this.betweenWordMax = 0;
    this.betweenWordAvg = 0;

    this.dotStdDev = 0;
    this.dashStdDev = 0;
    this.interCharStdDev = 0;
    this.betweenCharStdDev = 0;
    this.betweenWordStdDev = 0;
    this.firstKeyDownTS = 0;
    this.lastKeyUpTS = 0;
  }

  //-- calculate WPM...
  //
  calcWPM = (avg) => {
    return (avg > 0 ? Math.floor((1200 / avg)) : 0);
  }

  //-- get the stats...
  //
  analyzeTest = () => {
    //-- dots...
    //
    if (this.dots.length > 1) {
      this.dotAvg = (this.dots.reduce((a, b) => a + b, 0) / this.dots.length);
      this.dotMax = Math.max(...this.dots);
      this.dotMin = Math.min(...this.dots);
      this.dotStdDev = this.getStandardDeviation(this.dots);
    } else {
      this.dotAvg = 0;
      this.dotMax = 0;
      this.dotMin = 0;
      this.dotStdDev = 0.0;
    }

    //-- dashes...
    //
    if (this.dashes.length > 1) {
      this.dashAvg = this.dashes.reduce((a, b) => a + b, 0) / this.dashes.length;
      this.dashMax = Math.max(...this.dashes);
      this.dashMin = Math.min(...this.dashes);
      this.dashStdDev = this.getStandardDeviation(this.dashes);
    } else {
      this.dashAvg =  0;
      this.dashMax =  0;
      this.dashMin =  0;
      this.dashStdDev = 0.0;
    }

    //-- interChars...
    //
    if (this.interChars.length > 1) {
      this.interCharAvg = this.interChars.reduce((a, b) => a + b, 0) / this.interChars.length;
      this.interCharMax = Math.max(...this.interChars);
      this.interCharMin = Math.min(...this.interChars);
      this.interCharStdDev = this.getStandardDeviation(this.interChars);
    } else {
      this.interCharAvg = 0;
      this.interCharMax = 0;
      this.interCharMin = 0;
      this.interCharStdDev = 0.0;
    }

    //-- betweenChars...
    //
    if (this.betweenChars.length > 1) {
      this.betweenCharAvg = this.betweenChars.reduce((a, b) => a + b, 0) / this.betweenChars.length;
      this.betweenCharMax = Math.max(...this.betweenChars);
      this.betweenCharMin = Math.min(...this.betweenChars);
      this.betweenCharStdDev = this.getStandardDeviation(this.betweenChars);
    } else {
      this.betweenCharAvg = 0;
      this.betweenCharMax = 0;
      this.betweenCharMin = 0;
      this.betweenCharStdDev = 0.0;
    }

    // betweenWords...
    //
    if (this.betweenWords.length > 1) {
      this.betweenWordAvg = this.betweenWords.reduce((a, b) => a + b, 0) / this.betweenWords.length;
      this.betweenWordMax = Math.max(...this.betweenWords);
      this.betweenWordMin = Math.min(...this.betweenWords);
      this.betweenWordStdDev = this.getStandardDeviation(this.betweenWords);
    } else if (this.betweenWords.length === 1) {
      this.betweenWordAvg = this.betweenWords[0];
      this.betweenWordMax = this.betweenWords[0];
      this.betweenWordMin = this.betweenWords[0];
      this.betweenWordStdDev = 0.0;
    } else {
      this.betweenWordAvg = 0;
      this.betweenWordMax = 0;
      this.betweenWordMin = 0;
      this.betweenWordStdDev = 0.0;
    }

    //-- WPM...
    //
    this.WPM = this.calcWPM(this.dotAvg);
  }

  //-- calc std dev for results...
  //
  getStandardDeviation = (array) => {
    const n = array.length;
    if (n < 2) return 0;
  
    // 1. Calculate the mean
    const mean = array.reduce((a, b) => a + b) / n;
  
    // 2. Calculate the variance (average of squared differences from mean)
    const variance = array
      .map(x => Math.pow(x - mean, 2))
      .reduce((a, b) => a + b) / (n - 1);
  
    // 3. Standard deviation is the square root of variance
    return Math.sqrt(variance);
  };

}
