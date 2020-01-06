class EnvelopeModule
{
    constructor()
    {      
        this.name = "ENV-1";
        this.module = new Tone.AmplitudeEnvelope();
        this.createUI();
    }
    connect(module, type)
    {
        
        //Connect LFO to whatever parameter
        switch(type){
            case "signal":
                console.log("connected");
                this.module.disconnect();
                this.module.connect(module.module);
                break;
            case "volume":
                this.module.connect(module.module.volume.value);
                break;
            default:
                break;
        }   
    }
    control(p, value)
    {
        switch(p){
            case "frequency":
                this.module.frequency.value = value/50;
                break;
        }

    }
    createUI()
    {
        var mod = document.createElement("div");
        var secName = document.createElement("div");
        var sec1 = document.createElement("div");
        var sec2 = document.createElement("div");
        var knob1 = document.createElement("div");
        //var secWave = document.createElement("div");
        var out1 = document.createElement("div");
        var in1 = document.createElement("div");
        var in2 = document.createElement("div");
        var bTrigger = document.createElement("div");

        mod.classList.add("module");
        secName.onmousedown = function(){move(event, mod)};
        if(Modules == undefined)
            mod.id = 0;
        else
            mod.id = Modules.length;
        
        mod.appendChild(secName);
        secName.innerHTML = this.name;
        secName.classList.add("name");

        mod.appendChild(sec1);
        sec1.innerHTML = "Input";
        sec1.classList.add("section");

        //mod.appendChild(knob1);
        //knob1.innerHTML="|";
        //knob1.classList.add("knob");
        //knob1.id = "";
        //knob1.onmousedown = function(){TurnKnob(this, event)};
        mod.appendChild(in1);
        in1.innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        in1.classList.add("input");
        in1.id="signal";
        in1.onclick = function(){Connect(this)};

        mod.appendChild(sec2);
        sec2.innerHTML = "Output";
        sec2.classList.add("section");

        
        mod.appendChild(out1);
        out1.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out1.classList.add("output");
        out1.onclick = function(){Connect(this)};

        mod.appendChild(bTrigger);
        bTrigger.innerHTML = "Trigger";
        bTrigger.style.float = "none";
        bTrigger.classList.add("button");
        bTrigger.onclick = function(){Modules[Number(mod.id)].module.triggerAttackRelease(0.5)};

        mod.appendChild(in2);
        in2.innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        in2.classList.add("input");
        in2.id="trigger";
        in2.onclick = function(){Connect(this)};

        document.getElementById("wrapper").appendChild(mod);
    }
}