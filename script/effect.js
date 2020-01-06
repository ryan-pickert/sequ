class LFOModule
{
    constructor()
    {      
        this.name = "LFO-1";
        this.module = new Tone.LFO(Tone.Time('4n'), 200, 400);
        this.createUI();
    }
    connect(module, type)
    {
        //Connect LFO to whatever parameter
        switch(type){
            case "frequency":
                console.log("connected");
                this.module.connect(module.module.frequency);
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
        var knob1 = document.createElement("div");
        //var secWave = document.createElement("div");
        var out1 = document.createElement("div");
        

        mod.classList.add("module");
        secName.onmousedown = function(){move(event, mod)};
        if(Modules == undefined)
            mod.id = 0;
        else
            mod.id = Modules.length;
        
        mod.appendChild(secName);
        secName.innerHTML = "LFO";
        secName.classList.add("name");

        mod.appendChild(sec1);
        sec1.innerHTML = "Rate";
        sec1.classList.add("section");

        mod.appendChild(knob1);
        knob1.innerHTML="|";
        knob1.classList.add("knob");
        knob1.id = "frequency";
        knob1.onmousedown = function(){TurnKnob(this, event)};

        mod.appendChild(out1);
        out1.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out1.classList.add("output");
        out1.onclick = function(){Connect(this)};


        document.getElementById("wrapper").appendChild(mod);
    }
}