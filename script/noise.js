class NoiseModule
{
    constructor(type)
    {
        this.module = new Tone.Noise(type);
        this.module.sync();
        this.module.start();
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
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module);
                break;
            case "signalA":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 0);
                break;
            case "signalB":
                console.log("connected");
                //Disconnect all outputs
                this.module.disconnect();
                //Connect output to new module
                this.module.connect(module.module, 0, 1);
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
                this.module.volume.value = this.controllers[cIndex].value;
                break;
            case 1:
                this.module.volume.value = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:166px'>"+
                      "<div class='name'>NOISE-1</div>"+
                      "<div class='section'>Frequency</div>"+
                      "<div></div>"+
                      "<div class='section'>Type</div>"+
                      "<div style='width:100%; height: 30px'></div>"+
                      "<div class='section'>Signal Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(-50, 0, 1, "knob", this.module.volume.value, modIndex, 0));

        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));
        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "WHITE";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].module.type = "white"};

        this.buttons[1].innerHTML = "PINK";
        this.buttons[1].classList.add("button");
        this.buttons[1].onclick = function(){Modules[modIndex].module.type = "pink"};

        this.buttons[2].innerHTML = "BROWN";
        this.buttons[2].classList.add("button");
        this.buttons[2].onclick = function(){Modules[modIndex].module.type = "brown"};

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].style.float="left";
        this.outputs[0].style.marginRight="30px";
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].style.float="left";
        this.inputs[0].style.marginRight="15px";
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>ENV In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].style.float="right";
        this.inputs[2].style.marginRight="25px";
        this.inputs[2].onclick = function(){Connect(mod, this, "env")};

        //Add everything to the document
        //document.getElementById(modIndex).children[2].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[1]);
        document.getElementById(modIndex).children[4].appendChild(this.buttons[0]);
        document.getElementById(modIndex).children[4].appendChild(this.buttons[1]);
        document.getElementById(modIndex).children[4].appendChild(this.buttons[2]);
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        document.getElementById(modIndex).appendChild(this.controllers[0].element);
        document.getElementById(modIndex).appendChild(this.inputs[2]);
    }
}