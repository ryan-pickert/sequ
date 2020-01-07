class SequencerModule8
{
    constructor()
    {      
        this.name = "Seq-8";
        this.lights = [];
        this.controllers = [];
        this.noteLabels = [];
        this.stepIndex = -1;//Current step in the sequence
        this.sequence = [0,0,0,0,0,0,0,0]; //Array of frequencies(notes)
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
    stepSequence()
    {
        //Step through sequence
        this.stepIndex++;
        if(this.stepIndex == this.sequence.length){
            //Restart the sequence;
            this.stepIndex = 0;
        }
        console.log(this.stepIndex);
        this.module.frequency.value = this.sequence[this.stepIndex];

        
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
        var secName = document.createElement("div");
        var sec1 = document.createElement("div");
        var sec2 = document.createElement("div");
        var label1 = document.createElement("span");
        var label2 = document.createElement("span");
        var label3 = document.createElement("span");
        var label4 = document.createElement("span");
        var label5 = document.createElement("span");
        var label6 = document.createElement("span");
        var label7 = document.createElement("span");
        var label8 = document.createElement("span");
        var knob1 = document.createElement("div");
        var knob2 = document.createElement("div");
        var knob3 = document.createElement("div");
        var knob4 = document.createElement("div");
        var knob5 = document.createElement("div");
        var knob6 = document.createElement("div");
        var knob7 = document.createElement("div");
        var knob8 = document.createElement("div");
        //var secWave = document.createElement("div");
        var out1 = document.createElement("div");
        var out2 = document.createElement("div");
        var in1 = document.createElement("div");
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
        sec1.innerHTML = "Notes";
        sec1.classList.add("section");

        mod.appendChild(light1);
        light1.classList.add("light");
        this.lights.push(light1);
        
        mod.appendChild(knob1);
        knob1.innerHTML="|";
        knob1.classList.add("knob");
        knob1.id = "frequency";
        knob1.onmousedown = function(){TurnKnob(this, event, 0)};
        knob1.onscroll = function(){ScrollKnob(this, event, 0)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob1.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label1);
        label1.id="knobLabel";
        label1.innerHTML = "";
        this.noteLabels.push(label1);
        

        mod.appendChild(knob2);
        knob2.innerHTML="|";
        knob2.classList.add("knob");
        knob2.id = "frequency";
        knob2.onmousedown = function(){TurnKnob(this, event, 1)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob2.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label2);
        label2.id="knobLabel";
        label2.innerHTML = "";
        this.noteLabels.push(label2);

        mod.appendChild(knob3);
        knob3.innerHTML="|";
        knob3.classList.add("knob");
        knob3.id = "frequency";
        knob3.onmousedown = function(){TurnKnob(this, event, 2)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob3.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label3);
        label3.id="knobLabel";
        label3.innerHTML = "";
        this.noteLabels.push(label3);

        mod.appendChild(knob4);
        knob4.innerHTML="|";
        knob4.classList.add("knob");
        knob4.id = "frequency";
        knob4.onmousedown = function(){TurnKnob(this, event, 3)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob4.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label4);
        label4.id="knobLabel";
        label4.innerHTML = "";
        this.noteLabels.push(label4);

        mod.appendChild(knob5);
        knob5.innerHTML="|";
        knob5.classList.add("knob");
        knob5.id = "frequency";
        knob5.onmousedown = function(){TurnKnob(this, event, 4)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob5.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label5);
        label5.id="knobLabel";
        label5.innerHTML = "";
        this.noteLabels.push(label5);

        mod.appendChild(knob6);
        knob6.innerHTML="|";
        knob6.classList.add("knob");
        knob6.id = "frequency";
        knob6.onmousedown = function(){TurnKnob(this, event, 5)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob6.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label6);
        label6.id="knobLabel";
        label6.innerHTML = "";
        this.noteLabels.push(label6);

        mod.appendChild(knob7);
        knob7.innerHTML="|";
        knob7.classList.add("knob");
        knob7.id = "frequency";
        knob7.onmousedown = function(){TurnKnob(this, event, 6)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob7.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label7);
        label7.id="knobLabel";
        label7.innerHTML = "";
        this.noteLabels.push(label7);

        mod.appendChild(knob8);
        knob8.innerHTML="|";
        knob8.classList.add("knob");
        knob8.id = "frequency";
        knob8.onmousedown = function(){TurnKnob(this, event, 7)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob8.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label8);
        label8.id="knobLabel";
        label8.innerHTML = "";
        this.noteLabels.push(label8);

        mod.appendChild(sec2);
        sec2.innerHTML = "Input/Output";
        sec2.classList.add("section");

        mod.appendChild(out1);
        out1.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out1.classList.add("output");
        out1.onclick = function(){Connect(this)};

        mod.appendChild(in1);
        in1.innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        in1.classList.add("input");
        in1.id="sequence";
        in1.onclick = function(){Connect(this)};
        
        


        document.getElementById("wrapper").appendChild(mod);
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
        console.log(this.stepIndex);
        this.module.frequency.value = this.sequence[this.stepIndex];

        this.noteLabels[this.stepIndex].innerHTML = this.sequence[this.stepIndex].toNote();
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
        //Handle controller
        switch(cIndex){
            case 0:
                
                break;
        }
    }
    createUI()
    {
        var mod = document.createElement("div");
        var secName = document.createElement("div");
        var sec1 = document.createElement("div");
        var label1 = document.createElement("span");
        var label2 = document.createElement("span");
        var label3 = document.createElement("span");
        var label4 = document.createElement("span");
        var label5 = document.createElement("span");
        var label6 = document.createElement("span");
        var label7 = document.createElement("span");
        var label8 = document.createElement("span");
        var label9 = document.createElement("span");
        var label10 = document.createElement("span");
        var label11 = document.createElement("span");
        var label12 = document.createElement("span");
        var label13 = document.createElement("span");
        var label14 = document.createElement("span");
        var label15 = document.createElement("span");
        var label16 = document.createElement("span");
        var knob1 = document.createElement("div");
        var knob2 = document.createElement("div");
        var knob3 = document.createElement("div");
        var knob4 = document.createElement("div");
        var knob5 = document.createElement("div");
        var knob6 = document.createElement("div");
        var knob7 = document.createElement("div");
        var knob8 = document.createElement("div");
        var knob9 = document.createElement("div");
        var knob10 = document.createElement("div");
        var knob11 = document.createElement("div");
        var knob12 = document.createElement("div");
        var knob13 = document.createElement("div");
        var knob14 = document.createElement("div");
        var knob15 = document.createElement("div");
        var knob16 = document.createElement("div");
        //var secWave = document.createElement("div");
        var out1 = document.createElement("div");
        var out2 = document.createElement("div");
        var in1 = document.createElement("div");
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
        
        mod.appendChild(knob1);
        knob1.innerHTML="|";
        knob1.classList.add("knob");
        knob1.id = "frequency";
        knob1.onmousedown = function(){TurnKnob(this, event, 0)};
        knob1.onscroll = function(){ScrollKnob(this, event, 0)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob1.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label1);
        label1.id="knobLabel";
        label1.innerHTML = "";
        this.noteLabels.push(label1);
        

        mod.appendChild(knob2);
        knob2.innerHTML="|";
        knob2.classList.add("knob");
        knob2.id = "frequency";
        knob2.onmousedown = function(){TurnKnob(this, event, 1)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob2.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label2);
        label2.id="knobLabel";
        label2.innerHTML = "";
        this.noteLabels.push(label2);

        mod.appendChild(knob3);
        knob3.innerHTML="|";
        knob3.classList.add("knob");
        knob3.id = "frequency";
        knob3.onmousedown = function(){TurnKnob(this, event, 2)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob3.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label3);
        label3.id="knobLabel";
        label3.innerHTML = "";
        this.noteLabels.push(label3);

        mod.appendChild(knob4);
        knob4.innerHTML="|";
        knob4.classList.add("knob");
        knob4.id = "frequency";
        knob4.onmousedown = function(){TurnKnob(this, event, 3)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob4.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label4);
        label4.id="knobLabel";
        label4.innerHTML = "";
        this.noteLabels.push(label4);

        mod.appendChild(knob5);
        knob5.innerHTML="|";
        knob5.classList.add("knob");
        knob5.id = "frequency";
        knob5.onmousedown = function(){TurnKnob(this, event, 4)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob5.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label5);
        label5.id="knobLabel";
        label5.innerHTML = "";
        this.noteLabels.push(label5);

        mod.appendChild(knob6);
        knob6.innerHTML="|";
        knob6.classList.add("knob");
        knob6.id = "frequency";
        knob6.onmousedown = function(){TurnKnob(this, event, 5)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob6.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label6);
        label6.id="knobLabel";
        label6.innerHTML = "";
        this.noteLabels.push(label6);

        mod.appendChild(knob7);
        knob7.innerHTML="|";
        knob7.classList.add("knob");
        knob7.id = "frequency";
        knob7.onmousedown = function(){TurnKnob(this, event, 6)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob7.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label7);
        label7.id="knobLabel";
        label7.innerHTML = "";
        this.noteLabels.push(label7);

        mod.appendChild(knob8);
        knob8.innerHTML="|";
        knob8.classList.add("knob");
        knob8.id = "frequency";
        knob8.onmousedown = function(){TurnKnob(this, event, 7)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob8.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label8);
        label8.id="knobLabel";
        label8.innerHTML = "";
        this.noteLabels.push(label8);

        mod.appendChild(knob9);
        knob9.innerHTML="|";
        knob9.classList.add("knob");
        knob9.id = "frequency";
        knob9.onmousedown = function(){TurnKnob(this, event, 8)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob9.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label9);
        label9.id="knobLabel";
        label9.innerHTML = "";
        this.noteLabels.push(label9);

        mod.appendChild(knob10);
        knob10.innerHTML="|";
        knob10.classList.add("knob");
        knob10.id = "frequency";
        knob10.onmousedown = function(){TurnKnob(this, event, 9)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob10.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label10);
        label10.id="knobLabel";
        label10.innerHTML = "";
        this.noteLabels.push(label10);

        mod.appendChild(knob11);
        knob11.innerHTML="|";
        knob11.classList.add("knob");
        knob11.id = "frequency";
        knob11.onmousedown = function(){TurnKnob(this, event, 10)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob11.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label11);
        label11.id="knobLabel";
        label11.innerHTML = "";
        this.noteLabels.push(label11);

        mod.appendChild(knob12);
        knob12.innerHTML="|";
        knob12.classList.add("knob");
        knob12.id = "frequency";
        knob12.onmousedown = function(){TurnKnob(this, event, 11)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob12.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label12);
        label12.id="knobLabel";
        label12.innerHTML = "";
        this.noteLabels.push(label12);

        mod.appendChild(knob13);
        knob13.innerHTML="|";
        knob13.classList.add("knob");
        knob13.id = "frequency";
        knob13.onmousedown = function(){TurnKnob(this, event, 12)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob13.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label13);
        label13.id="knobLabel";
        label13.innerHTML = "";
        this.noteLabels.push(label13);

        mod.appendChild(knob14);
        knob14.innerHTML="|";
        knob14.classList.add("knob");
        knob14.id = "frequency";
        knob14.onmousedown = function(){TurnKnob(this, event, 13)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob14.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label14);
        label14.id="knobLabel";
        label14.innerHTML = "";
        this.noteLabels.push(label14);

        mod.appendChild(knob15);
        knob15.innerHTML="|";
        knob15.classList.add("knob");
        knob15.id = "frequency";
        knob15.onmousedown = function(){TurnKnob(this, event, 14)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob15.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label15);
        label15.id="knobLabel";
        label15.innerHTML = "";
        this.noteLabels.push(label15);

        mod.appendChild(knob16);
        knob16.innerHTML="|";
        knob16.classList.add("knob");
        knob16.id = "frequency";
        knob16.onmousedown = function(){TurnKnob(this, event, 15)};
        //Create controller and set knob rotation
        this.controllers.push(new Controller(48, 60, 1));
        this.controllers[this.controllers.length-1].value = 50;
        var minmax = this.controllers[this.controllers.length-1].max - this.controllers[this.controllers.length-1].min;
        var rotation = this.controllers[this.controllers.length-1].value / minmax;
        knob16.style.transform = "rotate("+((rotation*240)-130) + "deg)";
        mod.appendChild(label16);
        label16.id="knobLabel";
        label16.innerHTML = "";
        this.noteLabels.push(label16);

        mod.appendChild(out1);
        out1.innerHTML = "<div id='inner'></div><div id='label'>Out</div>";
        out1.classList.add("output");
        out1.onclick = function(){Connect(this)};

        mod.appendChild(in1);
        in1.innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        in1.classList.add("input");
        in1.id="sequence";
        in1.onclick = function(){Connect(this)};
        
        


        document.getElementById("wrapper").appendChild(mod);
    }
}