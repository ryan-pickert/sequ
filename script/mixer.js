class CrossFadeModule
{
    constructor()
    {
        this.module = new Tone.CrossFade(0.5);
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    connect(module, type)
    {
        switch(type){
            case "signal":
                console.log("connected");
                
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
                this.module.fade.value = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:140px'>"+
                      "<div class='name'>CRSFD-1</div>"+
                      "<div class='section'>Fade</div>"+
                      "<div></div>"+
                      "<div class='section'>Signal</div>"+
                      "<div></div>"+
                      "<div class='section'>Output</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);

        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(0, 1, 0.1, "knob", this.module.fade.value, modIndex, 0));

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In A</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "signalA")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>In B</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "signalB")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>ENV In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "env")};


        //Add everything to the document
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[4].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[4].appendChild(this.inputs[1]);
        document.getElementById(modIndex).appendChild(this.inputs[2]);
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        //document.getElementById(modIndex).appendChild(this.inputs[2]);
    }
}