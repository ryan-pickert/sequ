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
                var c = new Tone.Loop(trigger, this.triggerFreq).start("1m");
                this.clocks.push(c);
                this.module = c;
                function trigger(time)
                {
                    if(module.module.envelope == undefined){
                        module.module.triggerAttackRelease("8n", time);
                    }else
                    {
                        if(module.module.oscillator != undefined){
                            module.module.triggerAttackRelease(module.module.oscillator.frequency.value, "8n", time);

                        }else if(module.module.voices != undefined){
                            module.module.triggerAttackRelease(module.module.voices[0].frequency.value, "8n", time);

                        }else{
                            module.module.triggerAttackRelease("8n", time);
                        }
                    }
                    
                }
                break;
            case "sequence":
                var c = new Tone.Loop(step, this.triggerFreq).start("1m");
                this.clocks.push(c);
                this.module = c;
                function step()
                {
                    module.stepSequence();
                }
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

        var l1 = this.lights[0];
        var l2 = this.lights[1];
        var l3 = this.lights[2];
        var l4 = this.lights[3];
        var l5 = this.lights[4];
        var l6 = this.lights[5];

        var c = new Tone.Loop(function(){if(l1.id=="off"){l1.id = "on";}else{l1.id = "off";}}, Tone.TransportTime("1n")).start("1m");
        var c = new Tone.Loop(function(){if(l2.id=="off"){l2.id = "on";}else{l2.id = "off";}}, Tone.TransportTime("2n")).start("1m");
        var c = new Tone.Loop(function(){if(l3.id=="off"){l3.id = "on";}else{l3.id = "off";}}, Tone.TransportTime("4n")).start("1m");
        var c = new Tone.Loop(function(){if(l4.id=="off"){l4.id = "on";}else{l4.id = "off";}}, Tone.TransportTime("8n")).start("1m");
        var c = new Tone.Loop(function(){if(l5.id=="off"){l5.id = "on";}else{l5.id = "off";}}, Tone.TransportTime("16n")).start("1m");
        var c = new Tone.Loop(function(){if(l6.id=="off"){l6.id = "on";}else{l6.id = "off";}}, Tone.TransportTime("32n")).start("1m");

        
        this.outputs[0].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = Tone.TransportTime("1n"); 
            Modules[modIndex].lightIndex = 0};

        this.outputs[1].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = Tone.TransportTime("2n"); 
            Modules[modIndex].lightIndex = 1};

        this.outputs[2].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = Tone.TransportTime("4n"); 
            Modules[modIndex].lightIndex = 2};

        this.outputs[3].onclick = function(){
            Connect(mod, this); Modules[modIndex].triggerFreq = Tone.TransportTime("8n"); 
            Modules[modIndex].lightIndex = 3};

        this.outputs[4].onclick = function(){
            Connect(mod,this); Modules[modIndex].triggerFreq = Tone.TransportTime("16n"); 
            Modules[modIndex].lightIndex = 4};

        this.outputs[5].onclick = function(){
            Connect(mod,this); Modules[modIndex].triggerFreq = Tone.TransportTime("32n"); 
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