class FilterModuleBand
{
    constructor()
    {
        this.module = new Tone.Filter(200, "bandpass", -24);
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    connect(module, type)
    {
        switch(type){
            case "effect":
                console.log("connected");
                
                //Connect output to new module
                module.module.chain(this.module, Tone.Master);
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
                this.module.frequency.value = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:140px'>"+
                      "<div class='name'>BAND-1</div>"+
                      "<div class='section'>Frequency</div>"+
                      "<div></div>"+
                      "<div class='section'>Effect</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(200, 1500, 60, "knob", this.module.frequency.value, modIndex, 0));

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>ENV In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "env")};

        //Add everything to the document
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[0]);
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        //document.getElementById(modIndex).appendChild(this.inputs[2]);
    }
}

class FilterModuleHigh
{
    constructor()
    {
        this.module = new Tone.Filter(250, "highpass", -24);
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    connect(module, type)
    {
        switch(type){
            case "effect":
                console.log("connected");
                
                //Connect output to new module
                module.module.chain(this.module, Tone.Master);
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
                this.module.frequency.value = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:140px'>"+
                      "<div class='name'>HIGH-1</div>"+
                      "<div class='section'>Frequency</div>"+
                      "<div></div>"+
                      "<div class='section'>Effect</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(250, 2000, 50, "knob", this.module.frequency.value, modIndex, 0));

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>ENV In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "env")};

        //Add everything to the document
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[0]);
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        //document.getElementById(modIndex).appendChild(this.inputs[2]);
    }
}

class FilterModuleLow
{
    constructor()
    {
        this.module = new Tone.Filter(250, "lowpass", -24);
        this.outputs = [];
        this.inputs = [];
        this.buttons = [];
        this.controllers = []; //Array of controllers (knobs, etc)
        this.createUI();
    }
    connect(module, type)
    {
        switch(type){
            case "effect":
                console.log("connected");
                
                //Connect output to new module
                module.module.chain(this.module, Tone.Master);
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
                this.module.frequency.value = this.controllers[cIndex].value;
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:140px'>"+
                      "<div class='name'>LOW-1</div>"+
                      "<div class='section'>Frequency</div>"+
                      "<div></div>"+
                      "<div class='section'>Effect</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        //secName.onmousedown = function(){move(event, mod)};

        this.controllers.push(new Controller(250, 2000, 50, "knob", this.module.frequency.value, modIndex, 0));

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));
        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "frequency")};

        this.inputs[1].innerHTML = "<div id='inner'></div><div id='label'>Effect</div>";
        this.inputs[1].classList.add("input");
        this.inputs[1].onclick = function(){Connect(mod, this, "effect")};

        this.inputs[2].innerHTML = "<div id='inner'></div><div id='label'>ENV In</div>";
        this.inputs[2].classList.add("input");
        this.inputs[2].onclick = function(){Connect(mod, this, "env")};

        //Add everything to the document
        document.getElementById(modIndex).children[2].appendChild(this.controllers[0].element);
        document.getElementById(modIndex).children[2].appendChild(this.inputs[0]);
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        //document.getElementById(modIndex).appendChild(this.inputs[2]);
    }
}