//----Electron window----
const {app, BrowserWindow} = require('electron');
var window;

app.on('ready', CreateWindow);

var device;
function CreateWindow()
{
    app.commandLine.appendSwitch('ignore-gpu-blacklist');
    app.on('window-all-closed', () => {
        if(process.platform !== "darwin"){
            app.quit();
        }
    });
    
    app.on('activate', () => {
        if(window === null){
            CreateWindow();
        }
    });
    window = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {nodeIntegration: true}
    });

    window.loadFile('index.html');

    window.on('closed', () => {window = null});
}
//-----------------------
//GLOBAL VARS
var MidiDevices = [];

var MajorScale = [];
var MinorScale = [];
var MajorSeven = [];
var MinorSeven = [];
var Sus2 = [];
var Sus4 = [];

var CurrentTrack;
var Tracks = [];

function Init()
{
    Tone.Transport.start();
    if(window.innerWidth < 1025)
        document.getElementById("wrapper").style.zoom = "0.94";
    
    //Initialize defaults

    Tracks = [];
    CurrentTrack = 0;
    

    MajorScale = ["C", "E", "G"];
    MinorScale = ["C", "Eb", "G"];
    MajorSeven = ["C", "E", "G", "B"];
    MinorSeven = ["C", "Eb", "G", "Bb"];
    Sus2 = ["C", "D", "G"];
    Sus4 = ["C", "F", "G"];

    MidiDevices = [];

    //var WebMidi = new require('webmidi');
    //Get MIDI access
    WebMidi.enable(function (err) {
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);

        for(let i = 0; i < WebMidi.outputs.length; i++){
            MidiDevices.push(WebMidi.outputs[i]);
        }

        //Default to the last midi device
        //The first is usually the computer's thru port
        var deviceSlider = document.getElementById("midiSection").children[1].children[1];
        deviceSlider.max = WebMidi.outputs.length;
        deviceSlider.value = WebMidi.outputs.length;
        UpdateRange(deviceSlider, "device");

        
    });

    for(let i = 0; i < 8; i++){
        Tracks.push(new Track(i));
    }
    
}

function UpdateRange(slider, type)
{
    //Set parameters based on the sliders
    var value = 0;

    switch(type)
    {
        case "clock":
            if(slider.value == 1){
                value = "1 bar";
                Tracks[CurrentTrack].stepTime = GetStepTime("1m");
            }else if(slider.value == 2){
                value = "1/2";
                Tracks[CurrentTrack].stepTime = GetStepTime("2n");
            }else if(slider.value == 3){
                value = "1/4";
                Tracks[CurrentTrack].stepTime = GetStepTime("4n");
            }else if(slider.value == 4){
                value = "1/8";
                Tracks[CurrentTrack].stepTime = GetStepTime("8n");
            }else if(slider.value == 5){
                value = "1/16";
                Tracks[CurrentTrack].stepTime = GetStepTime("16n");
            }

            Tracks[CurrentTrack].sliderValues[2] = slider.value;
            break;
        case "noteTime":
            if(slider.value == 1){
                value = "1 bar";
                Tracks[CurrentTrack].noteTime = GetStepTime("1m");
            }else if(slider.value == 2){
                value = "1/2";
                Tracks[CurrentTrack].noteTime = GetStepTime("2n");
            }else if(slider.value == 3){
                value = "1/4";
                Tracks[CurrentTrack].noteTime = GetStepTime("4n");
            }else if(slider.value == 4){
                value = "1/8";
                Tracks[CurrentTrack].noteTime = GetStepTime("8n");
            }else if(slider.value == 5){
                value = "1/16";
                Tracks[CurrentTrack].noteTime = GetStepTime("16n");
            }else if(slider.value == 6){
                value = "1/32";
                Tracks[CurrentTrack].noteTime = GetStepTime("32n");
            }

            Tracks[CurrentTrack].sliderValues[3] = slider.value;
            break;
        case "delay":
            value = slider.value * 4;
            Tracks[CurrentTrack].cycleDelay = value;
            Tracks[CurrentTrack].sliderValues[4] = slider.value;
            break;
        case "randSteps":
            if(slider.value == 1){
                value = "off";
                Tracks[CurrentTrack].randSteps = false;
            }else if(slider.value == 2){
                value = "on";
                Tracks[CurrentTrack].randSteps = true;
            }

            Tracks[CurrentTrack].sliderValues[5] = slider.value;
            break;
        case "shiftNotes":
            if(slider.value == 1){
                value = "off";
                Tracks[CurrentTrack].shiftNotes = false;
            }else if(slider.value == 2){
                value = "on";
                Tracks[CurrentTrack].shiftNotes = true;
            }

            Tracks[CurrentTrack].sliderValues[6] = slider.value;
            break;
        case "maxNotes":
            value = slider.value;
            Tracks[CurrentTrack].randSteps = value;
            Tracks[CurrentTrack].sliderValues[10] = slider.value;
            break;
        case "octave":
            value = slider.value;
            Tracks[CurrentTrack].randOctave = value;
            Tracks[CurrentTrack].sliderValues[9] = slider.value;
            break;
        case "tempo":
            value = slider.value;
            Tone.Transport.bpm.value = value;
            break;
        case "scale":
            if(slider.value == 1){
                value = "MAJOR";
            }else if(slider.value == 2){
                value = "MINOR";
            }else if(slider.value == 3){
                value = "MAJOR7";
            }else if(slider.value == 4){
                value = "MINOR7";
            }else if(slider.value == 5){
                value = "SUS2";
            }else if(slider.value == 6){
                value = "SUS4";
            }
            Tracks[CurrentTrack].randScale = slider.value;
            Tracks[CurrentTrack].sliderValues[7] = slider.value;
            break;
        case "root":
            if(slider.value == 1){
                value = "C";
            }else if(slider.value == 2){
                value = "C#";
            }else if(slider.value == 3){
                value = "D";
            }else if(slider.value == 4){
                value = "D#";
            }else if(slider.value == 5){
                value = "E";
            }else if(slider.value == 6){
                value = "F";
            }else if(slider.value == 7){
                value = "F#";
            }else if(slider.value == 8){
                value = "G";
            }else if(slider.value == 9){
                value = "G#";
            }else if(slider.value == 10){
                value = "A";
            }else if(slider.value == 11){
                value = "A#";
            }else if(slider.value == 12){
                value = "B";
            }
            Tracks[CurrentTrack].randRoot = slider.value-1;
            Tracks[CurrentTrack].sliderValues[8] = slider.value;
            break;
        
        case "channel":
            value = slider.value;
            Tracks[CurrentTrack].midiChannel = value;
            Tracks[CurrentTrack].sliderValues[1] = slider.value;
            break;
        case "device":
            value = MidiDevices[slider.value-1].name;
            Tracks[CurrentTrack].midiDevice = slider.value-1;
            Tracks[CurrentTrack].sliderValues[0] = slider.value;
            break;
        default:
            value = slider.value;
            break;
    }
    var title = slider.parentElement;
    title.children[0].innerHTML = value;
}
function Edit(trackNum)
{
    CurrentTrack = trackNum;
    document.getElementById("trackMenu").children[0].children[1].innerHTML = "Edit (Track " + (trackNum+1)+")";

    //Update sliders for the track being edited
    var midiSection = document.getElementById("midiSection");
    var stepSection = document.getElementById("stepSection");
    var randomSection = document.getElementById("randomSection");

    midiSection.children[1].children[1].value = Tracks[CurrentTrack].sliderValues[0];
    midiSection.children[2].children[1].value = Tracks[CurrentTrack].sliderValues[1];
    UpdateRange(midiSection.children[1].children[1], "device");
    UpdateRange(midiSection.children[2].children[1], "channel");

    stepSection.children[1].children[1].value = Tracks[CurrentTrack].sliderValues[2];
    stepSection.children[2].children[1].value = Tracks[CurrentTrack].sliderValues[3];
    stepSection.children[3].children[1].value = Tracks[CurrentTrack].sliderValues[4];
    stepSection.children[4].children[1].value = Tracks[CurrentTrack].sliderValues[5];
    stepSection.children[5].children[1].value = Tracks[CurrentTrack].sliderValues[6];
    UpdateRange(stepSection.children[1].children[1], "clock");
    UpdateRange(stepSection.children[2].children[1], "noteTime");
    UpdateRange(stepSection.children[3].children[1], "delay");
    UpdateRange(stepSection.children[4].children[1], "randSteps");
    UpdateRange(stepSection.children[5].children[1], "shiftNotes");

    randomSection.children[1].children[1].value = Tracks[CurrentTrack].sliderValues[7];
    randomSection.children[2].children[1].value = Tracks[CurrentTrack].sliderValues[8];
    randomSection.children[3].children[1].value = Tracks[CurrentTrack].sliderValues[9];
    randomSection.children[4].children[1].value = Tracks[CurrentTrack].sliderValues[10];
    UpdateRange(randomSection.children[1].children[1], "scale");
    UpdateRange(randomSection.children[2].children[1], "root");
    UpdateRange(randomSection.children[3].children[1], "octave");
    UpdateRange(randomSection.children[4].children[1], "maxNotes");

    if(document.getElementById("trackMenu").style.display == "none"){
        document.getElementById("trackMenu").style.display = "block";
        document.getElementById("trackMenu").style.bottom = "40px";
    }

    for(let i = 0; i < 16; i++)
    {
        ChangeOctave(0, i, document.getElementById("notes"+i).children[0]);
    }
}
function Play(trackNum)
{
    if(Tracks[trackNum].loop == undefined || Tracks[trackNum].loop == 0)
        Tracks[trackNum].startLoop();
}
function PlayAll()
{
    for(let i = 0; i < Tracks.length; i++){
        if(Tracks[i].loop == undefined || Tracks[i].loop == 0)
            Tracks[i].startLoop();
    }
}
function StopAll()
{
    for(let i = 0; i < Tracks.length; i++){
        if(Tracks[i].loop != undefined){
            clearInterval(Tracks[i].loop);
            Tracks[i].loop = 0;
        }
    }

    for(let i = 0; i < Tracks.length; i++){
        var stepElements = document.getElementById("track"+i);
        for(let i = 0; i < 16; i++)
            stepElements.children[i].style.border = "";
    }
}
function ChangeStep(stepElement, stepNum, trackNum)
{
    if(Tracks[trackNum].steps[stepNum].active == false){
        Tracks[trackNum].steps[stepNum].active = true;
        stepElement.style.backgroundColor = "var(--dark-blue2)";
    }else{
        Tracks[trackNum].steps[stepNum].active = false;
        stepElement.style.backgroundColor = "";
    }
}
function Stop(trackNum)
{
    //Stop current sequence
    var stepElememts = document.getElementById("track"+trackNum);
    if(Tracks[trackNum].loop != undefined){
        clearInterval(Tracks[trackNum].loop);
        Tracks[trackNum].loop = 0;
        for(let i = 0; i < 16; i++)
            stepElememts.children[i].style.border = "";
    }
}
function AddNote(note, step, button)
{
    var stepElement = document.getElementById("track" + CurrentTrack).children[step];
    
    if(Tracks[CurrentTrack].steps[step].addNote(note)){
        button.innerHTML = note+Tracks[CurrentTrack].steps[step].octave;
        button.style.backgroundColor = "var(--light-blue1)";
        button.style.color = "var(--dark-blue1)";
    }else{
        Tracks[CurrentTrack].steps[step].removeNote(note);
        button.innerHTML = "";
        button.style.backgroundColor = "";
        button.style.color = "";
    }
    
    if(Tracks[CurrentTrack].steps[step].notes.length == 0){
        stepElement.innerHTML = "";
    }
    else if(Tracks[CurrentTrack].steps[step].notes.length > 0){
        stepElement.innerHTML = Tracks[CurrentTrack].steps[step].notes[Tracks[CurrentTrack].steps[step].notes.length-1];
    }

    if(Tracks[CurrentTrack].steps[step].notes.length > 1){
        stepElement.innerHTML += "...";
    }
    
    
}
function ChangeOctave(change, step, button)
{
    var trackStep = Tracks[CurrentTrack].steps[step];
    var noteElements = button.parentElement;

    trackStep.octave += change;

    for(let i = 0; i < 12; i++){
        noteElements.children[i].innerHTML = "";
        noteElements.children[i].style.backgroundColor = "";
        noteElements.children[i].style.color = "";
    }

    for(let i = 0; i < trackStep.notes.length; i++)
    {
        if(trackStep.notes[i] == ("B" + trackStep.octave)){
            noteElements.children[0].innerHTML = trackStep.notes[i];
            noteElements.children[0].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[0].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("A#" + trackStep.octave)){
            noteElements.children[1].innerHTML = trackStep.notes[i];
            noteElements.children[1].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[1].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("A" + trackStep.octave)){
            noteElements.children[2].innerHTML = trackStep.notes[i];
            noteElements.children[2].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[2].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("G#" + trackStep.octave)){
            noteElements.children[3].innerHTML = trackStep.notes[i];
            noteElements.children[3].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[3].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("G" + trackStep.octave)){
            noteElements.children[4].innerHTML = trackStep.notes[i];
            noteElements.children[4].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[4].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("F#" + trackStep.octave)){
            noteElements.children[5].innerHTML = trackStep.notes[i];
            noteElements.children[5].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[5].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("F" + trackStep.octave)){
            noteElements.children[6].innerHTML = trackStep.notes[i];
            noteElements.children[6].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[6].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("E" + trackStep.octave)){
            noteElements.children[7].innerHTML = trackStep.notes[i];
            noteElements.children[7].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[7].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("D#" + trackStep.octave)){
            noteElements.children[8].innerHTML = trackStep.notes[i];
            noteElements.children[8].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[8].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("D" + trackStep.octave)){
            noteElements.children[9].innerHTML = trackStep.notes[i];
            noteElements.children[9].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[9].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("C#" + trackStep.octave)){
            noteElements.children[10].innerHTML = trackStep.notes[i];
            noteElements.children[10].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[10].style.color = "var(--dark-blue1)";
        }else if(trackStep.notes[i] == ("C" + trackStep.octave)){
            noteElements.children[11].innerHTML = trackStep.notes[i];
            noteElements.children[11].style.backgroundColor = "var(--light-blue1)";
            noteElements.children[11].style.color = "var(--dark-blue1)";
        }
        
    }
    
}



function SendNote(note, channel, nTime, device)
{
    MidiDevices[device].playNote(note, channel, {duration: nTime});
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}