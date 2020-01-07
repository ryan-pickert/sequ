class LFOModule
{
    constructor()
    {      
        this.name = "LFO-1";
        this.module = new Tone.LFO(Tone.Time('4n'), 200, 400);
        this.controllers = []; //Array of controllers (knobs, etc)

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

        //Handle controller
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
        knob1.onmousedown = function(){TurnKnob(this, event,0)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(0, 20, 0.5));
        this.controllers[this.controllers.length-1].value = this.module.frequency.value;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob1.style.transform = "rotate("+((rotation*240)-130) + "deg)";

        mod.appendChild(out1);
        out1.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out1.classList.add("output");
        out1.onclick = function(){Connect(this)};


        document.getElementById("wrapper").appendChild(mod);
    }
}