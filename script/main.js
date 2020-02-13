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
var CurrentDevice;
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
var PerCycle;
var MajorScale = [];
var MinorScale = [];
var MajorSeven = [];
var MinorSeven = [];
var Sus2 = [];
var Sus4 = [];
var CustomScale = [];

var NoteTime;

var LayerLoops;

function Init()
{
    if(window.innerWidth < 1025)
        document.getElementById("wrapper").style.zoom = "0.94";
    //Initialize defaults
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
    PerCycle = false;
    StepTime = Tone.Time("4n");
    NoteTime = Tone.Time("4n").toSeconds()*1000;

    MajorScale = ["C", "E", "G"];
    MinorScale = ["C", "Eb", "G"];
    MajorSeven = ["C", "E", "G", "B"];
    MinorSeven = ["C", "Eb", "G", "Bb"];
    Sus2 = ["C", "D", "G"];
    Sus4 = ["C", "F", "G"];
    CustomScale = ["C", "C", "C", "C", "C", "C",];

    MidiDevices = [];

    //Get MIDI access
    WebMidi.enable(function (err) {
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);

        for(let i = 0; i < WebMidi.outputs.length; i++){
            MidiDevices.push(WebMidi.outputs[i]);
            document.getElementById("deviceList").innerHTML += "["+(i+1)+"] " + MidiDevices[i].name + "<br>";
        }

        //Default to the last midi device
        //The first is usually the computer's thru port
        CurrentDevice = WebMidi.outputs.length-1;
        document.getElementById("midiDeviceSelect").max = WebMidi.outputs.length;
        document.getElementById("midiDeviceSelect").value = WebMidi.outputs.length;
        UpdateRange(document.getElementById("midiDeviceSelect"), "device");
    });
}

function SetCycle(button)
{
    //Determines if a new set of active steps should be generated
    //every time the sequence ends
    if(PerCycle == false){
        PerCycle = true;
        button.style.backgroundColor = "#bbbbbb";
        button.style.color = "#333333";
        button.style.border = "2px solid #333333";
    }else{
        PerCycle = false;
        button.style.backgroundColor = "#333333";
        button.style.color = "#bbbbbb";
        button.style.border = "";
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
            }else if(slider.value == 7){
                value = "CUSTOM";
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
        case "custom1":
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
            CustomScale[0] = value;
            break;
        case "custom2":
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
            CustomScale[1] = value;
            break;
        case "custom3":
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
            CustomScale[2] = value;
            break;
        case "custom4":
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
            CustomScale[3] = value;
            break;
        case "custom5":
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
            CustomScale[4] = value;
            break;
        case "custom6":
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
            CustomScale[5] = value;
            break;
        case "channel":
            value = slider.value;
            MidiChannel = value;
            break;
        case "device":
            value = slider.value;
            CurrentDevice = value-1;
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
    }else if (ScaleType == 7){
        for(let i = 0; i < CustomScale.length; i++){
            var n = Tone.Frequency(CustomScale[i] + (Number(Octave) + Number(getRandom(0, SequenceOctaves)))).transpose(ScaleRoot).toNote();
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
    //Update the steps on screen
    for(let i = 0; i < Layers[CurrentLayer].length; i++){
        document.getElementById(i+1).children[0].innerHTML = Layers[CurrentLayer][i];
    }
    for(let i = 0; i < LayerSteps[CurrentLayer].length; i++){
        document.getElementById(i+1).style.border = "";
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
function UpdateSteps(layer, nNotes)
{
    //Generate active steps
    for(let i = 0; i < 16; i++){
        LayerSteps[layer][i] = 0;
    }
    for(let i = 0; i < nNotes; i++){
        var s = getRandom(0, 16);
        LayerSteps[layer][s] = 1;
    }

    UpdateLayer();
}
function GetCurrentLayer()
{
    //Return the current layer
    //Used to show the progress of the current sequence only
    return CurrentLayer;
}
function Play(l)
{
    //Start the transport if not started already
    if(Tone.Transport.state != "started")
        Tone.Transport.start();

    //Grab parameters that were set
    //These are exclusive to the loop
    var step = 0;
    var layer = l;
    var sequence = Layers[layer];
    var steps = LayerSteps[layer];
    var layerChannel = MidiChannel;
    var nTime = NoteTime;
    var nNotes = NumNotes;
    var cycle = PerCycle;
    var device = CurrentDevice;

    //If there is already a loop present, get rid of it
    if(LayerLoops[layer] != 1){
        LayerLoops[CurrentLayer].dispose();
    }

    //Start a new loop
    LayerLoops[layer] = new Tone.Loop(function(time){
        if(step == 16){
            //Activate random steps
            if(cycle){
                document.getElementById(step).style.border = "";
                //Generate active steps
                for(let i = 0; i < 16; i++){
                    steps[layer][i] = 0;
                }
                for(let i = 0; i < NumNotes; i++){
                    var s = getRandom(0, 16);
                    steps[layer][s] = 1;
                }
                UpdateSteps(layer, nNotes);
            }

            document.getElementById(step).style.border = "";
            step = 0;
        }

        //Change the border for the current step
        if(layer == GetCurrentLayer()){
            if(document.getElementById(step) != undefined){
                document.getElementById(step).style.borderTop = "";
            }
            document.getElementById(step+1).style.borderTop = "6px solid #bbbbbb";
        }
            
        //Send midi
        if(steps[step] == 1)
            SendNote(sequence[step], layerChannel, nTime, MidiDevices[device]);

        step++;
    }, StepTime).start(0);
}

function Stop()
{
    //Stop current sequence
    LayerLoops[CurrentLayer].dispose();
    LayerLoops[CurrentLayer] = 1;

    for(let i = 0; i < 16; i++)
        document.getElementById(i+1).style.border = "";
}

function Step(s)
{
    //Activate or deactivate a step when clicked on
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


function SendNote(note, channel, nTime, device)
{
    device.playNote(note, channel, {duration: nTime});
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}