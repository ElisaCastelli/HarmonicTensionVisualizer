/*const type = [
    {
        name: "Major7",
        shape:
    }
    {
        name: "Minor7",
        shape:
    }
    {
        name: "7",
        shape:
    }
    {
        name: "Half_Diminished",
        shape:
    }
    {
        name: "Diminished",
        shape:
    }
]
*/

const Maj7 = [4,7,11]
const Min7 = [3,7,10]
const Dom7 = [4,7,10]
const Half_Diminished = [3,6,10]
const Diminished = [3,6,9]

const allnotes = {
	norm: ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"],
	sharp: ["", "C#", "", "D#", "", "", "F#", "", "G#", "", "A#", ""], // Ho corretto flat e sharp
    flat: ["", "Db", "", "Eb", "", "", "Gb", "", "Ab", "", "Bb", ""]
    //octave: [0,1,2,3,4,5]
};

const Allnotes1D = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

function chord_builder (tonic , type){
    let Chord = [tonic%12]
    for (i=0;i<3;i++) {
        Chord.push((type[i] + tonic%12) %12)
    }
    ChordNotes = []
    for (i=0;i<4;i++) {
        ChordNotes.push(Allnotes1D[Chord[i]])
    }
    return Chord , ChordNotes
}

console.log (chord_builder(14,Maj7))
