class SynthModuleMono
{
    constructor()
    {
        this.module = new Tone.Synth();
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.effects = [];
        this.on = false;
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.oscillator.volume.value = vol;
    }
    updateChain()
    {
        //Disconnect all effects
        for(let i = 0; i < this.effects.length; i++){
            this.effects[i].disconnect();
        }

        //Reconnect effects
        //Sound sources support up to 5 effects at once
        if(this.on){
            if(this.effects.length == 1){
                this.module.chain(this.effects[0], Tone.Master);
            }else if(this.effects.length == 2){
                this.module.chain(this.effects[0], this.effects[1], Tone.Master);
            }else if(this.effects.length == 3){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], Tone.Master);
            }else if(this.effects.length == 4){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], Tone.Master);
            }else if(this.effects.length == 5){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], this.effects[4], Tone.Master);
            }else{
                this.module.toMaster();
            }
        }
    }
    connect(module, type)
    {
        switch(type){
            case "signal":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module);
                break;
            case "signalA":
                console.log("connected");
                //Disconnect all outputs
                //this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 0);
                break;
            case "signalB":
                console.log("connected");
                //Disconnect all outputs
                //this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 1);
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
                this.module.oscillator.frequency.value = this.controllers[cIndex].value;
                break;
            case 1:
                this.module.oscillator.volume.value = this.controllers[cIndex].value;
                break;
            case 2:
                this.module.envelope.attack = this.controllers[cIndex].value;
                break;
            case 3:
                this.module.envelope.decay = this.controllers[cIndex].value;
                break;
            case 4:
                this.module.envelope.sustain = this.controllers[cIndex].value;
                break;
            case 5:
                this.module.envelope.release = this.controllers[cIndex].value;
                break;
            case 6:
                this.module.oscillator.partialCount = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:323px'>"+
                      "<div class='name'>SYN-1</div>"+
                      "<div style='float:left; margin-top:-4px'>"+
                        "<div class='section'>Frequency</div>"+
                        "<div></div>"+
                        "<div class='section'>Wave</div>"+
                        "<div style='width:100%; height: 30px'></div>"+
                        "<div class='section'>Signal</div>"+
                        "<div></div>"+
                      "</div>"+
                      
                      "<div style='float:left; width:55%; margin-left:10px; margin-top:-4px'>"+
                        "<div class='section'>Envelope</div>"+
                        "<div class='section'style='float:left'>Attack</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section'style='float:left; margin-left: 5px; margin-right:5px'>Decay</div>"+
                        "<div style='margin-bottom:5px'></div>"+
                        "<div class='section' style='float:left;'>Sustain</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section' style='float:left; margin-left: 5px; margin-right:5px'>Release</div>"+
                        "<div></div>"+
                        "<div class='section' style=''>Trigger In</div>"+
                      "</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(15, 6000, 15, "knob", this.module.oscillator.frequency.value, modIndex, 0));
        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.oscillator.volume.value, modIndex, 1));

        this.controllers.push(new Controller(0.001, 1, 0.001, "knob", this.module.envelope.attack, modIndex, 2));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.decay, modIndex, 3));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", this.module.envelope.sustain, modIndex, 4));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.release, modIndex, 5));
        this.controllers.push(new Controller(1, 40, 2, "knob", 1, modIndex, 6));

        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "SINE";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].module.oscillator.type = "sine"};

        this.buttons[1].innerHTML = "TRI";
        this.buttons[1].classList.add("button");
        this.buttons[1].onclick = function(){Modules[modIndex].module.oscillator.type = "triangle"};

        this.buttons[2].innerHTML = "SAW";
        this.buttons[2].classList.add("button");
        this.buttons[2].onclick = function(){Modules[modIndex].module.oscillator.type = "sawtooth"};

        this.buttons.push(document.createElement("div"));
        this.buttons[3].innerHTML = "ON";
        this.buttons[3].classList.add("button");
        this.buttons[3].onclick = function(){
            if(Modules[modIndex].on){
                Modules[modIndex].on = false;
                this.innerHTML = "ON";
                Modules[modIndex].module.disconnect();
            }else{
                Modules[modIndex].on = true;
                this.innerHTML = "OFF";
                Modules[modIndex].updateChain();
            }
        };

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].style.float="left";
        this.outputs[0].style.marginRight="30px";
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].style.float="left";
        this.inputs[0].style.marginRight="15px";
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "trigger")};

        //Add everything to the document
        document.getElementById(modIndex).children[1].children[1].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.controllers[6].element);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[0]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[2]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.buttons[3]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.controllers[1].element);
        

        document.getElementById(modIndex).children[2].children[2].appendChild(this.controllers[2].element);
        document.getElementById(modIndex).children[2].children[4].appendChild(this.controllers[3].element);
        document.getElementById(modIndex).children[2].children[6].appendChild(this.controllers[4].element);
        document.getElementById(modIndex).children[2].children[8].appendChild(this.controllers[5].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[2]);
    }
}

class SynthModuleMembrane
{
    constructor()
    {
        this.module = new Tone.MembraneSynth();
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.effects = [];
        this.on = false;
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.oscillator.volume.value = vol;
    }
    updateChain()
    {
        //Disconnect all effects
        for(let i = 0; i < this.effects.length; i++){
            this.effects[i].disconnect();
        }

        //Reconnect effects
        //Sound sources support up to 5 effects at once
        if(this.on){
            if(this.effects.length == 1){
                this.module.chain(this.effects[0], Tone.Master);
            }else if(this.effects.length == 2){
                this.module.chain(this.effects[0], this.effects[1], Tone.Master);
            }else if(this.effects.length == 3){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], Tone.Master);
            }else if(this.effects.length == 4){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], Tone.Master);
            }else if(this.effects.length == 5){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], this.effects[4], Tone.Master);
            }else{
                this.module.toMaster();
            }
        }
    }
    connect(module, type)
    {
        switch(type){
            case "signal":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module);
                break;
            case "signalA":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 0);
                break;
            case "signalB":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 1);
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
                this.module.oscillator.frequency.value = this.controllers[cIndex].value;
                break;
            case 1:
                this.module.oscillator.volume.value = this.controllers[cIndex].value;
                break;
            case 2:
                this.module.envelope.attack = this.controllers[cIndex].value;
                break;
            case 3:
                this.module.envelope.decay = this.controllers[cIndex].value;
                break;
            case 4:
                this.module.envelope.sustain = this.controllers[cIndex].value;
                break;
            case 5:
                this.module.envelope.release = this.controllers[cIndex].value;
                break;
            case 6:
                this.module.oscillator.partialCount = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:323px'>"+
                      "<div class='name'>SYN-2M</div>"+
                      "<div style='float:left; margin-top:-4px'>"+
                        "<div class='section'>Frequency</div>"+
                        "<div></div>"+
                        "<div class='section'>Wave</div>"+
                        "<div style='width:100%; height: 30px'></div>"+
                        "<div class='section'>Signal</div>"+
                        "<div></div>"+
                      "</div>"+
                      
                      "<div style='float:left; width:55%; margin-left:10px; margin-top:-4px'>"+
                        "<div class='section'>Envelope</div>"+
                        "<div class='section'style='float:left'>Attack</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section'style='float:left; margin-left: 5px; margin-right:5px'>Decay</div>"+
                        "<div style='margin-bottom:5px'></div>"+
                        "<div class='section' style='float:left;'>Sustain</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section' style='float:left; margin-left: 5px; margin-right:5px'>Release</div>"+
                        "<div></div>"+
                        "<div class='section' style=''>Trigger In</div>"+
                      "</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(15, 6000, 15, "knob", this.module.oscillator.frequency.value, modIndex, 0));
        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.oscillator.volume.value, modIndex, 1));

        this.controllers.push(new Controller(0.001, 1, 0.001, "knob", this.module.envelope.attack, modIndex, 2));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.decay, modIndex, 3));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", this.module.envelope.sustain, modIndex, 4));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.release, modIndex, 5));
        this.controllers.push(new Controller(1, 40, 2, "knob", 1, modIndex, 6));

        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "SINE";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].module.oscillator.type = "sine"};

        this.buttons[1].innerHTML = "TRI";
        this.buttons[1].classList.add("button");
        this.buttons[1].onclick = function(){Modules[modIndex].module.oscillator.type = "triangle"};

        this.buttons[2].innerHTML = "SAW";
        this.buttons[2].classList.add("button");
        this.buttons[2].onclick = function(){Modules[modIndex].module.oscillator.type = "sawtooth"};

        this.buttons.push(document.createElement("div"));
        this.buttons[3].innerHTML = "ON";
        this.buttons[3].classList.add("button");
        this.buttons[3].onclick = function(){
            if(Modules[modIndex].on){
                Modules[modIndex].on = false;
                this.innerHTML = "ON";
                Modules[modIndex].module.disconnect();
            }else{
                Modules[modIndex].on = true;
                this.innerHTML = "OFF";
                Modules[modIndex].updateChain();
            }
        };

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].style.float="left";
        this.outputs[0].style.marginRight="30px";
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].style.float="left";
        this.inputs[0].style.marginRight="15px";
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "trigger")};

        //Add everything to the document
        document.getElementById(modIndex).children[1].children[1].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.controllers[6].element);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[0]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[2]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.buttons[3]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.controllers[1].element);
        

        document.getElementById(modIndex).children[2].children[2].appendChild(this.controllers[2].element);
        document.getElementById(modIndex).children[2].children[4].appendChild(this.controllers[3].element);
        document.getElementById(modIndex).children[2].children[6].appendChild(this.controllers[4].element);
        document.getElementById(modIndex).children[2].children[8].appendChild(this.controllers[5].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[2]);
    }
}

class SynthModuleMetal
{
    constructor()
    {
        this.module = new Tone.MetalSynth();
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.on = false;
        this.controllers = []; //Array of controllers (knobs, etc)
        this.effects = [];
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.volume.value = vol;
    }
    updateChain()
    {
        //Disconnect all effects
        for(let i = 0; i < this.effects.length; i++){
            this.effects[i].disconnect();
        }

        //Reconnect effects
        //Sound sources support up to 5 effects at once
        if(this.on){
            if(this.effects.length == 1){
                this.module.chain(this.effects[0], Tone.Master);
            }else if(this.effects.length == 2){
                this.module.chain(this.effects[0], this.effects[1], Tone.Master);
            }else if(this.effects.length == 3){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], Tone.Master);
            }else if(this.effects.length == 4){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], Tone.Master);
            }else if(this.effects.length == 5){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], this.effects[4], Tone.Master);
            }else{
                this.module.toMaster();
            }
        }
    }
    connect(module, type)
    {
        switch(type){
            case "signal":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module);
                break;
            case "signalA":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 0);
                break;
            case "signalB":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 1);
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
            case 1:
                this.module.volume.value = this.controllers[cIndex].value;
                break;
            case 2:
                this.module.envelope.attack = this.controllers[cIndex].value;
                break;
            case 3:
                this.module.envelope.decay = this.controllers[cIndex].value;
                break;
            case 4:
                this.module.envelope.sustain = this.controllers[cIndex].value;
                break;
            case 5:
                this.module.envelope.release = this.controllers[cIndex].value;
                break;
            case 6:
                this.module.resonance = this.controllers[cIndex].value;
                break;
                
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:323px'>"+
                      "<div class='name'>SYN-3M</div>"+
                      "<div style='float:left; margin-top:-4px'>"+
                        "<div class='section'>Frequency</div>"+
                        "<div></div>"+
                        "<div class='section'>Wave</div>"+
                        "<div style='width:100%; height: 30px'></div>"+
                        "<div class='section'>Signal</div>"+
                        "<div></div>"+
                      "</div>"+
                      
                      "<div style='float:left; width:55%; margin-left:10px; margin-top:-4px'>"+
                        "<div class='section'>Envelope</div>"+
                        "<div class='section'style='float:left'>Attack</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section'style='float:left; margin-left: 5px; margin-right:5px'>Decay</div>"+
                        "<div style='margin-bottom:5px'></div>"+
                        "<div class='section' style='float:left;'>Sustain</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section' style='float:left; margin-left: 5px; margin-right:5px'>Release</div>"+
                        "<div></div>"+
                        "<div class='section' style=''>Trigger In</div>"+
                      "</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(20, 400, 20, "knob", this.module.frequency.value, modIndex, 0));
        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.volume.value, modIndex, 1));

        this.controllers.push(new Controller(0.001, 1, 0.001, "knob", this.module.envelope.attack, modIndex, 2));
        this.controllers.push(new Controller(0.4, 1.4, 0.1, "knob", this.module.envelope.decay, modIndex, 3));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", this.module.envelope.sustain, modIndex, 4));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.release, modIndex, 5));
        this.controllers.push(new Controller(0, 4000, 50, "knob", this.module.resonance, modIndex, 6));

        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "SINE";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].module.oscillator.type = "sine"};

        this.buttons[1].innerHTML = "TRI";
        this.buttons[1].classList.add("button");
        this.buttons[1].onclick = function(){Modules[modIndex].module.oscillator.type = "triangle"};

        this.buttons[2].innerHTML = "SAW";
        this.buttons[2].classList.add("button");
        this.buttons[2].onclick = function(){Modules[modIndex].module.oscillator.type = "sawtooth"};

        this.buttons.push(document.createElement("div"));
        this.buttons[3].innerHTML = "ON";
        this.buttons[3].classList.add("button");
        this.buttons[3].onclick = function(){
            if(Modules[modIndex].on){
                Modules[modIndex].on = false;
                this.innerHTML = "ON";
                Modules[modIndex].module.disconnect();
            }else{
                Modules[modIndex].on = true;
                this.innerHTML = "OFF";
                Modules[modIndex].updateChain();
            }
        };

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].style.float="left";
        this.outputs[0].style.marginRight="30px";
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].style.float="left";
        this.inputs[0].style.marginRight="15px";
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "trigger")};

        //Add everything to the document
        document.getElementById(modIndex).children[1].children[1].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[0]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[2]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.buttons[3]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.controllers[1].element);
        

        document.getElementById(modIndex).children[2].children[2].appendChild(this.controllers[2].element);
        document.getElementById(modIndex).children[2].children[4].appendChild(this.controllers[3].element);
        document.getElementById(modIndex).children[2].children[6].appendChild(this.controllers[4].element);
        document.getElementById(modIndex).children[2].children[8].appendChild(this.controllers[5].element);
        document.getElementById(modIndex).children[2].children[8].appendChild(this.controllers[6].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[2]);
    }
}

class SynthModulePoly
{
    constructor()
    {
        this.module = new Tone.PolySynth(12, Tone.Synth);
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.on = false;
        this.controllers = []; //Array of controllers (knobs, etc)
        this.effects = [];
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.volume.value = vol;
    }
    updateChain()
    {
        //Disconnect all effects
        for(let i = 0; i < this.effects.length; i++){
            this.effects[i].disconnect();
        }

        //Reconnect effects
        //Sound sources support up to 5 effects at once
        if(this.on){
            if(this.effects.length == 1){
                this.module.chain(this.effects[0], Tone.Master);
            }else if(this.effects.length == 2){
                this.module.chain(this.effects[0], this.effects[1], Tone.Master);
            }else if(this.effects.length == 3){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], Tone.Master);
            }else if(this.effects.length == 4){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], Tone.Master);
            }else if(this.effects.length == 5){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], this.effects[4], Tone.Master);
            }else{
                this.module.toMaster();
            }
        }
    }
    connect(module, type)
    {
        switch(type){
            case "signal":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module);
                break;
            case "signalA":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 0).toMaster();
                break;
            case "signalB":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 1).toMaster();
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
                this.module.set({"oscillator":{"frequency":this.controllers[cIndex].value}});
                break;
            case 1:
                this.module.volume.value = this.controllers[cIndex].value;
                break;
            case 2:
                this.module.set({"envelope":{"attack":this.controllers[cIndex].value}});
                break;
            case 3:
                this.module.set({"envelope":{"decay":this.controllers[cIndex].value}});
                break;
            case 4:
                this.module.set({"envelope":{"sustain":this.controllers[cIndex].value}});
                break;
            case 5:
                this.module.set({"envelope":{"release":this.controllers[cIndex].value}});
                break;
            case 6:
                this.module.set({"oscillator":{"partialCount":this.controllers[cIndex].value}});
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:323px'>"+
                      "<div class='name'>SYN-P12</div>"+
                      "<div style='float:left; margin-top:-4px'>"+
                        "<div class='section'>Frequency</div>"+
                        "<div></div>"+
                        "<div class='section'>Wave</div>"+
                        "<div style='width:100%; height: 30px'></div>"+
                        "<div class='section'>Signal</div>"+
                        "<div></div>"+
                      "</div>"+
                      
                      "<div style='float:left; width:55%; margin-left:10px; margin-top:-4px'>"+
                        "<div class='section'>Envelope</div>"+
                        "<div class='section'style='float:left'>Attack</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section'style='float:left; margin-left: 5px; margin-right:5px'>Decay</div>"+
                        "<div style='margin-bottom:5px'></div>"+
                        "<div class='section' style='float:left;'>Sustain</div>"+
                        "<div style='float:left; margin-left: 5px'></div>"+
                        "<div class='section' style='float:left; margin-left: 5px; margin-right:5px'>Release</div>"+
                        "<div></div>"+
                        "<div class='section' style=''>Trigger In</div>"+
                      "</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(15, 6000, 15, "knob", this.module.voices[0].frequency.value, modIndex, 0));
        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.voices[0].volume.value, modIndex, 1));
        

        this.controllers.push(new Controller(0.001, 1, 0.01, "knob", 0.1, modIndex, 2));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", 0.5, modIndex, 3));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", 0.2, modIndex, 4));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", 0.5, modIndex, 5));
        this.controllers.push(new Controller(1, 40, 2, "knob", 1, modIndex, 6));

        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "SINE";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].module.set({"oscillator":{"type":"sine"}});};

        this.buttons[1].innerHTML = "TRI";
        this.buttons[1].classList.add("button");
        this.buttons[1].onclick = function(){Modules[modIndex].module.set({"oscillator":{"type":"triangle"}});};

        this.buttons[2].innerHTML = "SAW";
        this.buttons[2].classList.add("button");
        this.buttons[2].onclick = function(){Modules[modIndex].module.set({"oscillator":{"type":"sawtooth"}});};

        this.buttons.push(document.createElement("div"));
        this.buttons[3].innerHTML = "ON";
        this.buttons[3].classList.add("button");
        this.buttons[3].onclick = function(){
            if(Modules[modIndex].on){
                Modules[modIndex].on = false;
                this.innerHTML = "ON";
                Modules[modIndex].module.disconnect();
            }else{
                Modules[modIndex].on = true;
                this.innerHTML = "OFF";
                Modules[modIndex].updateChain();
            }
        };

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].style.float="left";
        this.outputs[0].style.marginRight="30px";
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].style.float="left";
        this.inputs[0].style.marginRight="15px";
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "trigger")};

        //Add everything to the document
        document.getElementById(modIndex).children[1].children[1].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.controllers[6].element);

        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[1].children[1].appendChild(this.inputs[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[0]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[1]);
        document.getElementById(modIndex).children[1].children[3].appendChild(this.buttons[2]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.buttons[3]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.controllers[1].element);
        

        document.getElementById(modIndex).children[2].children[2].appendChild(this.controllers[2].element);
        document.getElementById(modIndex).children[2].children[4].appendChild(this.controllers[3].element);
        document.getElementById(modIndex).children[2].children[6].appendChild(this.controllers[4].element);
        document.getElementById(modIndex).children[2].children[8].appendChild(this.controllers[5].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[2]);
    }
}

class SamplerModule
{
    constructor()
    {
        this.module = new Tone.Sampler();
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.effects = [];
        this.samplePitch = Tone.Frequency("c4").toFrequency();
        this.on = false;
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.volume.value = vol;
    }
    updateChain()
    {
        //Disconnect all effects
        for(let i = 0; i < this.effects.length; i++){
            this.effects[i].disconnect();
        }

        //Reconnect effects
        //Sound sources support up to 5 effects at once
        if(this.on){
            if(this.effects.length == 1){
                this.module.chain(this.effects[0], Tone.Master);
            }else if(this.effects.length == 2){
                this.module.chain(this.effects[0], this.effects[1], Tone.Master);
            }else if(this.effects.length == 3){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], Tone.Master);
            }else if(this.effects.length == 4){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], Tone.Master);
            }else if(this.effects.length == 5){
                this.module.chain(this.effects[0], this.effects[1], this.effects[2], this.effects[3], this.effects[4], Tone.Master);
            }else{
                this.module.toMaster();
            }
        }
    }
    connect(module, type)
    {
        switch(type){
            case "signal":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module);
                break;
            case "signalA":
                console.log("connected");
                //Disconnect all outputs
                //this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 0);
                break;
            case "signalB":
                console.log("connected");
                //Disconnect all outputs
                //this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 1);
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
                this.module.samplePitch = this.controllers[cIndex].value;
                break;
            case 1:
                this.module.volume.value = this.controllers[cIndex].value;
                console.log("vol");
                break;
            case 2:
                this.module.attack = this.controllers[cIndex].value;
                break;
            case 3:
                this.module.decay = this.controllers[cIndex].value;
                break;
            case 4:
                this.module.sustain = this.controllers[cIndex].value;
                break;
            case 5:
                this.module.release = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:323px'>"+
                      "<div class='name'>SAM-1</div>"+
                        "<div class='section'>Frequency</div>"+
                        "<div></div>"+
                        "<div class='section'>Sample</div>"+
                        "<div style='width:100%; height: 30px'></div>"+
                        "<div class='section'>Signal</div>"+
                        "<div></div>"+
                      
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(50, 4000, 50, "knob", Tone.Frequency("c4").toFrequency(), modIndex, 0));
        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.volume.value, modIndex, 1));

        this.controllers.push(new Controller(0.001, 1, 0.001, "knob", this.module.attack, modIndex, 2));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.decay, modIndex, 3));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", this.module.sustain, modIndex, 4));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.release, modIndex, 5));
        

        this.buttons.push(document.createElement("input"));
        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "FILE";
        this.buttons[0].classList.add("button");
        this.buttons[0].type = "file";
        this.buttons[0].onchange= function(e){Modules[modIndex].module.add("C4",e.target.files[0].path);};

        this.buttons.push(document.createElement("div"));
        this.buttons[1].innerHTML = "ON";
        this.buttons[1].classList.add("button");
        this.buttons[1].onclick = function(){
            if(Modules[modIndex].on){
                Modules[modIndex].on = false;
                this.innerHTML = "ON";
                Modules[modIndex].module.disconnect();
            }else{
                Modules[modIndex].on = true;
                this.innerHTML = "OFF";
                Modules[modIndex].updateChain();
            }
        };

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].style.float="left";
        this.outputs[0].style.marginRight="30px";
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].style.float="left";
        this.inputs[0].style.marginRight="15px";
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].style.float="left";
        this.inputs[1].style.marginRight="40px";
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>Trigger In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "trigger")};

        //Add everything to the document
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        //document.getElementById(modIndex).children[2].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[1]);
        document.getElementById(modIndex).children[4].appendChild(this.buttons[0]);
        document.getElementById(modIndex).children[6].appendChild(this.buttons[1]);
        document.getElementById(modIndex).children[6].appendChild(this.controllers[1].element);
        
        document.getElementById(modIndex).appendChild(this.inputs[2]);
    }
}