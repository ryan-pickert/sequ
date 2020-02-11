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
var NumNotes = 8;
var ScaleType = 1;
var StepTime = Tone.Time("8n");
var Octave = 4;
var SequenceOctaves = 1;
var Layers;
var LayerSteps;
var CurrentLayer = 0;
var ScaleRoot;

var MajorScale = [];
var MinorScale = [];

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
    CurrentLayer = 0;
    Octave = 4;
    MajorScale = ["C", "E", "G"];
    MinorScale = ["C", "Eb", "G"];
    //document.getElementById("play").innerHTML = "Stop";
    

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
        case "maxNotes":
            value = slider.value;
            NumNotes = value;
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
            var n = Tone.Frequency(MajorScale[i] + Octave).transpose(ScaleRoot).toNote();
            pool.push(n);
            
        }
    }else if (ScaleType == 2){
        for(let i = 0; i < MinorScale.length; i++){
            var n = Tone.Frequency(MinorScale[i] + Octave).transpose(ScaleRoot).toNote();
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
        console.log(LayerSteps[CurrentLayer][s]);
        LayerSteps[CurrentLayer][s] = 1;

    }

    Layers[CurrentLayer] = sequence;
    UpdateLayer();
}

function UpdateLayer()
{
    for(let i = 0; i < Layers[CurrentLayer].length; i++){
        console.log(Layers[CurrentLayer][i] + ", " + LayerSteps[CurrentLayer][i]);
        document.getElementById(i+1).children[0].innerHTML = Layers[CurrentLayer][i];
    }
    for(let i = 0; i < LayerSteps[CurrentLayer].length; i++){
        if(LayerSteps[CurrentLayer][i] == 1){
            document.getElementById(i+1).classList.add("active");
        }else{
            document.getElementById(i+1).classList.remove("active");
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
            document.getElementById(step+1).style.border = "2px solid #5BC0EB";
        else if(layer == 1)
            document.getElementById(step+1).style.border = "2px solid #FDE74C";
            
        //Send midi
        if(steps[step] == 1)
            SendNote(sequence[step]);

        step++;
    }, StepTime).start(0);
}

function SendNote(note)
{
    MidiDevice.playNote(note).stopNote(note, {time: 50});
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}