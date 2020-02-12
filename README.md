<h1 align="center">SEQU</h1>
<h4 align="center">Current Version: <a href="https://ryan-pickert.github.io/sequ/">[0.4.1-pre-alpha]</a></h4>

SEQU is a multi-track step sequencer with a focus on randomization.
SEQU uses <a href="https://tonejs.github.io/">Tone.js</a> as a clock source and <a href="https://github.com/djipco/webmidi">WebMidi.js</a> to send midi data.

<img src="pic/screen1.png">
<img src="pic/screen2.png">

**Features**
* Generate random squences using a set scale
* Generate a new sequence every cycle
* Activate/deactivate steps to your liking
* Up to four tracks playing simultaneously
* Send tracks to different devices or midi channels

**Quick Start Guide**

To generate a sequence:
1. Set the parameters to your liking and hit the generate button.
2. Choose the desired device and midi channel
3. Hit play to start the sequence.

Notes:
- A sequence MUST be generated before starting it. Generating a new sequence while it is playing will have no effect until you restart it.
- All other parameters must also be set before the sequence is started except for the BPM.
- You can click on a step to activate/deactivate it.
- Switch between the tracks by using the current track slider.
- Toggling the cycle button will set the sequence to activate random steps when it ends.

This project is in very early development so there are some bugs and missing features!