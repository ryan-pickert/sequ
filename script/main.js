//----Electron window----
const {app, BrowserWindow} = require('electron');
var window;



app.on('ready', CreateWindow);


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
    
    for(let i = 0; i < 8; i++){
        document.getElementById("menu").children[i].style.display = "";
    }

    //Get MIDI access
    MIDIInit();

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
        case "synth":
            var m = new SynthModuleMono();
            m.setVolume(-16);
            Modules.push(m);
            break;
        case "synthmem":
            var m = new SynthModuleMembrane();
            m.setVolume(-16);
            Modules.push(m);
            break;
        case "synthmetal":
            var m = new SynthModuleMetal();
            m.setVolume(-16);
            Modules.push(m);
            break;
        case "synthpoly":
            var m = new SynthModulePoly();
            m.setVolume(-16);
            Modules.push(m);
            break;
        case "sampler":
            var m = new SamplerModule();
            m.setVolume(-16);
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
        case "seq4":
            var m = new SequencerModule4();
            
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
        case "noise":
            var m = new NoiseModule("white");
            
            Modules.push(m);
            break;
        case "band":
            var m = new FilterModuleBand();
            Modules.push(m);
            break;
        case "high":
            var m = new FilterModuleHigh();
            Modules.push(m);
            break;
        case "low":
            var m = new FilterModuleLow();
            Modules.push(m);
            break;
        case "cross":
            var m = new CrossFadeModule();
            Modules.push(m);
            break;
        case "midi":
            var m = new MIDIModule();
            Modules.push(m);
            break;
        case "midirec":
            var m = new MIDIRecordModule();
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

function Move(e,t)
{
    var mouseXOffset = e.clientX-t.parentElement.getBoundingClientRect().left;
    var mouseYOffset = e.clientY-t.parentElement.getBoundingClientRect().top;
    console.log(mouseXOffset);

    document.onmousemove = function(e){
        t.parentElement.style.top = e.clientY-mouseYOffset + "px";
        t.parentElement.style.left = e.clientX-mouseXOffset + "px";
        
        for(let i = 0; i < Wires.length; i++){
            var moduleStart = "";
            var moduleEnd = "";
            var split = 0;
            
            for(let c = 0; c < Wires[i].line.id.length; c++){
                if(Wires[i].line.id[c] == ','){
                    split++;
                }
        
                if(split == 0){
                    moduleStart += Wires[i].line.id[c];
                }else if(split == 1){
                    moduleEnd += Wires[i].line.id[c];
                }
            }
            //Clean up commas
            moduleEnd = moduleEnd[1];

            if(t.parentElement.id == moduleStart){
                //Move the start position
                var wX = t.parentElement.getBoundingClientRect().left+Wires[i].offsetX;
                var wY = t.parentElement.getBoundingClientRect().top + Wires[i].offsetY;

                Wires[i].startX = wX;
                Wires[i].startY = wY;

                if(Wires[i].startX > Wires[i].endX){
                    Wires[i].line.setAttribute('d', "M "+(wX+9)+" "+(wY+19) + " C "+(wX-9)+" "+(wY+150)+
                    ", "+(Wires[i].endX+80)+" "+(Wires[i].endY+150)+", "+(Wires[i].endX+18)+" "+(Wires[i].endY+19));
                }else if(Wires[i].startX < Wires[i].endX){
                    Wires[i].line.setAttribute('d', "M "+(wX+18)+" "+(wY+19) + " C "+(wX+80)+" "+(wY+150)+
                    ", "+(Wires[i].endX-9)+" "+(Wires[i].endY+150)+", "+(Wires[i].endX+9)+" "+(Wires[i].endY+19));
                }
                
                
            }else if(t.parentElement.id == moduleEnd){
                var wX = t.parentElement.getBoundingClientRect().left+Wires[i].offsetXEnd;
                var wY = t.parentElement.getBoundingClientRect().top+ Wires[i].offsetYEnd;

                Wires[i].endX = wX;
                Wires[i].endY = wY;

                if(Wires[i].startX > Wires[i].endX){
                    Wires[i].line.setAttribute('d', "M "+(Wires[i].startX+9)+" "+(Wires[i].startY+19) + " C "+(Wires[i].startX-9)+" "+(Wires[i].startY+150)+
                    ", "+(wX+80)+" "+(wY+150)+", "+(wX+18)+" "+(wY+19));
                }else if(Wires[i].startX < Wires[i].endX){
                    Wires[i].line.setAttribute('d', "M "+(Wires[i].startX+18)+" "+(Wires[i].startY+19) + " C "+(Wires[i].startX+80)+" "+(Wires[i].startY+150)+
                    ", "+(wX-9)+" "+(wY+150)+", "+(wX+9)+" "+(wY+19));
                }
            }
        }
    };
    document.onmouseup = function(e){
        document.onmousemove = null;
    };
    
    
}
var line;
var startX, startY, offXStart,offYStart,offXEnd,offYEnd;
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
        offXStart = startX-m.children[0].getBoundingClientRect().left;
        offYStart = startY-m.children[0].getBoundingClientRect().top;
        console.log();
        line = document.createElementNS('http://www.w3.org/2000/svg', "path");
        line.id = connectStart;
        
    }else if(connectStart != undefined && type != undefined){
        //Type of connection
        connectType = type;
        //Index of module we are connecting
        connectEnd = Number(m.children[0].id);
        //Connect the modules
        console.log("Connection end " + connectEnd + connectType);
        Modules[connectStart].connect(Modules[connectEnd], connectType);

        line.id += ","+connectEnd+","+connectType;
        line.onclick = function(){Disconnect(this)};
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
        offXEnd = endX-m.children[0].getBoundingClientRect().left;
        offYEnd = endY-m.children[0].getBoundingClientRect().top;
        
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
        
        
        var w= new Wire(startX, startY, endX, endY, line, offXStart, offYStart, offXEnd, offYEnd);
        Wires.push(w);

        document.getElementById("draw").append(line);
    }
}

function Disconnect(path)
{
    var string = path.id;
    var moduleStart = "";
    var moduleEnd = "";
    var type = "";
    var split = 0;

    //Connection information is stored in the line's id
    //We need to parse that information
    for(let c = 0; c < string.length; c++){
        if(string[c] == ','){
            split++;
        }

        if(split == 0){
            moduleStart += string[c];
        }else if(split == 1){
            moduleEnd += string[c];
        }else{
            type += string[c];
        }
    }
    //Clean up commas
    moduleEnd = moduleEnd[1];
    
    //Now we can use the data to disconnect modules properly
    switch(type){
        case ",signal":
            Modules[moduleStart].module.disconnect(Modules[moduleEnd].module);
            path.remove();
            break;
        case ",frequency":
            if(Modules[moduleStart].name == "seq"){
                //Sequencer
            }else if(Modules[moduleStart].name == "midi"){
                //Midi module
            }else{
                Modules[moduleStart].module.disconnect(Modules[moduleEnd].module);
            }
            
            path.remove();
            break;
    }
    
}