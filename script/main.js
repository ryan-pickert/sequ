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

function Init()
{
    //document.getElementById("play").innerHTML = "Stop";
    Tone.Transport.start();

    //Get MIDI access
    WebMidi.enable(function (err) {
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
    });
}

function test()
{
    device = WebMidi.outputs[1];
    device.playNote("c4");
}
