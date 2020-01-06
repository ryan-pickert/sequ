class Synth
{
    constructor(name, type)
    {
        this.name = name;
        this.type = type;
        //this.vol = new Tone.Volume(-8);
        this.r = new Tone.Reverb(2);
        this.r.generate();

        switch(this.type){
            case "membrane", "kick":
                this.vol = new Tone.Volume(-6);
                this.self = new Tone.MembraneSynth();
                
                break;
            case "pluck":
                this.vol = new Tone.Volume(-8);
                this.self = new Tone.PluckSynth();
                this.self.chain(this.r, this.vol);
                break;
            case "mono":
                this.self = new Tone.MonoSynth();
                this.vol= new Tone.Volume(-28);
                this.self.chain(this.r, this.vol);
                break;
            case "fm":
                this.self = new Tone.FMSynth();
                this.vol= new Tone.Volume(-18);
                this.self.chain(this.r, this.vol);
                break;
            case "duo":
                this.self = new Tone.DuoSynth();
                this.vol= new Tone.Volume(-18);
                this.self.chain(this.r, this.vol);
                break;

            default:
                this.self = new Tone.MembraneSynth();
                break;
        }

        
        this.self.chain(this.vol, Tone.Master);
    }
}