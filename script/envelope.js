class EnvelopeModule
{
    constructor()
    {      
        this.name = "ENV-1";
        this.module = new Tone.AmplitudeEnvelope();
        this.outputs = [];
        this.inputs = [];
        this.controllers = [];
        this.createUI();
    }
    connect(module, type)
    {
        //Connect LFO to whatever parameter
        switch(type){
            case "env":
                console.log("connected");
                module.module.disconnect();
                module.module.connect(this.module);
                this.module.toMaster();
                break;
            case "frequency":
                console.log("connected");
                this.module = new Tone.FrequencyEnvelope();
                this.module.baseFrequency = 15;
                this.module.octaves = 1;
                this.module.attackCurve = "exponential";
                this.module.connect(module.module.frequency);
                break;
            case "volume":
                this.module.connect(module.module.volume.value);
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
                this.module.attack = this.controllers[cIndex].value;
                break;
            case 1:
                this.module.decay = this.controllers[cIndex].value;
                break;
            case 2:
                this.module.sustain = this.controllers[cIndex].value;
                break;
            case 3:
                this.module.release = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:178px'>"+
                      "<div class='name'>ENV-1</div>"+
                      "<div class='section'style='float:left'>Attack</div>"+
                      "<div style='float:left; margin-left: 5px'></div>"+
                      "<div class='section'style='float:left; margin-left: 5px; margin-right:5px'>Decay</div>"+
                      "<div style='margin-bottom:5px'></div>"+
                      "<div class='section' style='float:left;'>Sustain</div>"+
                      "<div style='float:left; margin-left: 5px'></div>"+
                      "<div class='section' style='float:left; margin-left: 5px; margin-right:5px'>Release</div>"+
                      "<div></div>"+
                      "<div class='section'>Trigger In</div>"+
                      "<div></div>"+
                      "<div class='section'>ENV Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);

        this.outputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "trigger")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "signal")};

        this.controllers.push(new Controller(0.001, 1, 0.001, "knob", this.module.attack, modIndex, 0));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.decay, modIndex, 1));
        this.controllers.push(new Controller(0.001, 1, 0.1, "knob", this.module.sustain, modIndex, 2));
        this.controllers.push(new Controller(0.1, 1, 0.1, "knob", this.module.release, modIndex, 3));

        
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        document.getElementById(modIndex).children[10].appendChild(this.inputs[0]);
        
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[4].appendChild(this.controllers[1].element);
        document.getElementById(modIndex).children[6].appendChild(this.controllers[2].element);
        document.getElementById(modIndex).children[8].appendChild(this.controllers[3].element);
    }
}