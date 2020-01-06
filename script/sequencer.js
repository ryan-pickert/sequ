class Sequencer
{
    constructor(name)
    {
        this.name = name;
        this.notes = [];
        this.measures = 1;
        this.measureNotes = 16;
        this.numNotes = 8;
        this.attachedSynths = [];
        this.self;
    }
    randomize()
    {
        var currentBeat = 0;
        
        if(this.attachedSynths[0].type != "kick"){

            for(let i = 0; i < 8; i++){
                if(currentBeat > Tone.Time('2m')){
                    console.log("finished notes");
                    break;
                }
    
                var note = GetNoteValue(GetRandom(1, 6), GetRandom(3, 5), 1);
                var noteDuration = Tone.Time('16n') * GetRandom(1, 9);
                this.notes.push({time:currentBeat, note:note, dur:noteDuration});
                currentBeat += noteDuration;
                

            }
        }else{
            for(let i = 0; i < 8; i++){
                var note = 'C1';
                var noteDuration = Tone.Time('4n');
                this.notes.push({time:currentBeat, note:'C1', dur:noteDuration});
                currentBeat += noteDuration;
            }
        }
        
    }
    play(time, event)
    {
        
    }
}