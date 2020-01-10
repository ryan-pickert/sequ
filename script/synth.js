class SynthModuleMono
{
    constructor()
    {
        this.module = new Tone.Synth();
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.oscillator.volume.value = vol;
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

        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(15, 6000, 15, "knob", this.module.oscillator.frequency.value, modIndex, 0));
        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.oscillator.volume.value, modIndex, 1));

        this.controllers.push(new Controller(0.001, 1, 0.001, "knob", this.module.envelope.attack, modIndex, 2));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.decay, modIndex, 3));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", this.module.envelope.sustain, modIndex, 4));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.release, modIndex, 5));

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
        document.getElementById(modIndex).children[1].children[5].appendChild(this.outputs[0]);
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
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.oscillator.volume.value = vol;
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

        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(15, 6000, 15, "knob", this.module.oscillator.frequency.value, modIndex, 0));
        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.oscillator.volume.value, modIndex, 1));

        this.controllers.push(new Controller(0.001, 1, 0.001, "knob", this.module.envelope.attack, modIndex, 2));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.decay, modIndex, 3));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", this.module.envelope.sustain, modIndex, 4));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.envelope.release, modIndex, 5));

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
        document.getElementById(modIndex).children[1].children[5].appendChild(this.outputs[0]);
        document.getElementById(modIndex).children[1].children[5].appendChild(this.controllers[1].element);
        

        document.getElementById(modIndex).children[2].children[2].appendChild(this.controllers[2].element);
        document.getElementById(modIndex).children[2].children[4].appendChild(this.controllers[3].element);
        document.getElementById(modIndex).children[2].children[6].appendChild(this.controllers[4].element);
        document.getElementById(modIndex).children[2].children[8].appendChild(this.controllers[5].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[2]);
    }
}