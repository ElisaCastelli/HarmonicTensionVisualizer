const type = [
    {
        name: "Maj7",
        shape: [4,7,11]
    },
    {
        name: "Min7",
        shape: [3,7,10]
    },
    {
        name: "7",
        shape: [4,7,10]
    },
    {
        name: "Half_Diminished",
        shape: [3,6,10]
    },
    {
        name: "Diminished",
        shape: [3,6,9]
    }
]

const allnotes = {
	norm: ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"],
	sharp: ["", "C#", "", "D#", "", "", "F#", "", "G#", "", "A#", ""],
    flat: ["", "Db", "", "Eb", "", "", "Gb", "", "Ab", "", "Bb", ""]
};

const Allnotes1D = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Tonic è l'indice della nota con C0 = 0 , C1 = 12 ...
function chord_builder (tonic , type){
    let Chord = [tonic % 12]
    for (i=0 ; i<3 ; i++) {
        Chord.push((type[i] + tonic % 12) % 12)
    }
    ChordNotes = []
    for (i=0 ; i<4 ; i++) {
        ChordNotes.push(Allnotes1D[Chord[i]])
    }
    return ChordNotes
}

console.log (chord_builder(12,type[1].shape))

