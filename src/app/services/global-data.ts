import { Injectable, signal, inject, DOCUMENT } from '@angular/core';

const alphaOptions = [
  {display: 'Alpha Only ', mode: 'alpha'},
  {display: 'Numbers', mode: 'num'},
  {display: 'Punctuation 1', mode: 'punc1'},
  {display: 'Punctuation 2', mode: 'punc2'},
  {display: 'AlphaNum', mode: 'alphanum'},
  {display: 'AlphaPunc1', mode: 'alphapunc1'},
  {display: 'AlphaPunc2', mode: 'alphapunc2'},
  {display: 'AlphaPunc', mode: 'alphapunc'},
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

const punctuationCode1 = [
  {char: '.', code: '.-.-.-'},
  {char: ',', code: '--..--'}, 
  {char: '?', code: '..--..'},
  {char: ':', code: '--...'}, 
  {char: ';', code: '-.-.-.'}, 
  {char: '/', code: '-..-.'},
  {char: '@', code: '.--.-.'},
  {char: '&', code: '.-...'}
];

const punctuationCode2 = [
  {char: '(', code: '-.--.'}, 
  {char: ')', code: '-.--.-'},
  {char: '=', code: '-...-'},
  {char: '+', code: '.-.-.'}, 
  {char: '-', code: '-....-'},
  {char: '"', code: '.-..-.'}, 
  {char: '!', code: '-.-.--'}, 
  {char: '_', code: '..--.-'} 
];

@Injectable({
  providedIn: 'root',
})
export class GlobalData {
  document = inject(DOCUMENT);
  window = document.defaultView;
  inputs: any = this.document.getElementsByClassName('userTestInput');
  alphabet = alphaCode;
  alphaOptions = alphaOptions;
  sampleText = '';
  sampleTextArray = []
  sampleTextCode = [];
  sampleSingleTextCode = [];
  blockCount = 10;
  blockCountIndex = [];
  currentPlayMode = signal('continuous')
  currentPlayState = signal('suspended')
  currentPlayIndex = signal(0);
  abortPlayback = signal(false);
  audioFlag = signal(false);
  
  //-- tone generator...
  audioPower = signal(false);
  audioCtx = null;
  oscillator = null;
  gainNode = null;
  volume = 0.05;

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
      // if (this.audioCtx) {
      //   this.audioCtx.resume();
      // } else {
        this.audioCtx = new window.AudioContext();
        this.audioCtx.resume();
        this.oscillator = new OscillatorNode(this.audioCtx, {type: 'sine', frequency: 650});
        this.oscillator.start();
        this.gainNode = new GainNode(this.audioCtx, {gain: 0.0});
        this.oscillator.connect(this.gainNode).connect(this.audioCtx.destination);
      // }
    }
  }

  //-- alert user to turn on audio...
  //
  showNoAudioMsg = (ms) => {
    this.audioFlag.set(true);
    setTimeout(() => {
      this.audioFlag.set(false);
    }, ms);
  }
  
  updateWPM = () => {
    this.dot = 1200 / this.wpm;
    this.dash = 3600 / this.wpm;
    this.interChar = 1500 / this.wpm;
    this.charSpace = 3600 / this.wpm;
    this.wordSpace = 8800 / this.wpm;
  }

  updateAlphabet = (ev) => {
    console.log(`ev: ${JSON.stringify(ev)}`)
    this.characterMode = ev;

    switch (this.characterMode.mode) {
      case 'alpha':
        this.alphabet = alphaCode;    
        break;
      case 'num':
        this.alphabet = numberCode;    
        break;
      case 'punc1':
        this.alphabet = punctuationCode1;    
        break;
      case 'punc2':
        this.alphabet = punctuationCode2;    
        break;
      case 'alphanum':
        this.alphabet = alphaCode.concat(numberCode);    
        break;
      case 'alphapunc1':
        this.alphabet = alphaCode.concat(punctuationCode1);    
        break;
      case 'alphapunc2':
        this.alphabet = alphaCode.concat(punctuationCode2);
        break;
      case 'alphapunc':
        this.alphabet = alphaCode.concat(punctuationCode1).concat(punctuationCode2);    
        break;
      case 'all':
        this.alphabet = alphaCode.concat(numberCode).concat(punctuationCode1).concat(punctuationCode2);
        break;
    }
    this.generateSampleText(this.blockCount);
  }

  //-- this promise will not resolve until audioCtx.state = 'running'...
  //   polls every 500ms
  //
  waitForPlayback = () => {
    return new Promise((resolve) => {
      if (this.currentPlayState() === 'playing') {
        resolve(true);
      } else {
        const intervalId = setInterval(() => {
          if (this.currentPlayState() === 'playing') {
            resolve(true);
            clearInterval(intervalId);
          }
        }, 100);
      }
    });
  }

  delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
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

  promisePlayDot = () => {
    return new Promise((resolve) => {
      this.gainNode.gain.setValueAtTime(this.volume, 0);
      setTimeout(() => {
        this.gainNode.gain.setValueAtTime(0, 0);
        setTimeout(() => {
          resolve('OK');
        }, this.interChar);
      }, this.dot);
    })
  }

  playDash = async () => {
    this.gainNode.gain.setValueAtTime(this.volume, 0);
    await this.delay(this.dash).then(() => {});
    this.gainNode.gain.setValueAtTime(0, 0);
    await this.delay(this.interChar).then(() => {});
  }

  promisePlayDash = () => {
    return new Promise((resolve) => {
      this.gainNode.gain.setValueAtTime(this.volume, 0);
      setTimeout(() => {
        this.gainNode.gain.setValueAtTime(0, 0);
        setTimeout(() => {
          resolve('OK');
        }, this.interChar);
      }, this.dash);
    })
  }

  test1 = async () => {
    await this.promisePlayDash();
    await this.promisePlayCharSpace()
    await this.promisePlayDot();
    await this.promisePlayCharSpace()
    await this.promisePlayDot();
    await this.promisePlayDot();
    await this.promisePlayDot();
    await this.promisePlayCharSpace()
    await this.promisePlayDash();
    await this.promisePlayCharSpace()
    await this.promisePlayDot();
    await this.promisePlayDot();
    await this.promisePlayCharSpace()
    await this.promisePlayDash();
    await this.promisePlayDot();
    await this.promisePlayCharSpace()
    await this.promisePlayDash();
    await this.promisePlayDash();
    await this.promisePlayDot();
    await this.promisePlayWordSpace();
    await this.promisePlayDot();
    await this.promisePlayDash();
    await this.promisePlayCharSpace()
    await this.promisePlayDash();
    await this.promisePlayDash();
    await this.promisePlayDot();
    await this.promisePlayCharSpace()
    await this.promisePlayDot();
    await this.promisePlayDash();
    await this.promisePlayCharSpace()
    await this.promisePlayDot();
    await this.promisePlayDot();
    await this.promisePlayCharSpace()
    await this.promisePlayDash();
    await this.promisePlayDot();
  }

  test2 = async () => {
    const code = '-|.|...|-^.-|--.|.-|..|-.';
    for (const c of code) {
      await this.promisePlaySingleCode(c);
    }
  }

  playCharSpace = async () => {
    await this.delay(this.charSpace).then(() => {});
  }

  promisePlayCharSpace = () => {
    return new Promise((resolve) => {
      setTimeout(()=> {
        resolve('OK');
      }, this.charSpace);
    });
  }

  playWordSpace = async () => {
    await this.delay(this.wordSpace).then(() => {});
  }

  promisePlayWordSpace = () => {
    return new Promise((resolve) => {
      setTimeout(()=> {
        resolve('OK');
      }, this.wordSpace);
    });
  }

  playSingleCode = async (str) => {
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

  promisePlaySingleCode = async (str) => {
    if (this.audioCtx.state === 'running') {
      for (const c of str) {
        switch (c) {
          case '.':
            await this.promisePlayDot();
            break;
          case '-':
            await this.promisePlayDash();
            break;
          case '|':
            await this.promisePlayCharSpace();
            break;
          case '^':
            await this.promisePlayWordSpace();
            break;
          default:
            break;
        }
      }
    }
  }

  playCode = async (codeStrArray) => {
    let idx;
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    
    if (this.inputs[0]) {
      for (const i of this.inputs) {
        i.value = '';
      }
    }
    
    this.currentPlayState.set('playing');
    for (idx = 0; idx < codeStrArray.length; idx++) {

      this.currentPlayIndex.set(idx);

      if (this.currentPlayState() === 'paused') {
        await this.waitForPlayback().then(
          async data => {
            if (this.inputs.length > 0) {
              this.inputs[this.currentPlayIndex()].focus();
            }
          }
        );
      }
      //-- abort if some other event wants to stop playback...
      //
      if( this.abortPlayback()) {
        this.currentPlayState.set('stopped');
        this.abortPlayback.set(false);
        break
      }
      
      //-- one char at a time, break code strings into char arrays and play each one...
      //
      const code = codeStrArray[idx];
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
    this.currentPlayIndex.set(0);
    this.inputs[0].focus();
    this.currentPlayState.set('stopped');
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
  generateSampleText = async (blocks) => {
    this.sampleText = '';

    //-- clean up any current playback...
    //
    this.abortPlayback.set(true);
    if (this.audioCtx) {
      await this.audioCtx.suspend();
    }
    this.currentPlayIndex.set(0);
    this.currentPlayState.set('stopped');
    //-- build the string...
    //
    let previousChar = '';
    let newChar = '';

    for (let b = 0; b < blocks; b++) {
      for (let idx = 0; idx < 5; idx++) {
        //-- added to prevent duplicate characters...
        //
        while (newChar === previousChar) {
          newChar = this.alphabet[this.getRandomAphaIdx(this.alphabet.length)].char;
        }
        previousChar = newChar;
        this.sampleText += newChar;
      }
      this.sampleText += ' ';
    }

    //-- setup all the props...
    //
    this.sampleText = this.sampleText.trim();
    
    const rawTextCode = this.tokenizeString(this.sampleText);

    this.sampleTextCode = [];
    this.sampleSingleTextCode = [];
    rawTextCode.forEach(c => {
      if (c != '^') {
        this.sampleTextCode.push(c);
        this.sampleSingleTextCode.push(c);
      }
    });

    rawTextCode.forEach((c, idx) => {
      if (c === '^') {
        this.sampleTextCode[idx - (idx %5) - 1] += '^';
      }
    });
    // this.sampleTextCode = this.tokenizeString(this.sampleText);
    
    for (const i of this.inputs) {
      i.value = '';
    }
    this.sampleText = this.sampleText.replaceAll(' ', '');
    this.sampleTextArray = [...this.sampleText];

    this.blockCountIndex = [];
    for (let i = 0; i < this.blockCount; i++) {
      this.blockCountIndex.push(i);
    }
  }
}
