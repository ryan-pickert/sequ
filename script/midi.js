var midi;

function MIDIInit()
{
    //Get MIDI access
    if(navigator.requestMIDIAccess){
        navigator.requestMIDIAccess().then(MIDIGet, MIDIReject);
    }else{
        alert("No MIDI support");
    }
}

function MIDIGet(m)
{
    console.log("Initializing midi...");

    midi = m;
    var inputs = midi.inputs.values();

    //Listen of all midi input and send it to a function
    for(var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = MIDIHandler;
        haveMidi = true;
    }
   
    
    if(!haveMidi){
        console.log("No midi devices found :(");
    }
}
function MIDIReject(err)
{
    alert("MIDI failed to start");
}

function MIDIHandler(event)
{
    // Mask off the lower nibble (MIDI channel, which we don't care about)
    switch (event.data[0] & 0xf0) {
    case 0x90:
        if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
            noteOn(event.data[1], event.data[2]);
            console.log("testing");
            return;
        }
        // if velocity == 0, fall thru: it's a note-off.
    case 0x80:
        noteOff(event.data[1]);
        return;
    }
}

function noteOn(note, vel)
{
}
function noteOff(note)
{
    
}

function sendNote(note)
{
    var nOn = [0x90, note, 0x7f]; //Note on message
    var nOff = [0x80, note, 0x40]; //Note off message

    var port = midi.outputs.values().next().value.id;
    var output = midi.outputs.get(port);
    output.send(nOn);
    output.send(nOff);

    console.log("sending midi output");
}