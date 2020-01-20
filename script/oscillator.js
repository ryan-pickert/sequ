class BasicOscillator extends Window
{
    constructor()
    {
        super("Basic Oscillator");
        this.node = new Tone.Oscillator(440, "sine").start();
        this.parameters.push(new Parameter("Wave", this.node, "none", "none", 1, 3));
        this.parameters.push(new Parameter("Frequency", this.node, "lfo", "none", 10, 2000));
        this.parameters.push(new Parameter("Partials", this.node, "none", "none", 0, 12));
        this.parameters.push(new Parameter("Signal", this.node, "none", "signal", -70, 5));

        this.parameters[3].updateControlValue(-24);
        this.create();
    }
}

class LFO extends Window
{
    constructor()
    {
        super("LFO");
        this.node = new Tone.LFO("4n", 1, 400).start();
        this.parameters.push(new Parameter("Wave", this.node, "none", "none", 1, 3));
        this.parameters.push(new Parameter("Frequency", this.node, "none", "none", 10, 2000));
        this.parameters.push(new Parameter("LFO", this.node, "none", "lfo", 1, 1));

        this.create();
    }
}