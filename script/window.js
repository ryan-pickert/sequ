//Used for connecting nodes
var paramOut, paramIn;
class Line
{
    constructor()
    {
        this.startElement;
        this.endElement;
        this.outNode;
        this.inNode;
        this.path = document.createElementNS('http://www.w3.org/2000/svg', "path");
        document.getElementById("draw").append(this.path);

        var self = this;
        this.path.onclick = function(){
            //Disconnect
            if(self.inNode.frequency != undefined){
                self.outNode.disconnect(self.inNode.frequency);
            }
            self.outNode.disconnect(self.inNode);
            self.path.remove();
        };
    }
    draw()
    {
        var sX = 23 + this.startElement.getBoundingClientRect().left - document.body.getBoundingClientRect().left;
        var sY = 5 + this.startElement.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        var eX = 5 + this.endElement.getBoundingClientRect().left - document.body.getBoundingClientRect().left;
        var eY = 5 + this.endElement.getBoundingClientRect().top - document.body.getBoundingClientRect().top;

        this.path.setAttribute("d", "M " + sX + " " + sY + " L " + eX + " " + eY);
    }
}

//Visual controller for a node's parameter
class Parameter
{
    constructor(name, node, input, output, min, max, step, value)
    {
        this.node = node; //The actual Tone node (i.e. Tone.Oscillator)
        this.name = name; //Display name of the parameter
        this.value = 1; //Display value
        this.displayUnit; //The value's units (i.e. hz, dB, etc.)
        this.min = min; //Max value for the parameter
        this.max = max; //Min value for the parameter
        this.step = step; //What value to increment by
        this.displayUnit = "";
        //Create window label
        this.element = document.createElement("div"); //HTML element
        this.element.classList.add("parameter_label");
        this.element.appendChild(document.createElement("span"));

        //Create Inputs/Outputs
        //We handle how outputs are connected here
        switch(input)
        {
            case "lfo":
                this.input = document.createElement("div");
                this.input.id = input;
                this.input.classList.add("parameter_input");

                var self = this;
                this.input.onclick = function(){
                    if(paramOut != undefined){
                        paramOut.connect(self.node.frequency); 
                        paramIn = self.node;
                        DrawConnection(this);
                    }
                };
                break;
            case "signal":
                this.input = document.createElement("div");
                this.input.id = input;
                this.input.classList.add("parameter_input");

                var self = this;
                this.input.onclick = function(){
                    if(paramOut != undefined){
                        paramOut.connect(self.node); 
                        paramIn = self.node;
                        DrawConnection(this);
                    }
                };
                break;
            case "trigger":
                this.input = document.createElement("div");
                this.input.id = input;
                this.input.classList.add("parameter_input");
                break;
        }

        switch(output)
        {
            case "lfo":
                this.output = document.createElement("div");
                this.output.id = output;
                this.output.classList.add("parameter_output");
                
                break;
            case "signal":
                this.output = document.createElement("div");
                this.output.id = output;
                this.output.classList.add("parameter_output");
                break;
            case "trigger":
                this.output = document.createElement("div");
                this.output.id = output;
                this.output.classList.add("parameter_output");
                break;
        }

        //Start a connection when an ouput is clicked
        if(this.output != undefined){
            var self = this;
            this.output.onclick = function(){paramOut = self.node; DrawConnection(this)};
        }
        
        //Create slider
        this.slider = document.createElement("input");
        this.slider.type = "range";
        this.slider.min = this.min;
        this.slider.max = this.max;
        this.slider.value = this.value;
        this.slider.step = this.step;
        this.slider.classList.add("parameter_slider");

        var self = this;
        this.slider.oninput = function(){self.slide(this)};
        
        //Update label
        this.updateControlValue(value);
    }
    updateControlValue(value)
    {
        //Set the node's parameter based on the name
        //There is probably a better way to do this...
        switch(this.name)
        {
            case "Frequency":
                this.displayUnit = "hz";
                this.node.frequency.value = value;
                this.value = this.node.frequency.value;
                break;
            case "Range":
                this.displayUnit = "hz";
                this.node.max = value;
                this.value = this.node.max;
                break;
            case "Partials":
                this.node.partialCount = value;
                this.value = this.node.partialCount;
                break;
            case "Signal":
                this.displayUnit = "dB";
                this.node.volume.value = value;
                this.value = Math.round(this.node.volume.value);
                break;
            case "Wave":
                if(value == 1){
                    this.node.type = "sine";
                    this.displayUnit = " Sine";
                }
                else if(value == 2){
                    this.node.type = "triangle";
                    this.displayUnit = " Tri";
                }
                else if(value == 3){
                    this.node.type = "sawtooth";
                    this.displayUnit = " Saw";
                }
                
                this.value = value;
                break;
            case "Attack":
                this.displayUnit = " sec";
                this.node.attack = value
                this.value = this.node.attack;
                break;
            case "Decay":
                this.displayUnit = " sec";
                this.node.decay = value
                this.value = this.node.decay;
                break;
            case "Sustain":
                this.displayUnit = " %";
                this.node.sustain = value
                this.value = Math.round(this.node.sustain * 100);
                break;
            case "Release":
                this.displayUnit = " sec";
                this.node.release = value
                this.value = this.node.release;
                break;
            default:
                //No parameter
                this.displayUnit = "";
                this.value = 1;
                break;
        }

        this.slider.value = value;
        this.element.children[0].innerHTML = this.name + " [" +this.value + this.displayUnit + "]";
    }
    slide(t)
    {
        //Handle slider controller
        this.updateControlValue(t.value);
    }
}

//Visual representation of a Tone node and it's parameters
class Window
{
    constructor(title)
    {
        this.title = title; //Title of the window
        this.parameters = []; //Array of the node's parameters
        this.node; //Tone node
    }
    create()
    {
        //Create window element
        var win = document.createElement("div");
        win.classList.add("window");
        //Add the element to the grid
        document.getElementById("grid").appendChild(win);

        //Create window title bar
        var winTitle = document.createElement("div");
        winTitle.classList.add("window_title");
        winTitle.innerHTML = this.title;
        winTitle.onmousedown = function(){Move(event, this)};
        win.appendChild(winTitle);

        //Container for parameters
        var winParams = document.createElement("div");
        win.appendChild(winParams);
        //Create controllers for parameters
        for(let i = 0; i < this.parameters.length; i++){
            if(this.parameters[i] != undefined){
                //Add controller
                var paramLabel = this.parameters[i].element;
                var paramSlider = this.parameters[i].slider;

                //Add inputs/outputs
                if(this.parameters[i].input != undefined){
                    this.parameters[i].input.innerHTML = ">>";
                    paramLabel.appendChild(this.parameters[i].input);
                }
                if(this.parameters[i].output != undefined){
                    this.parameters[i].output.innerHTML = ">>";
                    paramLabel.appendChild(this.parameters[i].output);
                }

                winParams.appendChild(paramLabel);
                winParams.appendChild(paramSlider);
            }
        }
    }
}