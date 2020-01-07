class Controller
{
    constructor(min, max, increment)
    {
        this.min = min; //Min value
        this.max = max; //Max value
        this.increment = increment; //How much to change the value when increasing/decreasing
        this.value = 0; //Value of the controller
    }
    increase()
    {
        this.value += this.increment;
    }
    decrease()
    {
        this.value -= this.increment;
    }
}