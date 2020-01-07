class VCOModule
{
    constructor(freq, wave)
    {
        this.module = new Tone.Oscillator(freq, wave);
        this.module.sync();
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
        var secName = document.createElement("div");
        var secFreq = document.createElement("div");
        var secIn = document.createElement("div");
        var secOut = document.createElement("div");
        var secWave = document.createElement("div");
        var inFreq = document.createElement("div");
        var outEnv = document.createElement("div");
        var knob1 = document.createElement("div");
        var bSine = document.createElement("div");
        var bTri = document.createElement("div");
        var bSaw = document.createElement("div");

        mod.classList.add("module");
        secName.onmousedown = function(){move(event, mod)};
        if(Modules == undefined)
            mod.id = 0;
        else
            mod.id = Modules.length;
        
        mod.appendChild(secName);
        secName.innerHTML = "VCO";
        secName.classList.add("name");

        mod.appendChild(secFreq);
        secFreq.innerHTML = "Frequency";
        secFreq.classList.add("section");

        
        //Frequency knob
        mod.appendChild(knob1);
        
        knob1.innerHTML="|";
        knob1.classList.add("knob");
        knob1.onmousedown = function(){TurnKnob(this, event, 0)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(15, 6000, 15));
        this.controllers[this.controllers.length-1].value = this.module.frequency.value;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob1.style.transform = "rotate("+((rotation*240)-130) + "deg)";

        
        mod.appendChild(document.createElement("br"));
        

        mod.appendChild(inFreq);
        inFreq.innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        inFreq.classList.add("input");
        inFreq.id = "frequency";
        inFreq.onclick = function(){Connect(this)};


        mod.appendChild(secWave);
        secWave.innerHTML = "Wave";
        secWave.classList.add("section");

        mod.appendChild(bSine);
        bSine.innerHTML = "SINE";
        bSine.classList.add("button");
        bSine.onclick = function(){Modules[Number(mod.id)].module.type = "sine"};

        mod.appendChild(bTri);
        bTri.innerHTML = "TRI";
        bTri.classList.add("button");
        bTri.onclick = function(){Modules[Number(mod.id)].module.type = "triangle"};

        mod.appendChild(bSaw);
        bSaw.innerHTML = "SAW";
        bSaw.classList.add("button");
        bSaw.onclick = function(){Modules[Number(mod.id)].module.type = "sawtooth"};

        
        mod.appendChild(secOut);
        secOut.innerHTML = "Output";
        secOut.classList.add("section");

        mod.appendChild(outEnv);
        outEnv.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        outEnv.classList.add("output");
        outEnv.onclick = function(){Connect(this)};

        document.getElementById("wrapper").appendChild(mod);
    }
}