import { Chord, ChordPlus } from './harmonicAnalysis.js';
import { allNotes1D } from './chordBuilder.js';

// permette di ritrovare l'accordo originale della sostituzione di dominante diminuita

export function diminishedDomSub(chord) {
    let tonic = allNotes1D[ (12 + (allNotes1D.indexOf(chord.note) - 4)) % 12 ];
    let subChord = new Chord(tonic, '7');
    //console.log(subChord, " substituted with ", chord);
    return subChord;
}

// permette di trovare la sostituzione di tritono

export function tritoneSub(chord) {
    let tonic = allNotes1D[ (allNotes1D.indexOf(chord.note) + 6) % 12 ];
    let subChord = new Chord(tonic, '7');
    //console.log(subChord, " substituted with ", chord);
    return subChord
}

