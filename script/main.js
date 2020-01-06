//----Electron window----
const {app, BrowserWindow} = require('electron');
var window;

app.on('ready', CreateWindow);
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

function CreateWindow()
{
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
var Modules;
var connectStart, connectEnd;
var connectType;
var Wires;

function Init()
{
    Modules = [];
    Wires = [];

    document.getElementById("start").innerHTML = "Stop";
    Tone.Transport.start();

    AddModule("master");
}
function AddModule(type)
{
    switch(type){
        case "vco":
            var m = new VCOModule(200, "sine");
            m.setVolume(-16);
            m.module.start();
            Modules.push(m);
            break;
        case "lfo":
            var m = new LFOModule();
            m.module.start();
            Modules.push(m);
            break;
        case "clock":
            var m = new ClockModule();
            //m.start();
            Modules.push(m);
            break;
        case "env":
            var m = new EnvelopeModule();
            
            Modules.push(m);
            break;
        case "master":
            var m = new MasterModule();
            
            Modules.push(m);
            break;
    }
}

function GetRandom(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function GetNoteValue(n, oct, scale)
{
    if(scale == 0){
        //No scale
        switch(n){
            case 1:
                return 'C'+oct;
            case 2:
                return 'C#'+oct;
            case 3:
                return 'D'+oct;
            case 4:
                return 'D#'+oct;
            case 5:
                return 'E'+oct;
            case 6:
                return 'F'+oct;
            case 7:
                return 'F#'+oct;
            case 8:
                return 'G'+oct;
            case 9:
                return 'G#'+oct;
            case 10:
                return 'A'+oct;
            case 11:
                return 'A#'+oct;
            case 12:
                return 'B'+oct;
            default:
                break;
        }
    }else if(scale == 1){
        //Major pentatonic
        switch(n){
            case 1:
                return 'C'+oct;
            case 2:
                return 'D'+oct;
            case 3:
                return 'E'+oct;
            case 4:
                return 'G'+oct;
            case 5:
                return 'A'+oct;

            default:
                break;
        }
    }
    
}

function move(e,t)
{
    document.onmousemove = function(e){
        t.style.top = e.clientY + "px";
        t.style.left = e.clientX + "px";
    };
    document.onmouseup = function(e){
        document.onmousemove = null;
    };
    
    
}

function Connect(m)
{
    if(connectStart == undefined && m.classList[0] == "output"){
        //Index of the starting module
        connectStart = Number(m.parentElement.id);
        console.log("Connection start " + connectStart);
        var inputs = document.getElementsByClassName("input");
        for(let i = 0; i < inputs.length; i++){
            inputs[i].style.borderColor = "white";
        }
        
    }else if(connectStart != undefined && m.classList[0] == "input"){
        //Type of connection
        connectType = m.id;
        //Index of module we are connecting
        connectEnd = Number(m.parentElement.id);
        //Connect the modules
        console.log("Connection end " + connectEnd + connectType);
        Modules[connectStart].connect(Modules[connectEnd], connectType);

        //Stop connections
        connectStart = undefined;
        connectEnd = undefined;
        connectType = undefined;

        var inputs = document.getElementsByClassName("input");
        for(let i = 0; i < inputs.length; i++){
            inputs[i].style.borderColor = "";
        }
    }
    
}

var moving = false;
function TurnKnob(knob, event)
{
    if(!moving){
        var start = event.clientY;
        var dif = 0;
        var modIndex = Number(knob.parentElement.id);
        var controllerIndex = 0;
    }
    
    document.onmousemove = function(e){
        moving = true;
        dif = start-e.clientY;
        Modules[modIndex].control(knob.id, Math.floor(Math.abs(dif)));
       
        console.log(dif);
        knob.style.transform = "rotate("+(dif) + "deg)";
    };
    document.onmouseup = function(e){
        document.onmousemove = null;
        moving = false;
    };
}