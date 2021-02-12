import { type, allNotes1D, chordBuilder } from './chordBuilder.js';
import { printSelectable } from '../script.js';

let matrixTable = new Array();;

// costruttore Note
function Note(octave, name, column, row, id) {
    this.octave = octave;
    this.name = name;
    this.column = column;
    this.row = row;
    this.id = id;
    let selected = false;
    let selectable = false;
    let root = false;
}

/** Function to create for the first time matrixTable */
export function matrixConstructor(cellsNumber, maxColumns, numOctaves, numOctavesMin, key_color) {
    let octaveNumber = 0;
    let noteNumber = 0;
    let index = cellsNumber;
    for (let columnIndex = maxColumns - 1; columnIndex >= 0; columnIndex--) {
        for (let rowIndex = (numOctaves * 12) - 1; rowIndex >= 0; rowIndex--) {
            noteNumber = rowIndex % 12;
            octaveNumber = rowIndex - noteNumber;
            octaveNumber = octaveNumber / 12 + numOctavesMin;
            let tmpNota = new Note(octaveNumber, key_color[noteNumber].pitch, columnIndex, rowIndex, String(index));
            index--;
            tmpNota.selectable = false;
            tmpNota.selected = false;
            matrixTable.push(tmpNota);
        }
    }
    return matrixTable;
}

export function getMatrix() {
    return matrixTable;
}

export function getIdCell(index) {
    return matrixTable[index].id;
}

export function getCellColumnByIndex(indexCell) {
    return matrixTable[indexCell].column;
}

export function getIndexSelectedCell(note, columnIndex) {
    return matrixTable.findIndex(x => x.name == note && x.column == columnIndex && x.selected == true);
}

export function emptyCell(index) {
    if (matrixTable[index].selected == true) {
        matrixTable[index].selected = false;
    }
    if (matrixTable[index].root) {
        matrixTable[index].root = false;
    }
    if (matrixTable[index].selectable) {
        matrixTable[index].selectable = false;
    }
}

export function findUnselectedCell(numCol) {
    return matrixTable.filter(x => (x.column == numCol && x.selected == false));
}

export function findCellsByColumn(numCol) {
    return matrixTable.filter(x => x.column == numCol);
}

export function getIndexCellById(id) {
    return matrixTable.findIndex(x => (x.id == id));
}

export function setSelectableCell(indexCell) {
    matrixTable[indexCell].selectable = true;
}

export function unselectCell(indexCell) {
    if (matrixTable[indexCell].selected) {
        matrixTable[indexCell].selected = false;
    }
    if (matrixTable[indexCell].root) {
        matrixTable[indexCell].root = false;
    }
}

export function getSelectedByColumn(columNumber) {
    return matrixTable.filter(x => (x.column == columNumber && x.selected == true));
}

export function getSelectedByColumnExceptRoot(columNumber) {
    return matrixTable.filter(x => (x.column == columNumber && x.selected == true && x.root != true));
}

export function getSelectedAndSelectable(columNumber) {
    return matrixTable.filter(x => (x.column == columNumber && (x.selected == true || x.selectable == true)));
}

export function getAllSelectedId() {
    let selectedId = [];
    matrixTable.forEach(element => {
        if (element.selected) {
            selectedId.push(element.id);
        }
    });
    return selectedId;
}

export function getSelectableByColumn(columnNumber) {
    return matrixTable.filter(x => (x.column == columnNumber && x.selectable == true));
}

export function checkSelectableByColumn(columnNumber) {
    return matrixTable.find(x => (x.column == columnNumber && x.selectable == true));
}

export function getCellsToMakeSelectable(columNumber, idRoot) {
    return matrixTable.filter(x => x.column == columNumber && x.selected == true && x.id != idRoot);
}


export function changeSelection(cellIndex) {
    if (matrixTable[cellIndex].selected == true) {
        matrixTable[cellIndex].selected = false;
    } else {
        matrixTable[cellIndex].selected = true;
    }
}

export function findSameNotes(columnNumber, cellIndex) {
    return matrixTable.filter(x => (x.column == columnNumber && x.name == matrixTable[cellIndex].name));
}


export function findRootNoteByColumn(columnNumber) {
    return matrixTable.find(x => (x.column == columnNumber && x.selected == true && x.root == true));
}

export function addRootCell(cellIndex) {
    matrixTable[cellIndex].selected = true;
    matrixTable[cellIndex].root = true;
}

export function findNoteByNameAndColumn(name, columnNumber) {
    return matrixTable.filter(x => (x.name == name && x.column == columnNumber));
}

export function findNoteByMatrixIndex(matrixIndex) {
    return matrixTable[matrixIndex]
}

/** Function to convert finalProgression into a String in order to write it on a text file */
function finalProgressionToString(finalProgression, maxColumns) {
    let text = "";
    for (let index = 0; index < maxColumns; index++) {
        if (typeof finalProgression[index] != 'undefined') {
            text += finalProgression[index] + " ";
        }
    }
    return text;
}

/** Function to convert matrixTable into a String in order to write it on a text file */
export function matrixToString(finalProgression, maxColumns, cellsNumber) {
    let text = "";
    for (let index = 0; index < cellsNumber; index++) {
        if (matrixTable[index].selected == true) {
            text += 1 + " ";
        } else {
            text += 0 + " ";
        }
    }
    text += "\n";
    text += finalProgressionToString(finalProgression, maxColumns);
    return text;
}


/* Function to check if matrixTable is still empty*/
export function emptyMatrix() {
    let filledCells = matrixTable.filter(x => x.selected == true);
    if (filledCells.length == 0) {
        return true;
    } else {
        return false;
    }
}

/** Function to fill matrixTable with the content of a file */
export function fillMatrix(matrixRead) {
    let indexMainMatrix = 0;
    for (let index = 0; index < matrixRead.length; index++) {
        if (index % 2 == 0) {
            if (matrixRead[index] == 1) {
                matrixTable[indexMainMatrix].selected = true;
            }
            indexMainMatrix++;
        }
    }
    return matrixTable;
}

export function rootAfterChordType(matrixIndex, columnNumber) {
    let noteSelected = matrixTable[matrixIndex];
    if (noteSelected != null) {
        let noteName = noteSelected.name;
        let noteNumber = allNotes1D.indexOf(noteName);
        let select = document.getElementById("select" + columnNumber);
        let chordType = select.value;
        let shape = type[type.findIndex(x => x.name == chordType)].shape;
        let noteArray = chordBuilder(noteNumber, shape);
        printSelectable(noteArray, columnNumber);
    }
}

export function printChord(noteArray, octaveNoteSelected, columnNumber) {
    for (let index = 0; index < noteArray.length; index++) {
        if (index > 0) {
            if (allNotes1D.indexOf(noteArray[index]) < allNotes1D.indexOf(noteArray[index - 1] && octaveNoteSelected < 4)) {
                octaveNoteSelected += 1
            }
        }
        let noteToPrint = matrixTable.find(x => (x.name == noteArray[index] && x.octave == octaveNoteSelected && x.column == columnNumber + 1));
        let idCell = noteToPrint.id;
        let cell = document.getElementById(idCell);
        let indexCell = matrixTable.findIndex(x => x.id == idCell);
        matrixTable[indexCell].selected = true;
        matrixTable[indexCell].selectable = false;
        cell.classList.add("selected_background");
        cell.classList.remove('disabled');
    }
}