class SequencerModule4
{
    constructor()
    {      
        this.name = "Seq-4";
        this.lights = [];
        this.controllers = [];
        this.noteLabels = [];
        this.outputs =[];
        this.inputs = [];
        this.buttons = [];
        this.programStep = 0;
        this.program = false;
        this.stepIndex = -1;//Current step in the sequence
        this.sequence = [48,48,48,48]; //Array of frequencies(notes)
        this.module;
        this.createUI();
    }
    connect(module, type)
    {
        //What this module is being connected to
        switch(type){
            case "frequency":
                this.module = module.module;
                break;
            default:
                break;
        }   
    }
    programSequence(note)
    {
        if(this.programStep == this.sequence.length-1){
            this.sequence[this.programStep] = Tone.Frequency(note, "midi");
            this.noteLabels[this.programStep].innerHTML = this.sequence[this.programStep].toNote();
            this.programStep++;
            
            this.program = false;
            this.programStep=0;
            this.buttons[0].innerHTML = "PROGRAM";
        }else{
            this.sequence[this.programStep] = Tone.Frequency(note, "midi");
            this.noteLabels[this.programStep].innerHTML = this.sequence[this.programStep].toNote();
            this.programStep++;
        }
    }
    stepSequence()
    {
        if(this.program){
            this.buttons[0].innerHTML = "INPUT...";
        }
        
        //Step through sequence
        this.stepIndex++;
        if(this.stepIndex == this.sequence.length){
            //Restart the sequence;
            this.stepIndex = 0;
        }

        if(this.module.oscillator != undefined){
            this.module.oscillator.frequency.value = this.sequence[this.stepIndex]; 
            
        }else if(this.module.voices != undefined){
            this.module.set({"oscillator":{"frequency":this.sequence[this.stepIndex]}});
        }else{
            this.module.frequency.value = this.sequence[this.stepIndex];  
        }

        if(this.stepIndex == 0)
            this.lights[this.lights.length-1].id = "on";
        else
            this.lights[this.stepIndex-1].id = "on";
        this.lights[this.stepIndex].id = "off";
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


        if(this.controllers[cIndex].value < 21){
            this.noteLabels[cIndex].innerHTML = "off";
            this.sequence[cIndex] = Tone.Frequency(0);
        }else
        {
            this.noteLabels[cIndex].innerHTML = this.sequence[cIndex].toNote();
            this.sequence[cIndex] = Tone.Frequency(this.controllers[cIndex].value, "midi");
        }

        
        
        //Handle controller
        switch(cIndex){
            case 0:
                
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"'>"+
                      "<div class='name'>SEQ-4</div>"+
                      "<div class='section'>Notes</div>"+
                      "<div style='width:320px; height: 60px'></div>"+
                      "<div class='section'>Trigger In</div>"+
                      "<div></div>"+
                      "<div class='section'>Freq Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);       
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        for(let i = 0; i < this.sequence.length; i++){
            var l = document.createElement("div");
            var kLabel = document.createElement("div");
            l.classList.add("light");
            kLabel.id="knobLabel";
            
            l.style.float="left";
            kLabel.style.float="left";

            this.controllers.push(new Controller(20, 108, 1, "knob", 48, modIndex, i));
            this.controllers[i].element.style.float = "left";
            this.lights.push(l);
            this.noteLabels.push(kLabel);

            this.sequence[i] = Tone.Frequency(this.controllers[i].value, "midi");
            this.noteLabels[i].innerHTML = this.sequence[i].toNote();

            
            document.getElementById(modIndex).children[2].appendChild(this.lights[i]);
            document.getElementById(modIndex).children[2].appendChild(this.controllers[i].element);
            document.getElementById(modIndex).children[2].appendChild(this.noteLabels[i]);
        }

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "sequence")};

        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "PROGRAM";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].program = true};

        
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        document.getElementById(modIndex).children[4].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[2].appendChild(this.buttons[0]);
    }
}

class SequencerModule8
{
    constructor()
    {      
        this.name = "Seq-8";
        this.lights = [];
        this.controllers = [];
        this.noteLabels = [];
        this.outputs =[];
        this.inputs = [];
        this.buttons = [];
        this.programStep = 0;
        this.program = false;
        this.stepIndex = -1;//Current step in the sequence
        this.sequence = [48,48,48,48,48,48,48,48]; //Array of frequencies(notes)
        this.module;
        this.createUI();
    }
    connect(module, type)
    {
        //What this module is being connected to
        switch(type){
            case "frequency":
                this.module = module.module;
                break;
            default:
                break;
        }   
    }
    programSequence(note)
    {
        if(this.programStep == this.sequence.length-1){
            this.sequence[this.programStep] = Tone.Frequency(note, "midi");
            this.noteLabels[this.programStep].innerHTML = this.sequence[this.programStep].toNote();
            this.programStep++;
            
            this.program = false;
            this.programStep=0;
            this.buttons[0].innerHTML = "PROGRAM";
        }else{
            
            this.sequence[this.programStep] = Tone.Frequency(note, "midi");
            this.noteLabels[this.programStep].innerHTML = this.sequence[this.programStep].toNote();
            this.programStep++;
        }
    }
    stepSequence()
    {
        if(this.program){
            this.buttons[0].innerHTML = "INPUT...";
        }
        //Step through sequence
        this.stepIndex++;
        if(this.stepIndex == this.sequence.length){
            //Restart the sequence;
            this.stepIndex = 0;
        }

        if(this.module.oscillator != undefined){
            this.module.oscillator.frequency.value = this.sequence[this.stepIndex]; 
            
        }else if(this.module.voices != undefined){
            this.module.set({"oscillator":{"frequency":this.sequence[this.stepIndex]}});
        }else{
            this.module.frequency.value = this.sequence[this.stepIndex];  
        }

        if(this.stepIndex == 0)
            this.lights[this.lights.length-1].id = "on";
        else
            this.lights[this.stepIndex-1].id = "on";
        this.lights[this.stepIndex].id = "off";
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


        if(this.controllers[cIndex].value < 21){
            this.noteLabels[cIndex].innerHTML = "off";
            this.sequence[cIndex] = Tone.Frequency(0);
        }else
        {
            this.noteLabels[cIndex].innerHTML = this.sequence[cIndex].toNote();
            this.sequence[cIndex] = Tone.Frequency(this.controllers[cIndex].value, "midi");
        }
        //Handle controller
        switch(cIndex){
            case 0:
                
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"'>"+
                      "<div class='name'>SEQ-8</div>"+
                      "<div class='section'>Notes</div>"+
                      "<div style='width:320px; height: 38px'></div>"+
                      "<div style='width:320px; height: 60px'></div>"+
                      "<div class='section'>Trigger In</div>"+
                      "<div></div>"+
                      "<div class='section'>Freq Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);       
        mod.children[0].children[0].onmousedown = function(){Move(event, this)};
        for(let i = 0; i < this.sequence.length; i++){
            var l = document.createElement("div");
            var kLabel = document.createElement("div");
            l.classList.add("light");
            kLabel.id="knobLabel";
            
            l.style.float="left";
            kLabel.style.float="left";

            this.controllers.push(new Controller(20, 108, 1, "knob", 48, modIndex, i));
            this.controllers[i].element.style.float = "left";
            this.lights.push(l);
            this.noteLabels.push(kLabel);

            this.sequence[i] = Tone.Frequency(this.controllers[i].value, "midi");
            this.noteLabels[i].innerHTML = this.sequence[i].toNote();

            if(i >= 4){
                document.getElementById(modIndex).children[3].appendChild(this.lights[i]);
                document.getElementById(modIndex).children[3].appendChild(this.controllers[i].element);
                document.getElementById(modIndex).children[3].appendChild(this.noteLabels[i]);
            }else
            {
                document.getElementById(modIndex).children[2].appendChild(this.lights[i]);
                document.getElementById(modIndex).children[2].appendChild(this.controllers[i].element);
                document.getElementById(modIndex).children[2].appendChild(this.noteLabels[i]);
            }
            
        }

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "sequence")};

        this.buttons.push(document.createElement("div"));

        this.buttons[0].innerHTML = "PROGRAM";
        this.buttons[0].classList.add("button");
        this.buttons[0].onclick = function(){Modules[modIndex].program = true};
        
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        document.getElementById(modIndex).children[5].appendChild(this.inputs[0]);
        document.getElementById(modIndex).children[3].appendChild(this.buttons[0]);
    }
}

class SequencerModule16
{
    constructor()
    {      
        this.name = "Seq-16";
        this.lights = [];
        this.lightIndex = 0;
        this.controllers = [];
        this.noteLabels = [];
        this.outputs =[];
        this.inputs = [];
        this.stepIndex = 0;//Current step in the sequence
        this.sequence = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Array of frequencies(notes)
        this.module = new Tone.LFO(0.1); //Use lfo to change osc frequency
        this.createUI();
    }
    connect(module, type)
    {
        //What this module is being connected to
        switch(type){
            case "frequency":
                this.module = module.module;
                break;
            default:
                break;
        }   
    }
    stepSequence()
    {
        //Step through sequence
        this.stepIndex++;
        if(this.stepIndex == this.sequence.length){
            //Restart the sequence;
            this.stepIndex = 0;
        }
        this.module.frequency.value = this.sequence[this.stepIndex];

        if(this.stepIndex == 0)
            this.lights[this.lights.length-1].id = "on";
        else
            this.lights[this.stepIndex-1].id = "on";
        this.lights[this.stepIndex].id = "off";
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


        this.sequence[cIndex] = Tone.Frequency(this.controllers[cIndex].value, "midi");
        this.noteLabels[cIndex].innerHTML = this.sequence[cIndex].toNote();

        //Handle controller
        switch(cIndex){
            case 0:
                
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"'>"+
                      "<div class='name'>SEQ-16</div>"+
                      "<div class='section'>Notes</div>"+
                      "<div style='width:610px; height: 35px'></div>"+
                      "<div class='section'>Clock In</div>"+
                      "<div></div>"+
                      "<div class='section'>Freq Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);       
        
        for(let i = 0; i < this.sequence.length; i++){
            var l = document.createElement("div");
            var kLabel = document.createElement("div");
            l.classList.add("light");
            kLabel.id="knobLabel";
            
            l.style.float="left";
            kLabel.style.float="left";

            this.controllers.push(new Controller(48, 60, 1, "knob", 48, modIndex, i));
            this.controllers[i].element.style.float = "left";
            this.lights.push(l);
            this.noteLabels.push(kLabel);

            document.getElementById(modIndex).children[2].appendChild(this.lights[i]);
            document.getElementById(modIndex).children[2].appendChild(this.controllers[i].element);
            document.getElementById(modIndex).children[2].appendChild(this.noteLabels[i]);
        }

        this.outputs.push(document.createElement("div"));
        this.outputs[0].innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        this.outputs[0].classList.add("output");
        this.outputs[0].onclick = function(){Connect(mod, this)};

        this.inputs.push(document.createElement("div"));
        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "sequence")};

        
        document.getElementById(modIndex).appendChild(this.outputs[0]);
        document.getElementById(modIndex).children[4].appendChild(this.inputs[0]);
    }
}