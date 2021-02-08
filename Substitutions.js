import { Chord, ChordPlus } from './harmonicAnalysis.js';
import { allNotes1D } from './chordBuilder.js';

// permette di ritrovare l'accordo originale della sostituzione di dominante diminuita

export function diminishedDomSub(Chord) {
    let tonic = allNotes1D[ (12 + (allNotes1D.indexOf(Chord.note) - 4)) % 12 ];
    let subChord = new Chord(tonic, '7');
    return subChord
}

// permette di trovare la sostituzione di tritono

export function tritoneSub(Chord) {
    let note = allNotes1D[ (allNotes1D.indexOf(Chord.note) + 6) % 12 ];
    let subChord = new Chord(note, '7');
    return subChord
}