function diatonicSub(grado) {
    possibleSub = [(7 + (grado - 2)) % 7 , (grado + 2) % 7 ] // risultato tra 0 e 6
    return possibleSub
}

// permette di fare una sostituzione di dominante
function diminishedDomSub(chord) {
    flatNine = (chord[-1] +3) % 12
    chord.push(flatNine);
    chord.splice(0,1);
    return chord
}

// permette di ritrovare l'accordo originale della sostituzione
function reverseDiminishedDomSub(chord) {
    tonic = (12 + (chord[0] - 4)) % 12
    chord.unshift(tonic)
    chord.splice(4,1)
    return chord
}

function tritoneSub(chord) {
    tonic = chord[0]
    subTonic = ( 12 + (tonic - 6)) % 12
    subChord = chordBuilder(subTonic , [4,7,10])
    return subChord
}