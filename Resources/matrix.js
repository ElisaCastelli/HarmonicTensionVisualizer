/** IMPORT */
import { type, allNotes1D, chordBuilder } from './chordBuilder.js';
import { printSelectable } from '../script.js';

/** array that contains the unrolled matrix corresponding to the table */
let matrixTable = new Array();

/** Note used to contain information about a single cell and the note associated with it */
export function Note(octave, name, column, row, id) {
    this.octave = octave;
    this.name = name;
    this.column = column;
    this.row = row;
    this.id = id;
    let selected = false;
    let selectable = false;
    let root = false;
}

/** Function to create for the first time the array matrixTable */
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

/** Function to obtain the id of a cell by the index */
export function getIdCell(index) {
    return matrixTable[index].id;
}

/** Function  to obtain the index of a cell by the id*/
export function getIndexCellById(id) {
    return matrixTable.findIndex(x => (x.id == id));
}

/** Function to obtain the column number of a cell by the index */
export function getCellColumnByIndex(indexCell) {
    return matrixTable[indexCell].column;
}

/** Function to obtain the index of selected cell by note and column number infromation */
export function getIndexSelectedCell(note, columnIndex) {
    return matrixTable.findIndex(x => x.name == note && x.column == columnIndex && x.selected == true);
}

/** Function to clean the content of a Note cell in matrix */
export function unselectCell(index) {
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

/** Function to obtain an array of unselected Note by the column number */
export function findUnselectedCell(numCol) {
    return matrixTable.filter(x => (x.column == numCol && x.selected == false));
}

/** Function to obtain an array of all the Note of a column by the column number */
export function findCellsByColumn(numCol) {
    return matrixTable.filter(x => x.column == numCol);
}

/** Function to change to true the selected field of a Note by its index */
export function setSelectableCell(indexCell) {
    matrixTable[indexCell].selectable = true;
}

/** Function to obtain an array of all the selected cells in the column with number columnNumber */
export function getSelectedByColumn(columNumber) {
    return matrixTable.filter(x => (x.column == columNumber && x.selected == true));
}

/** Function to obtain an array of all the selected cells (except the root one) in the column with number columnNumber */
export function getSelectedByColumnExceptRoot(columNumber) {
    return matrixTable.filter(x => (x.column == columNumber && x.selected == true && x.root != true));
}

/** Function to obtain an array of all the selected and selectable cells in the column with number columnNumber*/
export function getSelectedAndSelectable(columNumber) {
    return matrixTable.filter(x => (x.column == columNumber && (x.selected == true || x.selectable == true)));
}

/** Function to obtain an array with the index of all the cells selected */
export function getAllSelectedId() {
    let selectedId = [];
    matrixTable.forEach(element => {
        if (element.selected) {
            selectedId.push(element.id);
        }
    });
    return selectedId;
}

/** Function to obtain an array of all the selectable cells in the column with number columnNumber */
export function getSelectableByColumn(columnNumber) {
    return matrixTable.filter(x => (x.column == columnNumber && x.selectable == true));
}

/** Function to to check in there's at least one cell selectable in the column with number columnNumber  */
export function checkSelectableByColumn(columnNumber) {
    return matrixTable.find(x => (x.column == columnNumber && x.selectable == true));
}

/** Function to obtain an array of cells that are selected but that are not the root in a specific column */
export function getCellsToMakeSelectable(columNumber, idRoot) {
    return matrixTable.filter(x => x.column == columNumber && x.selected == true && x.id != idRoot);
}

/** Function to change the selected boolean attribute of a cell by index */
export function changeSelection(cellIndex) {
    if (matrixTable[cellIndex].selected == true) {
        matrixTable[cellIndex].selected = false;
    } else {
        matrixTable[cellIndex].selected = true;
    }
}

/** Function to obtain cells in the column with index columnNumber that corresponds to the */
export function findSameNotes(columnNumber, cellIndex) {
    return matrixTable.filter(x => (x.column == columnNumber && x.name == matrixTable[cellIndex].name));
}

/** Function to obtain the Note with the field root true between all the Note elements of a certain column */
export function findRootNoteByColumn(columnNumber) {
    return matrixTable.find(x => (x.column == columnNumber && x.selected == true && x.root == true));
}

/** Function to set true the field root of a certain Note element */
export function addRootCell(cellIndex) {
    matrixTable[cellIndex].selected = true;
    matrixTable[cellIndex].root = true;
}

/** Function to obtain all the Note elements with a certain name in the column of the table with index columnNumber */
export function findNoteByNameAndColumn(name, columnNumber) {
    return matrixTable.filter(x => (x.name == name && x.column == columnNumber));
}

/** Function to obtain a certain Note by itsown index*/
export function findNoteByMatrixIndex(matrixIndex) {
    return matrixTable[matrixIndex];
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


/* Function to check if matrixTable is still empty */
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
        let noteToPrint = matrixTable.find(x => (x.name == noteArray[index] && x.octave == octaveNoteSelected && x.column == columnNumber));
        let idCell = noteToPrint.id;
        let cell = document.getElementById(idCell);
        let indexCell = matrixTable.findIndex(x => x.id == idCell);
        matrixTable[indexCell].selected = true;
        matrixTable[indexCell].selectable = false;
        cell.classList.add("selected_background");
        cell.classList.remove('disabled');
    }
}

/** Function to obtain all the Note of a column with index columnNumber */
export function getColumnNotes(columnNumber) {
    return matrixTable.filter(x => (x.column == columnNumber));
}