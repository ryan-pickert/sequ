class ClockModule
{
    constructor()
    {      
        this.name = "Clock-1";
        this.trigger;
        this.module;
        this.connectedModule = 0;
        this.createUI();
        this.light;
    }
    connect(module, type)
    {
        //What this module is being connected to
        switch(type){
            case "trigger":
                var light = this.light;
                light.id = "off";
                this.module = new Tone.Clock(trigger, Tone.Time('4n'));
                function trigger()
                {
                    if(light.id == "off")
                        light.id = "on";
                    else
                        light.id = "off";
                    module.module.triggerAttackRelease(0.5);
                    
                }
                this.module.start();
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
                this.module.frequency.value = Tone.Time(Math.floor(value/10)).quantize(1);
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
        var light1 = document.createElement("div");
        

        mod.classList.add("module");
        secName.onmousedown = function(){move(event, mod)};
        if(Modules == undefined)
            mod.id = 0;
        else
            mod.id = Modules.length;
        
        mod.appendChild(secName);
        secName.innerHTML = this.name;
        secName.classList.add("name");

        mod.appendChild(knob1);
        knob1.innerHTML="|";
        knob1.classList.add("knob");
        knob1.id = "frequency";
        knob1.onmousedown = function(){TurnKnob(this, event)};

        mod.appendChild(sec1);
        sec1.innerHTML = "Trigger";
        sec1.classList.add("section");

        mod.appendChild(light1);
        
        light1.classList.add("light");
        
        this.light = light1;
        

        mod.appendChild(out1);
        out1.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out1.classList.add("output");
        out1.onclick = function(){Connect(this)};


        document.getElementById("wrapper").appendChild(mod);
    }
}