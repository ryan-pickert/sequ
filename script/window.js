//Visual controller for a node's parameter
class Parameter
{
    constructor(name, node, input, output, min, max)
    {
        this.node = node; //The actual Tone node (i.e. Tone.Oscillator)
        this.name = name; //Display name of the parameter
        this.value = 1; //Display value
        this.displayUnit; //The value's units (i.e. hz, dB, etc.)
        this.min = min; //Max value for the parameter
        this.max = max; //Min value for the parameter
        
        //Create window label
        this.element = document.createElement("div"); //HTML element
        this.element.classList.add("parameter_label");
        this.element.appendChild(document.createElement("span"));

        //Create Inputs/Outputs
        switch(input)
        {
            case "lfo":
                this.input = document.createElement("div");
                this.input.id = input;
                this.input.classList.add("parameter_input");
                break;
            case "signal":
                this.input = document.createElement("div");
                this.input.id = input;
                this.input.classList.add("parameter_input");
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
        
        //Set starting value and display units
        switch(this.name)
        {
            case "Frequency":
                this.displayUnit = "hz";
                this.value = this.node.frequency.value;
                break;
            case "Partials":
                this.displayUnit = "";
                this.value = this.node.partialCount;
                break;
            case "Signal":
                this.displayUnit = "dB";
                this.value = Math.round(this.node.volume.value);
                break;
            case "Wave":
                this.displayUnit = " Sine";
                this.value = 1;
                break;
            default:
                //No parameter
                this.displayUnit = "";
                this.value = 1;
                break;
        }

        //Create slider
        this.slider = document.createElement("input");
        this.slider.type = "range";
        this.slider.min = this.min;
        this.slider.max = this.max;
        this.slider.value = this.value;
        this.slider.classList.add("parameter_slider");
        var self = this;
        this.slider.oninput = function(){self.slide(this)};
        
        //Update label
        this.element.children[0].innerHTML = this.name + " [" + this.value + this.displayUnit + "]";
    }
    updateControlValue(value)
    {
        //Set the node's parameter based on the name
        //There is probably a better way to do this...
        switch(this.name)
        {
            case "Frequency":
                this.node.frequency.value = value;
                this.value = this.node.frequency.value;
                break;
            case "Partials":
                this.node.partialCount = value;
                this.value = this.node.partialCount;
                break;
            case "Signal":
                this.node.volume.value = value;
                this.value = Math.round(this.node.volume.value);
                break;
            case "Wave":
                if(value == 1){
                    this.node.type = "sine";
                    this.displayUnit = " Sine";
                }
                if(value == 2){
                    this.node.type = "triangle";
                    this.displayUnit = " Tri";
                }
                if(value == 3){
                    this.node.type = "sawtooth";
                    this.displayUnit = " Saw";
                }
                
                this.value = value;
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