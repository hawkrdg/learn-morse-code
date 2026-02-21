# Learn Morse Code
## A simple WebAPP to learn and practice morse code
Learn the code for letters, numbers, and punctuation. Listen to code at various WPM speeds. Test your knowledge. Plug your 'code practice oscillator' into your 'mic' jack and test your fist.

The app has a number of tabs:
1. The actual code and timing rules...
2. Listen to random code blocks. You set the WPM speed. Train our ear and learn the characters...
3. Listen to code and type in what you hear. You will then see the actual character. Do this one character at a time or as a continual stream...
4. Plug in your 'code practice oscillator', set the WPM speed and send code. You will see what the app thinks you have sent...

While the AARL code requirements used to range from 5 WPM (novice class) to 20 WPM (extra class) this has been phased out. Yet many operators prefer CW so it is worth learning the code.
### Choosing an Alphabet
the app has three different alphabets: alpha (letters), numbers (numbers, really), punctuation (common punctuation). Choose these from the 'Choose the Alphabet...' drop-down. Learning all three will take some time. Once you feel comfortable, choosing all will generate a random mix of everything... 

### The 'Generate' Button
This button will generate a ten block set of random characters based on the chosen alphabet. These blocks are used both for listening and testing

### The Audio Transports
This app's audio uses the Web Audio API for all sound. This can be resource intensive so it is only instantiated when needed. You must turn it on to listen, test, or send. It is turned off on a new 'Generate' event or any 'Tab Change' event.