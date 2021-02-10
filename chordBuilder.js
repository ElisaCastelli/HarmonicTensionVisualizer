

export const type = [{
    name: "maj7",
    shape: [4, 7, 11]
},
{
    name: "min7",
    shape: [3, 7, 10]
},
{
    name: "7",
    shape: [4, 7, 10]
},
{
    name: "halfdim",
    shape: [3, 6, 10]
},
{
    name: "dim7",
    shape: [3, 6, 9]
},
{
    name: "",
    shape: [4, 7]
},
{
    name: "min",
    shape: [3, 7]
},
{
    name: "dim",
    shape: [3, 6]
}
];

export const allNotes1D = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Tonic è l'indice della nota con C0 = 0 , C1 = 12 ...
export function chordBuilder(noteNumber, shape) {
    let tonic = noteNumber % 12
    let Chord = [tonic]
    for (let i = 0; i < shape.length ; i++) {
        Chord.push((shape[i] + tonic) % 12)
    }
    let ChordNotes = []
    for (let i = 0; i < Chord.length ; i++) {
        ChordNotes.push(allNotes1D[Chord[i]])
    }
    return ChordNotes
}
