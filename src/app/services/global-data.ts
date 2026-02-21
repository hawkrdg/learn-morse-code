import { Injectable, signal, inject, DOCUMENT } from '@angular/core';

const alphaOptions = [
  {display: 'Alpha Only ', mode: 'alpha'},
  {display: 'AlphaNum', mode: 'alphanum'},
  {display: 'Numbers', mode: 'num'},
  {display: 'Punctuation', mode: 'punc'},
  {display: 'All...', mode: 'all'}
];

const alphaCode = [
  {char: 'A', code: '.-'},
  {char: 'B', code: '-...'}, 
  {char: 'C', code: '-.-.'},
  {char: 'D', code: '-..'}, 
  {char: 'E', code: '.'},
  {char: 'F', code: '..-.'}, 
  {char: 'G', code: '--.'},
  {char: 'H', code: '....'}, 
  {char: 'I', code: '..'},
  {char: 'J', code: '.---'}, 
  {char: 'K', code: '-.-'},
  {char: 'L', code: '.-..'}, 
  {char: 'M', code: '--'},
  {char: 'N', code: '-.'}, 
  {char: 'O', code: '---'},
  {char: 'P', code: '.--.'}, 
  {char: 'Q', code: '--.-'},
  {char: 'R', code: '.-.'}, 
  {char: 'S', code: '...'},
  {char: 'T', code: '-'}, 
  {char: 'U', code: '..-'},
  {char: 'V', code: '...-'}, 
  {char: 'W', code: '.--'},
  {char: 'X', code: '-..-'}, 
  {char: 'Y', code: '-.--'},
  {char: 'Z', code: '--..'}, 
]

const numberCode = [
  {char: '0', code: '-----'},
  {char: '1', code: '.----'}, 
  {char: '2', code: '..---'},
  {char: '3', code: '...--'}, 
  {char: '4', code: '....-'},
  {char: '5', code: '.....'}, 
  {char: '6', code: '-....'},
  {char: '7', code: '--...'}, 
  {char: '8', code: '---..'},
  {char: '9', code: '----.'}, 
]

const punctuationCode = [
  {char: '.', code: '.-.-.-'},
  {char: ',', code: '--..--'}, 
  {char: '?', code: '..--..'},
  {char: '\'', code: '.----.'}, 
  {char: '/', code: '-..-.'},
  {char: '(', code: '-.--.'}, 
  {char: ')', code: '-.--.-'},
  {char: ':', code: '--...'}, 
  {char: '=', code: '-...-'},
  {char: '+', code: '.-.-.'}, 
  {char: '-', code: '-....-'},
  {char: '"', code: '.-..-.'}, 
  {char: '@', code: '.--.-.'},
  {char: '!', code: '-.-.--'}, 
  {char: '&', code: '.-...'},
  {char: ';', code: '-.-.-.'}, 
  {char: '_', code: '..--.-'} 

];

@Injectable({
  providedIn: 'root',
})
export class GlobalData {
  document = inject(DOCUMENT);
  window = document.defaultView;
  alphabet = alphaCode;
  alphaOptions = alphaOptions;
  sampleText = '';
  sampleTextArray = []
  testInputVisibilityArray = [];
  sampleTextIndex = [];
  testInputIndex = [];
  sampleTextCode = [];
  sampleSingleTextCode = [];
  blockCount = 10;
  blockCountIndex = [];
  currentPlayIndex = signal(0);
  abortPlayback = signal(false)
  
  //-- tone generator...
  audioPower = signal(false);
  audioCtx = null;
  oscillator = null;
  gainNode = null;
  volume = 0.05;
  isPlaying = signal(false);

  //-- code stuff (dot.ms = 1200/wpm)
  wpm = 10;
  dot;
  dash;
  interChar;
  charSpace;
  wordSpace;
  characterMode = this.alphaOptions[0];

  //-- util...
  //
  toggleAudioPower = () => {
    if (this.audioPower()) {
      this.audioPower.set(false);
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.gainNode.disconnect();
      this.audioCtx.close();
      this.gainNode = null;
      this.oscillator = null;
      this.audioCtx = null;
    } else {
      this.audioPower.set(true);
      if (this.audioCtx) {
        this.audioCtx.resume();
      } else {
        this.audioCtx = new window.AudioContext();
        this.audioCtx.resume();
        this.oscillator = new OscillatorNode(this.audioCtx, {type: 'sine', frequency: 650});
        this.oscillator.start();
        this.gainNode = new GainNode(this.audioCtx, {gain: 0.0});
        this.oscillator.connect(this.gainNode).connect(this.audioCtx.destination);
      }
    }
  }

  updateWPM = () => {
    this.dot = 1200 / this.wpm;
    this.dash = 3600 / this.wpm;
    this.interChar = 1500 / this.wpm;
    this.charSpace = 3600 / this.wpm;
    this.wordSpace = 8400 / this.wpm;
  }

  updateAlphabet = (ev) => {
    console.log(`ev: ${JSON.stringify(ev)}`)
    this.characterMode = ev;

    switch (this.characterMode.mode) {
      case 'alpha':
        console.log(`setting alpha`)
        this.alphabet = alphaCode;    
        break;
      case 'alphanum':
        console.log(`setting alphanum`)
        this.alphabet = alphaCode.concat(numberCode);    
        break;
      case 'num':
        this.alphabet = numberCode;    
        break;
      case 'punc':
        this.alphabet = punctuationCode;    
        break;
      case 'all':
        this.alphabet = alphaCode.concat(numberCode).concat(punctuationCode);    
        break;
    }
    // this.generateSampleText(this.blockCount);
  }

  //-- this promise will not resolve until audioCtx.state = 'running'...
  //   polls every 500ms
  //
  waitForPlayback = () => {
    return new Promise((resolve) => {
      if (this.audioCtx.state === 'running') {
        resolve(true);
      } else {
        const intervalId = setInterval(() => {
          if (this.audioCtx.state === 'running') {
            resolve(true);
            clearInterval(intervalId);
          }
        }, 500);
      }
    });
  }

  delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    }).then(() => {
      'delay'
    });
  }

  //-- basic audio playback...
  //
  playDot = async () => {
    this.gainNode.gain.setValueAtTime(this.volume, 0);
    await this.delay(this.dot).then(() => {});
    this.gainNode.gain.setValueAtTime(0, 0);
    await this.delay(this.interChar).then(() => {});
  }

  playDash = async () => {
    this.gainNode.gain.setValueAtTime(this.volume, 0);
    await this.delay(this.dash).then(() => {});
    this.gainNode.gain.setValueAtTime(0, 0);
    await this.delay(this.interChar).then(() => {});
  }

  playCharSpace = async () => {
    await this.delay(this.charSpace).then(() => {});
  }

  playWordSpace = async () => {
    await this.delay(this.wordSpace).then(() => {});
  }

  playSingleCode = async (str) => {
    let returnValue = 'OK';

    if (this.audioCtx.state === 'running') {
      for (const c of str) {
        switch (c) {
          case '.':
            await this.playDot();
            break;
          case '-':
            await this.playDash();
            break;
          case '|':
            await this.playCharSpace();
            break;
          case '^':
            await this.playWordSpace();
            break;
          default:
            break;
        }
      }
    }
  }

  playCode = async (str) => {
    let returnValue = 'OK';
    this.abortPlayback.set(false);

    if (this.audioCtx.state === 'running') {
      for (let i = 0; i < str.length; i++) {
        //-- abort if some other event wants to stop playback...
        //
        if( this.abortPlayback()) {
          returnValue = 'ABORT';
          break
        }
        this.currentPlayIndex.set(i);
        const codeStr = str[i];

        //-- pause if another event sets audioCtx.state = 'suspended'
        //   this will not resolve until audioCtx.state = 'running'...
        //
        await this.waitForPlayback();

        //-- one char at a time, break code strings into char arrays and play each one...
        //
        const code = [...codeStr];
        for (const c of code) {
          switch (c) {
            case '.':
              await this.playDot();
              break;
            case '-':
              await this.playDash();
              break;
            case '|':
              await this.playCharSpace();
              break;
            case '^':
              await this.playWordSpace();
              break;
            default:
              break;
          }
        }
      }
    } else {

      //-- player was paused, this resumes play...
      //
      this.audioCtx.resume();
      returnValue = 'RESUME';
    };
    return returnValue;
  }
    
  getRandomAphaIdx = (chars) => {
    const min = Math.ceil(0);
    const max = Math.floor(chars - 1);
    return Math.floor(Math.random() * (max - min + 1));
  }

  tokenizeString = (str) => {
    const wordStr = str.replaceAll(' ', '^');
    const charArray = [...wordStr];
    let returnChar;
    let codeStrArray = [];

    charArray.forEach(c => {
      if(c != '^') {
        const charObj = this.alphabet.find(obj => obj.char === c);
        if (charObj != undefined) {
          codeStrArray.push(charObj.code + '|');
        }
      } else {
        codeStrArray.push(c);
      }
    });
    return codeStrArray;
  }

  //-- get random string blocks...
  //   sampleTstArray[] - get random letter groups based on different alphabets
  //   sampleTextCode[] - tokenize for playback: '|' = charSpace, '^' = wordSpace... 
  //   sampleSingleTextCode[] - strip '^' for single character playback
  //
  generateSampleText = (blocks) => {
    this.sampleText = '';

    //-- clean up any current playback...
    //
    this.abortPlayback.set(true);
    if (this.audioCtx) {
      this.audioCtx.resume();
    }
    this.currentPlayIndex.set(0);

    //-- build the string...
    //
    for (let b = 0; b < blocks; b++) {
      for (let idx = 0; idx < 5; idx++) {
        this.sampleText += this.alphabet[this.getRandomAphaIdx(this.alphabet.length)].char;
      }
      this.sampleText += ' ';
    }

    //-- setup all the props...
    //
    this.sampleText = this.sampleText.trim();
    this.sampleTextArray = [...this.sampleText];
    this.sampleTextIndex = this.sampleTextArray.map((c, idx) => idx);
    this.testInputVisibilityArray = this.sampleTextArray.map((c) => true);
    this.sampleTextCode = this.tokenizeString(this.sampleText);
    this.sampleSingleTextCode = [];
    this.sampleTextCode.forEach(c => {
      if (c != '^') {
        this.sampleSingleTextCode.push(c);
      }
    });

    this.blockCountIndex = [];
    for (let i = 0; i < this.blockCount; i++) {
      this.blockCountIndex.push(i);
    }
  }
}
