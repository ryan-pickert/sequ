class MasterModule
{
    constructor()
    {      
        this.name = "Master Out";
        this.module = Tone.Master;
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.labels = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
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
                Tone.Transport.bpm.value = this.controllers[cIndex].value;
                this.labels[cIndex].innerHTML = Math.floor(Tone.Transport.bpm.value);
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:102px'>"+
                      "<div class='name'>Master</div>"+
                      "<div class='section'>BPM</div>"+
                      "<div></div>"+
                      "<div class='section'>Signal Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        this.controllers.push(new Controller(70, 160, 2, "knob", Tone.Transport.bpm.value, modIndex, 0));
        
        var kLabel = document.createElement("div");
        kLabel.id = "knobLabel";
        this.labels.push(kLabel);
        this.labels[0].innerHTML = Tone.Transport.bpm.value;

        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "signal")};
        document.getElementById(modIndex).appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[2].appendChild(this.labels[0]);
    }
}