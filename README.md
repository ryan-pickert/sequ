<h1 align="center">SEQU</h1>
<h4 align="center">Current Version: <a href="https://ryan-pickert.github.io/sequ/">[0.5.2-pre-alpha]</a></h4>

Sequ is a multi-track step sequencer with a focus on randomization.

Sequ uses <a href="https://tonejs.github.io/">Tone.js</a> as a clock source and <a href="https://github.com/djipco/webmidi">WebMidi.js</a> to send MIDI data.

<img src="pic/screen1.png">
<img src="pic/screen2.png">

**Features**
* Generate random sequences using a set scale
* Generate a new sequence every cycle
* Activate/deactivate steps to your liking
* Up to four tracks playing simultaneously
* Send tracks to different devices or MIDI channels

**Quick Start Guide**

Connect your MIDI devices (if they aren't already) and restart the page.
All availiable devices will be listed under 'DEVICES' on the left.
>The 'device' slider will default to the last MIDI device. 


To generate a sequence:
1. Set the parameters to your liking and hit the 'generate' button.
2. Choose the desired device and MIDI channel.
3. Hit 'play' to start the sequence.

Notes:
- A sequence MUST be generated before starting it. Generating a new sequence while it is playing will have no effect until you restart it.
- All other parameters (including MIDI device and channel) must also be set before the sequence is started.
- You can click on a step to activate/deactivate it.
- Switch between different tracks by using the 'current track' slider.
- Clicking the 'cycle' button will set the sequence to activate random steps every cycle.
- Clicking the 'shift' button will set the sequence to shift it's notes to the left every cycle.

This project is in very early development so there are some bugs and missing features!