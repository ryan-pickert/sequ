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
var MidiDevice;
var MidiChannel;
var NumNotes;
var ScaleType;
var StepTime;
var Octave;
var SequenceOctaves;
var Layers;
var LayerSteps;
var CurrentLayer = 0;
var ScaleRoot;

var MajorScale = [];
var MinorScale = [];
var MajorSeven = [];
var MinorSeven = [];
var Sus2 = [];
var Sus4 = [];

var NoteTime;

var LayerLoops;

function Init()
{
    Layers = [0, 0, 0, 0];
    LayerSteps = [0,0,0,0];
    LayerLoops = [];
    for(let i = 0; i < 4; i++){
        LayerSteps[i] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        LayerLoops.push(1);
    }

    ScaleType = 1;
    NumNotes = 8;
    CurrentLayer = 0;
    Octave = 4;
    MidiChannel = 1;
    SequenceOctaves = 1;
    ScaleRoot = 0;
    StepTime = Tone.Time("4n");
    NoteTime = Tone.Time("4n").toSeconds()*1000;

    MajorScale = ["C", "E", "G"];
    MinorScale = ["C", "Eb", "G"];
    MajorSeven = ["C", "E", "G", "B"];
    MinorSeven = ["C", "Eb", "G", "Bb"];
    Sus2 = ["C", "D", "E", "G"];
    Sus4 = ["C", "E", "F", "G"];

    //Get MIDI access
    WebMidi.enable(function (err) {
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);

        MidiDevice = WebMidi.outputs[1];
    });
}

function test()
{
    device = WebMidi.outputs[1];
    device.playNote("c4");
    device.stopNote("c4");
}

function UpdateRange(slider, type)
{
    var value = 0;

    switch(type)
    {
        case "clock":
            if(slider.value == 1){
                value = "1 bar";
                StepTime = Tone.Time("1m");
            }else if(slider.value == 2){
                value = "1/2";
                StepTime = "2n";
            }else if(slider.value == 3){
                value = "1/4";
                StepTime = "4n";
            }else if(slider.value == 4){
                value = "1/8";
                StepTime = "8n";
            }else if(slider.value == 5){
                value = "1/16";
                StepTime = "16n";
            }
            break;
        case "noteTime":
            if(slider.value == 1){
                value = "1 bar";
                NoteTime = Tone.Time("1m").toSeconds()*1000;
            }else if(slider.value == 2){
                value = "1/2";
                NoteTime = Tone.Time("2n").toSeconds()*1000;
            }else if(slider.value == 3){
                value = "1/4";
                NoteTime = Tone.Time("4n").toSeconds()*1000;
            }else if(slider.value == 4){
                value = "1/8";
                NoteTime = Tone.Time("8n").toSeconds()*1000;
            }
            break;
        case "maxNotes":
            value = slider.value;
            NumNotes = value;
            break;
        case "octave":
            value = slider.value;
            Octave = value;
            break;
        case "sequenceOctaves":
            value = slider.value;
            SequenceOctaves = value;
            break;
        case "layer":
            value = slider.value;
            CurrentLayer = value-1;
            UpdateLayer();
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
            ScaleType = slider.value;
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
            ScaleRoot = slider.value-1;
            break;
        case "channel":
            value = slider.value;
            MidiChannel = value;
            break;
        default:
            value = slider.value;
            break;
    }
    var title = slider.parentElement;
    title.children[0].children[0].innerHTML = value;
}

function CreateSequence()
{
    //Generate a random sequence based on current parameters
    var sequence = [];
    var pool = []; //Pool of notes to choose from

    //Get notes from scales
    if (ScaleType == 1){
        for(let i = 0; i < MajorScale.length; i++){
            var n = Tone.Frequency(MajorScale[i] + (Number(Octave) + Number(getRandom(0, SequenceOctaves)))).transpose(ScaleRoot).toNote();
            pool.push(n);
        }
    }else if (ScaleType == 2){
        for(let i = 0; i < MinorScale.length; i++){
            var n = Tone.Frequency(MinorScale[i] + (Number(Octave) + Number(getRandom(0, SequenceOctaves)))).transpose(ScaleRoot).toNote();
            pool.push(n);
        }
    }else if (ScaleType == 3){
        for(let i = 0; i < MajorSeven.length; i++){
            var n = Tone.Frequency(MajorSeven[i] + (Number(Octave) + Number(getRandom(0, SequenceOctaves)))).transpose(ScaleRoot).toNote();
            pool.push(n);
        }
    }else if (ScaleType == 4){
        for(let i = 0; i < MinorSeven.length; i++){
            var n = Tone.Frequency(MinorSeven[i] + (Number(Octave) + Number(getRandom(0, SequenceOctaves)))).transpose(ScaleRoot).toNote();
            pool.push(n);
        }
    }else if (ScaleType == 5){
        for(let i = 0; i < Sus2.length; i++){
            var n = Tone.Frequency(Sus2[i] + (Number(Octave) + Number(getRandom(0, SequenceOctaves)))).transpose(ScaleRoot).toNote();
            pool.push(n);
        }
    }else if (ScaleType == 6){
        for(let i = 0; i < Sus4.length; i++){
            var n = Tone.Frequency(Sus4[i] + (Number(Octave) + Number(getRandom(0, SequenceOctaves)))).transpose(ScaleRoot).toNote();
            pool.push(n);
        }
    }
    

    //Generate sequence
    for(var i = 0; i < 16; i++){
        var note = getRandom(0, pool.length);
        sequence.push(pool[note]);
    }

    //Generate active steps
    for(let i = 0; i < 16; i++){
        LayerSteps[CurrentLayer][i] = 0;
    }
    for(let i = 0; i < NumNotes; i++){
        var s = getRandom(0, 16);
        LayerSteps[CurrentLayer][s] = 1;
    }

    Layers[CurrentLayer] = sequence;
    UpdateLayer();
}

function UpdateLayer()
{
    for(let i = 0; i < Layers[CurrentLayer].length; i++){
        document.getElementById(i+1).children[0].innerHTML = Layers[CurrentLayer][i];
    }
    for(let i = 0; i < LayerSteps[CurrentLayer].length; i++){
        if(LayerSteps[CurrentLayer][i] == 1){
            if(CurrentLayer == 0)
                document.getElementById(i+1).style.backgroundColor = "#4B9EC1";
            else if(CurrentLayer == 1)
                document.getElementById(i+1).style.backgroundColor = "#B9A938";
            else if(CurrentLayer == 2)
                document.getElementById(i+1).style.backgroundColor = "#69B221";
            else if(CurrentLayer == 3)
                document.getElementById(i+1).style.backgroundColor = "#DC5B17";
        }else{
            document.getElementById(i+1).style.backgroundColor = "";
        }
    }
}

function Play()
{
    Tone.Transport.start();
    var step = 0;
    var layer = CurrentLayer;
    var sequence = Layers[CurrentLayer];
    var steps = LayerSteps[CurrentLayer];
    var layerChannel = MidiChannel;

    if(LayerLoops[CurrentLayer] != 1){
        LayerLoops[CurrentLayer].dispose();
    }
    LayerLoops[CurrentLayer] = new Tone.Loop(function(time){
        if(step == 16){
            document.getElementById(step).style.border = "";
            step = 0;
        }

        if(document.getElementById(step) != undefined){
            document.getElementById(step).style.border = "";
        }

        if(layer == 0)
            document.getElementById(step+1).style.borderBottom = "12px solid #5BA6C6";
        else if(layer == 1)
            document.getElementById(step+1).style.borderBottom = "12px solid #FDE74C";
        else if(layer == 2)
            document.getElementById(step+1).style.borderBottom = "12px solid #84C049";
        else if(layer == 3)
            document.getElementById(step+1).style.borderBottom = "12px solid #F3722D";
            
        //Send midi
        if(steps[step] == 1)
            SendNote(sequence[step], layerChannel);

        step++;
    }, StepTime).start(0);
}

function Stop()
{
    LayerLoops[CurrentLayer].dispose();
    LayerLoops[CurrentLayer] = 1;

    for(let i = 0; i < 16; i++)
        document.getElementById(i+1).style.border = "";
}

function Step(s)
{
    var index = Number(s.id) - 1;
    
    if(LayerSteps[CurrentLayer][index] == 1){
        LayerSteps[CurrentLayer][index] = 0;
    }else{
        LayerSteps[CurrentLayer][index] = 1;
    }

    if(LayerSteps[CurrentLayer][index] == 1){
        if(CurrentLayer == 0)
            document.getElementById(index+1).style.backgroundColor = "#4B9EC1";
        else if(CurrentLayer == 1)
            document.getElementById(index+1).style.backgroundColor = "#B9A938";
        else if(CurrentLayer == 2)
            document.getElementById(index+1).style.backgroundColor = "#69B221";
        else if(CurrentLayer == 3)
            document.getElementById(index+1).style.backgroundColor = "#DC5B17";
    }else{
        document.getElementById(index+1).style.backgroundColor = "";
    }
}


function SendNote(note, channel)
{
    MidiDevice.playNote(note, channel, {duration: NoteTime});
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}