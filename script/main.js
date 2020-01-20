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
var Windows;


function Init()
{
    Windows = [];

    //document.getElementById("play").innerHTML = "Stop";
    Tone.Transport.start();

    //Get MIDI access
    MIDIInit();
    Windows.push(new BasicOscillator());
    Windows.push(new LFO());
}

function Move(e,t)
{
    //Move window
    var mouseXOffset = e.clientX-t.parentElement.getBoundingClientRect().left;
    var mouseYOffset = e.clientY-t.parentElement.getBoundingClientRect().top;

    document.onmousemove = function(e){
        t.parentElement.style.top = e.clientY-mouseYOffset + "px";
        t.parentElement.style.left = e.clientX-mouseXOffset + "px";
    };
    document.onmouseup = function(e){
        document.onmousemove = null;
    };
}