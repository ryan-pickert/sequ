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
        this.outputs = [];
        this.clocks = [];
        this.createUI();
    }
    connect(module, type)
    {
        //What this module is being connected to
        switch(type){
            case "trigger":
                var light = this.lights[this.lightIndex];
                light.id = "off";
                //if(this.module != undefined)
                    //this.module.dispose();
                var c = new Tone.Clock(trigger, this.triggerFreq);
                this.clocks.push(c);
                this.module = c;
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
                //if(this.module != undefined)
                    //this.module.dispose();

                var c = new Tone.Clock(step, this.triggerFreq);
                this.clocks.push(c);
                this.module = c;
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
        var modIndex = Modules.length;
        var mod = document.createElement("div");
        var layout = "<div class='module' id='"+modIndex+"' style='width:102px'>"+
                      "<div class='name'>Clock-1</div>"+
                      "<div class='section'>Trigger Out</div>"+
                      "<div style='float:left'></div>"+
                      "<div style='float:left; margin-left:35px'></div>"+
                      "</div";

        mod.innerHTML = layout;
        
        document.getElementById("wrapper").appendChild(mod);

        for(let i = 0; i < 6; i++){
            var out = document.createElement("div");
            var light = document.createElement("div");

            out.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
            out.classList.add("output");
            this.outputs.push(out);

            light.classList.add("light");
            this.lights.push(light);
        }
        
        this.outputs[0].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = 0.5; 
            Modules[modIndex].lightIndex = 0};

        this.outputs[1].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = 1; 
            Modules[modIndex].lightIndex = 1};

        this.outputs[2].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = 2; 
            Modules[modIndex].lightIndex = 2};

        this.outputs[3].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = 4; 
            Modules[modIndex].lightIndex = 3};

        this.outputs[4].onclick = function(){
            Connect(mod,this); Modules[modIndex].triggerFreq = 8; 
            Modules[modIndex].lightIndex = 4};

        this.outputs[5].onclick = function(){
            Connect(mod,this); Modules[modIndex].triggerFreq = 16; 
            Modules[modIndex].lightIndex = 5};


        document.getElementById(modIndex).children[2].appendChild(this.lights[0]);
        document.getElementById(modIndex).children[2].appendChild(this.outputs[0]);
        document.getElementById(modIndex).children[2].appendChild(this.lights[1]);
        document.getElementById(modIndex).children[2].appendChild(this.outputs[1]);
        document.getElementById(modIndex).children[2].appendChild(this.lights[2]);
        document.getElementById(modIndex).children[2].appendChild(this.outputs[2]);

        document.getElementById(modIndex).children[3].appendChild(this.lights[3]);
        document.getElementById(modIndex).children[3].appendChild(this.outputs[3]);
        document.getElementById(modIndex).children[3].appendChild(this.lights[4]);
        document.getElementById(modIndex).children[3].appendChild(this.outputs[4]);
        document.getElementById(modIndex).children[3].appendChild(this.lights[5]);
        document.getElementById(modIndex).children[3].appendChild(this.outputs[5]);
    }
}