function MIDIInit()
{
    //Get MIDI access
    if(navigator.requestMIDIAccess){
        navigator.requestMIDIAccess().then(MIDIGet, MIDIReject);
    }else{
        alert("No MIDI support");
    }
}

function MIDIGet(m)
{
    console.log("Initializing midi...");

    var midi = m;
    var inputs = midi.inputs.values();

    //Listen of all midi input and send it to a function
    for(var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = MIDIHandler;
        haveMidi = true;
    }
    if(!haveMidi){
        console.log("No midi devices found :(");
    }
}
function MIDIReject(err)
{
    alert("MIDI failed to start");
}

function MIDIHandler(event)
{
    // Mask off the lower nibble (MIDI channel, which we don't care about)
    switch (event.data[0] & 0xf0) {
    case 0x90:
        if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
            noteOn(event.data[1], event.data[2]);
            return;
        }
        // if velocity == 0, fall thru: it's a note-off.
    case 0x80:
        noteOff(event.data[1]);
        return;
    }
}

function noteOn(note, vel)
{
    for(let i = 0; i < Modules.length; i++){
        if(Modules[i].name == "midi"){
            if(Modules[i].on){
                Modules[i].triggerOn(note, vel);
            }
            
        }else if(Modules[i].program){
            //Seq
            Modules[i].programSequence(note);
        }
    }
}
function noteOff(note)
{
    for(let i = 0; i < Modules.length; i++){
        if(Modules[i].name == "midi"){
            if(Modules[i].on){
                Modules[i].triggerOff(note);
            }
            
        }
    }
}

class MIDIModule
{
    constructor()
    {
        this.name = "midi";
        this.modules = [3];
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.on = true;
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    connect(module, type)
    {
        switch(type){
            case "frequency":
                console.log("connected");
                //Connect output to new module
                this.modules[0] = module.module;
                break;
            case "trigger":
                console.log("connected");
                //Connect output to new module
                this.modules[1] = module.module;
                break;
            
            default:
                break;
        }   
    }
    control(value, cIndex)
    {
        if(value == "increase"){
            if(this.controllers[cIndex].value < this.controllers[cIndex].max)
                this.controllers[cIndex].increase();
        }
        else{
            if(this.controllers[cIndex].value > this.controllers[cIndex].min)
                this.controllers[cIndex].decrease();
        }

        if(this.controllers[cIndex].value > this.controllers[cIndex].max)
                this.controllers[cIndex].value = this.controllers[cIndex].max;
        if(this.controllers[cIndex].value < this.controllers[cIndex].min)
                this.controllers[cIndex].value = this.controllers[cIndex].min;

        switch(cIndex){
            case 0:
                this.module.frequency.value = this.controllers[cIndex].value;
                break;
        }
    }
    triggerOn(note, velocity)
    {
        if(this.modules[0].voices != undefined){
            //Poly synth
            this.modules[0].triggerAttack(Tone.Frequency(note, "midi"), undefined, (velocity/127));
        }else{
            //Set pitch
            if(this.modules[0].oscillator != undefined){

                this.modules[0].oscillator.frequency.value = Tone.Frequency(note, "midi");
            }else{
                this.modules[0].frequency.value = Tone.Frequency(note, "midi");
            }

            if(this.modules[1].envelope == undefined){
                //Envelope
                this.modules[1].triggerAttack();
            }else{
                //Synth
                this.modules[1].triggerAttack(this.modules[1].oscillator.frequency.value, undefined, (velocity/127));
            }
        }
        
        
    }
    triggerOff(note)
    {
        if(this.modules[0].voices != undefined){
            this.modules[0].triggerRelease(Tone.Frequency(note, "midi"), undefined, 0.5);
        }else{
            this.modules[1].triggerRelease();

        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:140px'>"+
                      "<div class='name'>MIDI-1</div>"+
                      "<div class='section'>Frequency</div>"+
                      "<div></div>"+
                      "<div class='section'>Trigger</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);

        this.outputs.push(document.createElement("div"));
        this.outputs.push(document.createElement("div"));

        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.outputs[1].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[1].classList.add("output");
        this.outputs[1].onclick = function(){Connect(mod, this)};

        //Add everything to the document
        document.getElementById(modIndex).children[2].appendChild(this.outputs[0]);
        document.getElementById(modIndex).appendChild(this.outputs[1]);
        //document.getElementById(modIndex).appendChild(this.inputs[2]);
    }
}