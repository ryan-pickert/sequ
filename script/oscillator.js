class BasicOscillator extends Window
{
    constructor()
    {
        //Initialize
        super("Basic Oscillator");

        //Create Tone node
        this.node = new Tone.Oscillator(440, "sine").start();
        this.node.sync();

        //Create parameters
        this.parameters.push(new Parameter("Wave", this.node, "none", "none", 1, 3, 1, 1));
        this.parameters.push(new Parameter("Frequency", this.node, "lfo", "none", 10, 2000, 1, 440));
        this.parameters.push(new Parameter("Partials", this.node, "none", "none", 0, 12, 1, 0));
        this.parameters.push(new Parameter("Signal", this.node, "none", "signal", -70, 5, 1, -24));

        //Create window
        this.create();
    }
}

class LFO extends Window
{
    constructor()
    {
        //Initialize
        super("LFO");

        //Create Tone node
        this.node = new Tone.LFO("4n", 1, 400).start();
        this.node.sync();
        this.node.min = 1;
        
        //Create parameters
        this.parameters.push(new Parameter("Wave", this.node, "none", "none", 1, 3, 1, 1));
        this.parameters.push(new Parameter("Frequency", this.node, "none", "none", 1, 12, 1, 1));
        this.parameters.push(new Parameter("Range", this.node, "none", "none", 1, 500, 1, 1));
        this.parameters.push(new Parameter("LFO", this.node, "none", "lfo", 1, 1, 1, 1));

        //Create window
        this.create();
    }
}