class Controller
{
    constructor(min, max, increment, type, value, module, cIndex)
    {
        this.min = min; //Min value
        this.max = max; //Max value
        this.increment = increment; //How much to change the value when increasing/decreasing
        this.value = value; //Value of the controller
        this.parentElement = module;
        this.element;

        switch(type){
            case "knob":
                var self = this;

                this.element = document.createElement("div");
                this.element.innerHTML = "|";
                this.element.classList.add("knob");
                this.element.onmousedown = function(){TurnKnob(self, event, cIndex)};
                break;
            default:
                break;
        }
        
        var minmax = this.max - this.min;
        var rotation = this.value / minmax;
        this.element.style.transform = "rotate("+((rotation*240)-130) + "deg)";
    }
    increase()
    {
        this.value += this.increment;
        var minmax = this.max - this.min;
        var rotation = this.value / minmax;
        this.element.style.transform = "rotate("+((rotation*240)-130) + "deg)";
    }
    decrease()
    {
        this.value -= this.increment;
        var minmax = this.max - this.min;
        var rotation = this.value / minmax;
        this.element.style.transform = "rotate("+((rotation*240)-130) + "deg)";
    }

}


var moving = false;
function TurnKnob(knob, event, cIndex)
{
    if(!moving)
    {
        var modIndex = knob.parentElement;
        var dif = 0; 
        var start = event.clientY;
    }
    
    document.onmousemove = function(e){
        moving = true;
        dif = start-e.clientY;
        knob.element.style.borderColor="#9cd453";
        if(dif > 5){
            //Increase
            Modules[modIndex].control("increase", cIndex);
            
            //Reset
            dif = 0; 
            start = e.clientY;
        }else if(dif < -5)
        {
            //Decrease
            Modules[modIndex].control("decrease", cIndex);
            //Reset
            dif = 0; 
            start = e.clientY;
        }
        
    };
    document.onmouseup = function(e){

        document.onmousemove = null;
        moving = false;
        knob.element.style.borderColor="";
    };
}