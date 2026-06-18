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
the app has four different alphabets: 
  * alpha (letters)
  * numbers (numbers, really)
  * punctuation1 (common punctuation)
  * punctuation2 (less common punctuation). 
  
Choose these from the 'Choose the Alphabet...' drop-down - there are a number of combinations. Learning all four will take some time but once you feel comfortable, choosing 'All' will generate a random mix of everything... 

### The 'Generate' Button
This button will generate a block set of random characters based on the chosen alphabet. You can listen and test over and over or generate a new set of characters.

### The Audio Transports
This app's audio uses the Web Audio API for all sound. This can be resource intensive so it is only instantiated when needed so as not to 'hog' resources from other web pages. You must turn it on to listen, test, or send. It is turned off for any 'Tab Change' event. Once the audio is turned on, the play buttons will be enabled.

### Listen to Code
Here you can listen to random code blocks. Set the WPM speed and volume.

  * 'Play' will start playing from the beginning...
  * 'Pause' stops playing and 'Resume' resumes play...
  * 'Replay' will restart playing from the beginning...

### Test Your Listening Knowledge
Here you can test how well you know the code. There are two modes: 'Play All' (continuous) and 'Single' (one character at a time).

All the characters are hidden until you enter what you think you heard. The cursor will move to the next hidden character when you hit <enter> or <tab>. In 'continuous' mode the code keeps on playing and it is easy to get behind. In 'single' mode the playback will not play the next character until you enter the current character - this gives you time to think on those dodgy characters. 

  * 'Play' will start playing from the beginning...
  * 'Pause' stops playing and 'Resume' resumes play in 'continous' mode...
  * 'Replay' will restart playing from the beginning in 'continuous' mode or will replay the current character in 'single' mode...

### Test Your Fist
here you can use your keyboard to send code. The program needs to know your speed so you must run the speed test first - try and key at your normal speed. The program will set up thresholds for guessing your code.

When running the test, consider each block a separate word - this will set both your 'between char' and 'between word' timing. The test needs one last key stroke after the last character to end. It will then analyze your code and give you some, hopefully useful, feedback. The most useful result is, perhaps, the standard deviation. Anything under 30 is pretty good. This metric yields a view of where your code is, perhaps, a bit sloppy.

The test can become confused if a tone or space is outside thresholds - you can cancel at any time and restart or generate new text.


### Suggestions...
Start out with just the letters. When you think you know the code find a 'continuous' WPM speed that you can mostly get all the characters correctly. Practice in 'single' mode at 10 to 12 WPM. Gradually work up your 'continuous' speed to say 12 WPM. Now add the numbers and again work up your 'continuous' speed. Now add the puncuation.

At this point YOU KNOW THE CODE...! Keep practicing and communicating CW...

### Demo...
This app is hosted at:

https://hawkrdg.com/morsecode

Feel free to check it out and use it...

### Build Info...
The repo is at https://github.com/hawkrdg/learn-morse-code. This is an Angular / Material app - feel free to clone and build it. I use a 'monorepo' workspace - all my apps are within a single 'projects' folder and share resources. Included is my 'package.json' file with the handful of outside dependencies that I use. This may be helpful in cloning this app into a single workspace...