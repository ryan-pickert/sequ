class LFOModule
{
    constructor()
    {      
        this.name = "LFO-1";
        this.module = new Tone.LFO(Tone.Time('4n'), 200, 400);
        this.controllers = []; //Array of controllers (knobs, etc)
        this.outputs = [];
        this.inputs = [];
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
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:135px'>"+
                      "<div class='name'>LFO-1</div>"+
                      "<div class='section'>Frequency</div>"+
                      "<div></div>"+
                      "<div class='section'>Freq Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);

        this.controllers.push(new Controller(1, 20, 1, "knob", this.module.frequency.value, modIndex, 0));

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).appendChild(this.outputs[0]);
    }
}