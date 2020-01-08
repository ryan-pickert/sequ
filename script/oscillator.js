class VCOModule
{
    constructor(freq, wave)
    {
        this.module = new Tone.Oscillator(freq, wave);
        this.module.sync();
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    setVolume(vol)
    {
        this.module.volume.value = vol;
    }
    setFreq(freq)
    {
        this.module.frequency.value = freq;
    }
    setType()
    {
        this.module.type = "sawtooth";
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
                this.module.frequency.value = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:135px'>"+
                      "<div class='name'>VCO-1</div>"+
                      "<div class='section'>Frequency</div>"+
                      "<div></div>"+
                      "<div class='section'>Wave</div>"+
                      "<div style='width:100%; height: 30px'></div>"+
                      "<div class='section'>Signal Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);

        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(15, 6000, 15, "knob", this.module.frequency.value, modIndex, 0));

        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "SINE";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].module.type = "sine"};

        this.buttons[1].innerHTML = "TRI";
        this.buttons[1].classList.add("button");
        this.buttons[1].onclick = function(){Modules[modIndex].module.type = "triangle"};

        this.buttons[2].innerHTML = "SAW";
        this.buttons[2].classList.add("button");
        this.buttons[2].onclick = function(){Modules[modIndex].module.type = "sawtooth"};

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        

        //Add everything to the document
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[4].appendChild(this.buttons[0]);
        document.getElementById(modIndex).children[4].appendChild(this.buttons[1]);
        document.getElementById(modIndex).children[4].appendChild(this.buttons[2]);
        document.getElementById(modIndex).appendChild(this.outputs[0]);
    }
}