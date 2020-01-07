class ClockModule
{
    constructor()
    {      
        this.name = "Clock-1";
        this.trigger;
        this.module;
        this.connectedModule = 0;
        this.lights = [];
        this.lightIndex = 0;
        this.triggerFreq;
        this.createUI();
    }
    connect(module, type)
    {
        //What this module is being connected to
        switch(type){
            case "trigger":
                var light = this.lights[this.lightIndex];
                light.id = "off";
                if(this.module != undefined)
                    this.module.dispose();
                this.module = new Tone.Clock(trigger, this.triggerFreq);
                SyncClocks();
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
            case "sequence":
                var light = this.lights[this.lightIndex];
                light.id = "off";
                if(this.module != undefined)
                    this.module.dispose();
                this.module = new Tone.Clock(step, this.triggerFreq);
                SyncClocks();
                function step()
                {
                    if(light.id == "off")
                        light.id = "on";
                    else
                        light.id = "off";
                    
                    
                    module.stepSequence();
                }
                this.module.start();
                break;
            default:
                break;
        }   
    }
    control(value, cIndex)
    {
       
    }
    createUI()
    {
        var mod = document.createElement("div");
        var secName = document.createElement("div");
        var sec1 = document.createElement("div");
        var knob1 = document.createElement("div");
        //var secWave = document.createElement("div");
        var out1 = document.createElement("div");
        var out2 = document.createElement("div");
        var out3 = document.createElement("div");
        var out4 = document.createElement("div");
        var light1 = document.createElement("div");
        var light2 = document.createElement("div");
        var light3 = document.createElement("div");
        var light4 = document.createElement("div");
        

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
        sec1.innerHTML = "Trigger";
        sec1.classList.add("section");

        mod.appendChild(light1);
        light1.classList.add("light");
        this.lights.push(light1);
        
        mod.appendChild(out1);
        out1.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out1.classList.add("output");
        out1.onclick = function(){Connect(this); Modules[Number(mod.id)].triggerFreq = 1; Modules[Number(mod.id)].lightIndex = 0};

        mod.appendChild(light2);
        light2.classList.add("light");
        this.lights.push(light2);
        
        mod.appendChild(out2);
        out2.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out2.classList.add("output");
        out2.onclick = function(){Connect(this); Modules[Number(mod.id)].triggerFreq = 2; Modules[Number(mod.id)].lightIndex = 1};


        document.getElementById("wrapper").appendChild(mod);
    }
}