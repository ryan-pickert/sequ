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
    document.getElementById("menu").children[1].style.display = "";
    document.getElementById("menu").children[2].style.display = "";
    document.getElementById("menu").children[3].style.display = "";
    document.getElementById("menu").children[4].style.display = "";
    document.getElementById("menu").children[5].style.display = "";
    document.getElementById("menu").children[6].style.display = "";
    AddModule("master");
}
function AddModule(type)
{
    switch(type){
        case "vco":
            var m = new VCOModule(950, "sine");
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
        case "seq8":
            var m = new SequencerModule8();
            
            Modules.push(m);
            break;
        case "seq16":
            var m = new SequencerModule16();
            
            Modules.push(m);
            break;
        case "reverb":
            var m = new ReverbModule();
            
            Modules.push(m);
            break;
        case "delay":
            var m = new DelayModule();
            
            Modules.push(m);
            break;
        case "master":
            var m = new MasterModule();
            
            Modules.push(m);
            break;
    }
}
function SyncClocks()
{
    for(let i = 0; i<Modules.length; i++){
        if(Modules[i].name == "Clock-1"){
            if(Modules[i].module != undefined){
                for(let c = 0; c < Modules[i].clocks.length; c++){
                    Modules[i].clocks[c].stop();
                    Modules[i].clocks[c].start();
                }
                
            }
        }
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
var line;
var startX, startY;
function Connect(m, jack, type)
{
    if(connectStart == undefined && type == undefined){
        //Index of the starting module
        connectStart = Number(m.children[0].id);
        console.log("Connection start " + connectStart);
        var inputs = document.getElementsByClassName("input");
        for(let i = 0; i < inputs.length; i++){
            inputs[i].style.borderColor = "white";
        }

        var bodyRect = document.body.getBoundingClientRect(),
        elemRect = jack.getBoundingClientRect();
        startY   = elemRect.top - bodyRect.top,
        startX   = elemRect.left - bodyRect.left;

        line = document.createElementNS('http://www.w3.org/2000/svg', "path");
        
    }else if(connectStart != undefined && type != undefined){
        //Type of connection
        connectType = type;
        //Index of module we are connecting
        connectEnd = Number(m.children[0].id);
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

        var bodyRect = document.body.getBoundingClientRect(),
        elemRect = jack.getBoundingClientRect(),
        endY   = elemRect.top - bodyRect.top,
        endX   = elemRect.left - bodyRect.left;
        
        if(startX > endX){
            line.setAttribute('d', "M "+(startX+9)+" "+(startY+19) + " C "+(startX-9)+" "+(startY+150)+
            ", "+(endX+80)+" "+(endY+150)+", "+(endX+18)+" "+(endY+19));
        }else if(startX < endX)
        {
            line.setAttribute('d', "M "+(startX+18)+" "+(startY+19) + " C "+(startX+80)+" "+(startY+150)+
                          ", "+(endX-9)+" "+(endY+150)+", "+(endX+9)+" "+(endY+19));
        }else
        {
            line.setAttribute('d', "M "+(startX+9)+" "+(startY+19) + " C "+(startX+9)+" "+(startY+9)+
                          ", "+(endX-9)+" "+(endY+9)+", "+(endX+9)+" "+(endY+19));
        }
        
        

        document.getElementById("draw").append(line);
    }
    
}
