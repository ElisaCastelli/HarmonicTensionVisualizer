// IMPORT

import { type, allNotes1D, chordBuilder } from './chordBuilder.js';
import { tensionChange, start } from './tensionAnimation.js';
import { evaluateTension, Chord } from './harmonicAnalysis.js';
import { downloadFile } from './readFile.js';

const fileInput = document.getElementById('file-input');

// MODEL
let numOctaves = 3;
let numOctavesMin = 2;
let maxColumns = 20;
let cellsNumber = numOctaves * 12 * maxColumns;
let columnPlayed = maxColumns - 1;
let timeInterval = 0;
let matrixTable = new Array();
let finalProgression = new Array(maxColumns);
let analysisResults = new Array();
let modelButton = false;
let firstPlay = true;

// creazione synthetizer
let muted = false;
let minVolume = -8;
let MaxVolume = -4;
let Volume = (MaxVolume + minVolume) / 2;

let sampler = new Tone.Sampler({
    "C2": "./piano/C2.mp3",
    "C#2": "./piano/Cs2.mp3",
    "D2": "./piano/D2.mp3",
    "D#2": "./piano/Ds2.mp3",
    "E2": "./piano/E2.mp3",
    "F2": "./piano/F2.mp3",
    "F#2": "./piano/Fs2.mp3",
    "G2": "./piano/G2.mp3",
    "G#2": "./piano/Gs2.mp3",
    "A2": "./piano/A2.mp3",
    "A#2": "./piano/As2.mp3",
    "B2": "./piano/B2.mp3",
    "C3": "./piano/C3.mp3",
    "C#3": "./piano/Cs3.mp3",
    "D3": "./piano/D3.mp3",
    "D#3": "./piano/Ds3.mp3",
    "E3": "./piano/E3.mp3",
    "F3": "./piano/F3.mp3",
    "F#3": "./piano/Fs3.mp3",
    "G3": "./piano/G3.mp3",
    "G#3": "./piano/Gs3.mp3",
    "A3": "./piano/A3.mp3",
    "A#3": "./piano/As3.mp3",
    "B3": "./piano/B3.mp3",
    "C4": "./piano/C4.mp3",
    "C#4": "./piano/Cs4.mp3",
    "D4": "./piano/D4.mp3",
    "D#4": "./piano/Ds4.mp3",
    "E4": "./piano/E4.mp3",
    "F4": "./piano/F4.mp3",
    "F#4": "./piano/Fs4.mp3",
    "G4": "./piano/G4.mp3",
    "G#4": "./piano/Gs4.mp3",
    "A4": "./piano/A4.mp3",
    "A#4": "./piano/As4.mp3",
    "B4": "./piano/B4.mp3",
}).set({
    "volume": Volume,
}).toMaster();

const key_color = [{
        pitch: "C",
        color: "white",
    },
    {
        pitch: "C#",
        color: "black"
    },
    {
        pitch: "D",
        color: "white"
    },
    {
        pitch: "D#",
        color: "black"
    },
    {
        pitch: "E",
        color: "white"
    },
    {
        pitch: "F",
        color: "white"
    },
    {
        pitch: "F#",
        color: "black"
    },
    {
        pitch: "G",
        color: "white"
    },
    {
        pitch: "G#",
        color: "black",
    },
    {
        pitch: "A",
        color: "white"
    },
    {
        pitch: "A#",
        color: "black"
    },
    {
        pitch: "B",
        color: "white"
    }
];

// costruttore Note
function Note(octave, name, column, row, id) {
    this.octave = octave;
    this.name = name;
    this.column = column;
    this.row = row;
    this.id = id;
    let selected = false; // booleano per definire se è selected o meno (Note attiva o disattiva)
    let selectable = false;
    let root = false;
}

function finalProgressionToString() {
    let text = "";
    for (let index = 0; index < maxColumns; index++) {
        if (typeof finalProgression[index] != 'undefined') {
            text += finalProgression[index] + " ";
        }
    }
    return text;
}

function matrixToString() {
    let text = "";
    for (let index = 0; index < cellsNumber; index++) {
        if (matrixTable[index].selected == true) {
            text += 1 + " ";
        } else {
            text += 0 + " ";
        }
    }
    text += "\n";
    text += finalProgressionToString();
    return text;
}

function matrixConstructor() {
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
}

function emptyMatrix(){
    let filledCells = matrixTable.filter(x => x.selected == true);
    if(filledCells.length==0){
        return true;
    }else{
        return false;
    }
}

function fillMatrix(matrixRead) {
    let maxColumnIndex = finalProgression.findIndex(x => typeof x == 'undefined');
    unselectMatrix(maxColumnIndex);
    let indexMainMatrix = 0;
    for (let index = 0; index < matrixRead.length; index++) {
        if (index % 2 == 0) {
            if (matrixRead[index] == 1) {
                matrixTable[indexMainMatrix].selected = true;
            }
            indexMainMatrix++;
        }
    }
    printMatrix();
}

function printMatrix() {
    matrixTable.forEach(element => {
        if (element.selected) {
            let idCell = element.id;
            let cell = document.getElementById(idCell);
            cell.classList.add("selected_background");
        }
    });
}

function unselectMatrix(lastColumn) {
    let index = 0;
    if (lastColumn >= 0) {
        for (let indexColumn = maxColumns - 1; indexColumn >= lastColumn; indexColumn--) {
            for (let indexRow = (numOctaves * 12) - 1; indexRow >= 0; indexRow--) {
                if (matrixTable[index].selected == true) {
                    matrixTable[index].selected = false;
                }
                if (matrixTable[index].root) {
                    matrixTable[index].root = false;
                }
                if (matrixTable[index].selectable) {
                    matrixTable[index].selectable = false;
                }
                let idCell = matrixTable[index].id;
                let cell = document.getElementById(idCell);
                cell.classList.remove("disabled");
                cell.classList.remove("selected_background");
                cell.classList.remove("light_background");
                index++;
            }
            resetSelect(indexColumn);
        }
    } else {
        // se sono selezionate note singole
    }
}

function unclickableColumn(numCol) {
    let columnCell = matrixTable.filter(x => (x.column == numCol && x.selected == false));
    for (let index = 0; index < columnCell.length; index++) {
        let idCell = columnCell[index].id;
        let cell = document.getElementById(idCell);
        cell.classList.add("disabled");
    }
}

function clickableColumn(numCol) {
    let columnCell = matrixTable.filter(x => x.column == numCol);
    for (let index = 0; index < columnCell.length; index++) {
        let idCell = columnCell[index].id;
        let cell = document.getElementById(idCell);
        cell.classList.remove("disabled");
        let indexMatrix = matrixTable.findIndex(x => (x.id == columnCell[index].id));
        if (matrixTable[indexMatrix].selected) {
            matrixTable[indexMatrix].selected = false;
        }
        if (matrixTable[indexMatrix].root) {
            matrixTable[indexMatrix].root = false;
        }
    }
}

function removeAllColor(numColumn) {
    let columnCell = matrixTable.filter(x => x.column == numColumn);
    for (let index = 0; index < columnCell.length; index++) {
        let idCell = columnCell[index].id;
        let cell = document.getElementById(idCell);
        cell.classList.remove("selected_background");
        cell.classList.remove("light_background");
    }
}

function removeLightColor(numColumn) {
    let columnCell = matrixTable.filter(x => x.column == numColumn);
    for (let index = 0; index < columnCell.length; index++) {
        let idCell = columnCell[index].id;
        let cell = document.getElementById(idCell);
        cell.classList.remove("light_background");
    }
}

function printSelectable(noteArray, columnNumber) {
    for (let index = 1; index < noteArray.length; index++) {
        let notesToPrint = matrixTable.filter(x => (x.name == noteArray[index] && x.column == columnNumber));
        for (let i = 0; i < notesToPrint.length; i++) {
            let idCell = notesToPrint[i].id;
            let cell = document.getElementById(idCell);
            let indexCell = matrixTable.findIndex(x => x.id == idCell);
            matrixTable[indexCell].selectable = true;
            cell.classList.remove("disabled");
            cell.classList.add("light_background");
        }
    }
}

function chordTypeSelected(columnNumber, chordType) {
    let noteSelected = matrixTable.find(x => (x.column == columnNumber && x.selected == true && x.root == true));
    if (noteSelected != null) {
        let noteName = noteSelected.name;
        let noteNumber = allNotes1D.indexOf(noteName);
        let octaveNoteSelected = noteSelected.ottava;
        let shape = type[type.findIndex(x => x.name == chordType)].shape;
        let noteArray = chordBuilder(noteNumber, shape);
        printSelectable(noteArray, columnNumber);
        let chord = new Chord(noteName, chordType);
        finalProgression[Math.abs(maxColumns - columnNumber - 1)] = chord;
        // console.log(finalProgression); // da togliere
    }
}

function fillFinalProgression(progressionRead) {
    finalProgression = new Array(maxColumns);
    progressionRead = progressionRead.substring(1, progressionRead.length);
    let indexSpace = 0;
    let indexProgression = 0;
    while (progressionRead != "") {
        indexSpace = progressionRead.indexOf(" ");
        let chordString = progressionRead.substring(0, indexSpace);
        let chord = new Chord();
        let type = "";
        let note = chordString[0];
        let secondChar = chordString[1];
        if (secondChar == "#") {
            note = note + secondChar;
        }
        type = chordString.substring(note.length, chordString.length);
        chord.note = note;
        chord.type = type;
        finalProgression[indexProgression] = chord;
        progressionRead = progressionRead.slice(indexSpace + 1, progressionRead.length);
        indexProgression++;
    }
    console.log(finalProgression);
}

function selectRoot() {
    let maxColumnIndex = finalProgression.findIndex(x => typeof x == 'undefined');
    for (let index = 0; index < maxColumnIndex; index++) {
        let chord = finalProgression[index];
        let note = chord.note;
        let type = chord.type;
        let indexMatrix = matrixTable.findIndex(x => x.name == note && x.column == (maxColumns - 1 - index) && x.selected == true);
        if (indexMatrix != null) {
            matrixTable[indexMatrix].root = true;
            let col = matrixTable[indexMatrix].column;
            let select = document.getElementById("select" + col);
            select.value = type;
        }
    }
}

// CONTROLLER
function tableBackscroll(position) {
    const table = document.getElementById("table-scroll");
    table.scrollLeft = position;
}

function scroll() {
    const bar = document.getElementById("scrollingBar");
    const pianoContainer = document.getElementById("output_block");
    const tableScroll = document.getElementById("table-scroll");
    let speed = 1;
    let direction = 1;
    let barLeftPos = bar.offsetLeft,
        barRightPos = barLeftPos + bar.offsetWidth;
    let containerWidth = pianoContainer.offsetWidth;
    if (barRightPos < containerWidth / 2) {
        bar.style.left = (barLeftPos + speed * direction) + 'px';
    } else if (tableScroll.scrollWidth - tableScroll.scrollLeft > containerWidth) {
        tableScroll.scrollLeft += 1;
    } else if (barRightPos < tableScroll.offsetWidth) {
        bar.style.left = (barLeftPos + speed * direction) + 'px';
    }
}

function addTone(cell, columnNumber, matrixIndex) {
    if (matrixTable[matrixIndex].selected == true) {
        matrixTable[matrixIndex].selected = false;
    } else {
        matrixTable[matrixIndex].selected = true;
    }
    cell.classList.toggle("disabled");
    cell.classList.toggle("selected_background");

    let sameNote = matrixTable.filter(x => (x.column == columnNumber && x.name == matrixTable[matrixIndex].name));
    for (let i = 0; i < sameNote.length; i++) {
        let sameNoteid = sameNote[i].id;
        let sameNoteCell = document.getElementById(sameNoteid);
        sameNoteCell.classList.toggle("disabled");
        sameNoteCell.classList.toggle("light_background");
    }
}

function addNote(cell, idCell, columnNumber) {
    columnNumber = 19 - columnNumber;
    let matrixIndex = numOctaves * 12 * maxColumns - idCell;
    let findRoot = matrixTable.find(x => (x.column == columnNumber && x.selected == true && x.root == true));
    let selectableNotes = matrixTable.filter(x => (x.column == columnNumber && x.selectable == true));

    // selecting the first note ( the root of the chord)
    if (findRoot == undefined) {
        addRoot(cell, matrixIndex);
    }

    // removing the root
    else if (findRoot.id == idCell) {
        removeAll(columnNumber);
    }

    // adding or removing chord tones
    for (let i = 0; i < selectableNotes.length; i++) {
        if (selectableNotes[i].id == idCell) {
            addTone(cell, columnNumber, matrixIndex);
        }
    }

}

function addRoot(cell, matrixIndex) {
    cell.classList.toggle("selected_background");
    // manca di segnare nella matrice che la casella è "piena"
    matrixTable[matrixIndex].selected = true;
    matrixTable[matrixIndex].root = true;
    unclickableColumn(matrixTable[matrixIndex].column);
}

function removeAll(columnNumber) {
    for (let i = 0; i < matrixTable.length; i++) {
        matrixTable[i].selected = false;
        matrixTable[i].selectable = false;
        matrixTable[i].root = false;
    }
    clickableColumn(columnNumber);
    removeAllColor(columnNumber);
    resetSelect(columnNumber);
}

function resetSelect(columnNumber) {
    let select = document.getElementById("select" + columnNumber);
    select.value = "default";
}

function playAndScroll() {
    scroll();
    if (timeInterval % 2700 == 0) {
        if ((maxColumns - columnPlayed - 1) < finalProgression.length) {
            play();
            tensionChange(analysisResults[Math.abs(columnPlayed + 2 - maxColumns)].tension);
        }
    }
    timeInterval += 25;
}

function play() {
    let noteSelected = new Array();
    let notesArray = new Array();
    noteSelected = matrixTable.filter(x => (x.column == columnPlayed && x.selected == true));
    if (noteSelected != null) {
        for (let index = 0; index < noteSelected.length; index++) {
            let noteName = noteSelected[index].name;
            let octave = noteSelected[index].ottava;
            notesArray.push(noteName + octave);
        }
        console.log(notesArray);
        if (notesArray.length == 3) {
            sampler.triggerAttackRelease([notesArray[0], notesArray[1], notesArray[2]], 2);
        } else if (notesArray.length == 4) {
            sampler.triggerAttackRelease([notesArray[0], notesArray[1], notesArray[2], notesArray[3]], 2);
        }
    }
    notesArray = [];
    columnPlayed--;
    sampler = new Tone.Sampler({
        "C2": "./piano/C2.mp3",
        "C#2": "./piano/Cs2.mp3",
        "D2": "./piano/D2.mp3",
        "D#2": "./piano/Ds2.mp3",
        "E2": "./piano/E2.mp3",
        "F2": "./piano/F2.mp3",
        "F#2": "./piano/Fs2.mp3",
        "G2": "./piano/G2.mp3",
        "G#2": "./piano/Gs2.mp3",
        "A2": "./piano/A2.mp3",
        "A#2": "./piano/As2.mp3",
        "B2": "./piano/B2.mp3",
        "C3": "./piano/C3.mp3",
        "C#3": "./piano/Cs3.mp3",
        "D3": "./piano/D3.mp3",
        "D#3": "./piano/Ds3.mp3",
        "E3": "./piano/E3.mp3",
        "F3": "./piano/F3.mp3",
        "F#3": "./piano/Fs3.mp3",
        "G3": "./piano/G3.mp3",
        "G#3": "./piano/Gs3.mp3",
        "A3": "./piano/A3.mp3",
        "A#3": "./piano/As3.mp3",
        "B3": "./piano/B3.mp3",
        "C4": "./piano/C4.mp3",
        "C#4": "./piano/Cs4.mp3",
        "D4": "./piano/D4.mp3",
        "D#4": "./piano/Ds4.mp3",
        "E4": "./piano/E4.mp3",
        "F4": "./piano/F4.mp3",
        "F#4": "./piano/Fs4.mp3",
        "G4": "./piano/G4.mp3",
        "G#4": "./piano/Gs4.mp3",
        "A4": "./piano/A4.mp3",
        "A#4": "./piano/As4.mp3",
        "B4": "./piano/B4.mp3",
    }).set({
        "volume": Volume,
    }).toMaster();
}

// VIEW


function createFixedColumn(scaleNumber, noteNumber) {
    const fixedColumn = document.createElement("th");
    fixedColumn.classList.add("leftstop");
    let color = key_color[noteNumber].color;
    fixedColumn.classList.add(color);
    let label = key_color[noteNumber].pitch + " " + scaleNumber;
    let divLabel = document.createElement("div");
    var t = document.createTextNode(label);
    divLabel.appendChild(t);
    divLabel.classList.add("label");
    fixedColumn.append(divLabel);
    return fixedColumn;
}

function createRow(scaleNumber, noteNumber) {
    const row = document.createElement("tr");
    let rowNumber = numOctaves * 12 - ((scaleNumber - numOctavesMin) * 12 + noteNumber) - 1;
    // per ogni riga aggiungo la prima colonna che rimarrà fissa e poi tutte le altre
    let fixedColumn = createFixedColumn(scaleNumber, noteNumber);
    row.appendChild(fixedColumn);
    for (let columnNumber = 0; columnNumber < maxColumns; columnNumber++) {
        const cell = document.createElement("td");
        cell.classList.add("white");
        const button = document.createElement("button");
        button.classList.add("cellButton");
        let idCell = cellsNumber - rowNumber - (columnNumber * numOctaves * 12);
        button.onclick = function() { addNote(cell, idCell, columnNumber); };
        cell.appendChild(button);
        cell.setAttribute("id", idCell);
        row.appendChild(cell);
        // alternanza sfondi per righe piano roll (nero e bianco)
        if (noteNumber == 1 || noteNumber == 3 || noteNumber == 6 || noteNumber == 8 || noteNumber == 10) {
            cell.classList.add('dark_background');
        } else {
            cell.classList.add('white_background');
        }
    }
    return row;
}

function createHeader() {
    const table_head = document.createElement("thead");
    const row = document.createElement("tr");
    for (let columnNumber = maxColumns; columnNumber >= 0; columnNumber--) {
        const cell = document.createElement("th");
        cell.className = "topstop";
        // creazione prima riga di chord type
        if (columnNumber != maxColumns) {
            const select = document.createElement("select");
            select.setAttribute("id", "select" + columnNumber);
            const option0 = document.createElement("option");
            option0.text = "Chord type";
            option0.setAttribute("value", "default");
            const option1 = document.createElement("option");
            option1.text = "Major";
            option1.setAttribute("value", "");
            const option2 = document.createElement("option");
            option2.text = "Minor";
            option2.setAttribute("value", "min");
            const option3 = document.createElement("option");
            option3.text = "Diminished";
            option3.setAttribute("value", "dim");
            const option4 = document.createElement("option");
            option4.text = "Maj7";
            option4.setAttribute("value", "maj7");
            const option5 = document.createElement("option");
            option5.text = "Min7";
            option5.setAttribute("value", "min7");
            const option6 = document.createElement("option");
            option6.text = "7";
            option6.setAttribute("value", "7");
            const option7 = document.createElement("option");
            option7.text = "Half Diminished";
            option7.setAttribute("value", "halfdim");
            const option8 = document.createElement("option");
            option8.text = "Diminished 7";
            option8.setAttribute("value", "dim7");

            select.appendChild(option0);
            select.appendChild(option1);
            select.appendChild(option2);
            select.appendChild(option3);
            select.appendChild(option4);
            select.appendChild(option5);
            select.appendChild(option6);
            select.appendChild(option7);
            select.addEventListener("change", function(event) {
                let chordType = this.value;
                removeLightColor(columnNumber);
                if (chordType != "default") {
                    chordTypeSelected(columnNumber, chordType);
                }
            }, false);
            cell.appendChild(select);

        }
        row.appendChild(cell);
    }
    table_head.appendChild(row);
    return table_head;
}

function createTable() {
    const main_table = document.createElement("table");
    let table_head = createHeader();
    const table_body = document.createElement("tbody");
    //per ogni nota creo una riga della tabella e la carico nella tabella
    for (let rowNumber = numOctaves * key_color.length - 1; rowNumber >= 0; rowNumber--) {
        let scaleNumber = Math.floor(rowNumber / key_color.length);
        let noteNumber = rowNumber - (key_color.length * scaleNumber);
        scaleNumber = scaleNumber + numOctavesMin;
        let row = createRow(scaleNumber, noteNumber);
        table_body.appendChild(row);
    }
    main_table.appendChild(table_head);
    main_table.appendChild(table_body);
    return main_table;
}

function createPianoRoll() {
    const pianoRollTable = document.createElement("div");
    pianoRollTable.classList.add("table-scroll");
    pianoRollTable.classList.add("mainTable");
    pianoRollTable.setAttribute("id", "table-scroll");
    const table_wrap = document.createElement("div");
    table_wrap.classList.add("table-wrap");
    let main_table = createTable();
    table_wrap.appendChild(main_table);
    pianoRollTable.appendChild(table_wrap);
    return pianoRollTable;
}

function createBar() {
    const bar = document.createElement("div");
    bar.setAttribute("id", "scrollingBar");
    bar.classList.add("scrollingBar");
    return bar;
}


// metodi onclick

title_container.onclick = function() {
    window.location.reload(false);
}

resetNotes.onclick = function() {
    if (!modelButton) {
        let lengthChordArray = 0;
        if (finalProgression.length == maxColumns) {
            lengthChordArray = finalProgression.findIndex(x => typeof x == 'undefined');
        } else {
            lengthChordArray = finalProgression.length;
        }
        unselectMatrix(lengthChordArray);
        modelButton = false;
        timeInterval = 0;
        columnPlayed = maxColumns - 1;
        finalProgression = new Array(20);
        analysisResults = new Array();
        firstPlay = true;
        tensionChange(0);
    }
}

folderIcon.onchange = function() {
    read(fileInput.files[0]);
}

function read(file) {
    let textType = /text.*/;
    let matrixString = "";
    let progressionString = "";
    if (file.type.match(textType)) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            let text = reader.result;
            let lastIndex = text.indexOf("\n");
            matrixString = text.substring(0, lastIndex);
            fillMatrix(matrixString);
            progressionString = text.substring(lastIndex, text.length);
            fillFinalProgression(progressionString);
            selectRoot();
        }
    } else {
        console.log("File not supported!");
    }
    let maxIndex = 0;
    if (finalProgression.length == maxColumns) {
        maxIndex = finalProgression.findIndex(x => typeof x == 'undefined');
    } else {
        maxIndex = finalProgression.length;
    }
    unselectMatrix(maxIndex);
}


downloadButton.onclick = function() {
    if(!emptyMatrix()){
        let fileName = "MyChordProgression";
        let text = matrixToString();
        downloadFile(fileName, text);
    }
}

// cancella tutto il contenuto del piano roll
function refresh() {
    matrixTable = [];
    timeInterval = 0;
    tableBackscroll(0);
    columnPlayed = maxColumns - 1;
    finalProgression = [];
    analysisResults = [];
    bar.style.left = '93px';
    const pianoContainer = document.getElementById("output_block");
    while (pianoContainer.lastChild) {
        pianoContainer.removeChild(pianoContainer.lastChild);
    }
}

function firstRender() {
    start;
    tensionChange(0);
    const pianoContainer = document.getElementById("output_block");
    const playButton = document.getElementById("playButton");
    let pianoRollTable = createPianoRoll();
    pianoContainer.appendChild(pianoRollTable);
    let bar = createBar();
    let lastBarPosition = bar.style.left;
    let lastTableScrollPosition;
    pianoContainer.appendChild(bar);

    let scrollInterval;
    playButton.onclick = function() {
        if (!modelButton && !emptyMatrix()) {
            const tableScroll = document.getElementById("table-scroll");
            modelButton = true;
            //noncliccabile();
            let maxIndex = 0;
            if (firstPlay) {
                lastBarPosition = '93px';
                lastTableScrollPosition = 0;
            }
            tableScroll.style.overflowX='hidden';
            if (finalProgression.length == maxColumns) {
                maxIndex = finalProgression.findIndex(x => typeof x == 'undefined');
            } else {
                maxIndex = finalProgression.length;
            }
            bar.style.left = lastBarPosition;
            tableBackscroll(lastTableScrollPosition);
            //playButton.classList.add("playButtonActive");
            finalProgression = finalProgression.slice(0, maxIndex);
            analysisResults = evaluateTension(finalProgression);
            scrollInterval = setInterval(playAndScroll, 25);
            stopButton.onclick = function() {
                lastBarPosition = bar.style.left;
                lastTableScrollPosition = tableScroll.style.scrollLeft;
                modelButton = false;
                firstPlay = false;
                tableScroll.style.overflowX='auto';
                //playButton.classList.remove("playButtonActive");
                clearInterval(scrollInterval);
                tensionChange(0);
                
            }
        };
    }

    rewindButton.onclick = function() {
        const tableScroll = document.getElementById("table-scroll");
        tableBackscroll(0);
        tableScroll.style.overflowX='auto';
        bar.style.left = '93px';
        modelButton = false;
        columnPlayed = maxColumns - 1;
        timeInterval = 0;
        clearInterval(scrollInterval);
        tensionChange(0);
        firstPlay = true;
    }
        // no parametro perchè sovrascriviamo numOttave, 1 singola variabile globale
    matrixConstructor();
}


firstRender();

function noncliccabile() {
    matrixTable.forEach(element => {
        idCell = element.id;
        cell = document.getElementById(idCell);
        cell.classList.add("disabled");
    });
}

muteButton.onclick = function() {
    muted = !muted;
    Tone.Master.mute = muted;
}

volumeUpButton.onclick = function() {
    if ((Volume + 1) <= MaxVolume)
        Volume++;
    else alert("Max Volume Reached");
}

volumeDownButton.onclick = function() {
    if ((Volume - 1) >= minVolume)
        Volume--;
    else alert("Min Volume Reached");
}