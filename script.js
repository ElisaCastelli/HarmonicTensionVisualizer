// import tone
// import * as Tone from 'tone'

// MODEL
numOctaves = 4;
maxColumns = 20;
MIN_value = 2;
MAX_value = 7;

// creazione synthetizer
let synth = new Tone.PolySynth(2, Tone.Synth).set({
    "detune": 100,
    "oscillator": {},
    "envelope": {
        "attack": 0.010,
        "decay": 0.0,
        "sustain": 0.20,
        "release": 0.5,
    },
    "volume": -8,
    "portamento": 0.005,
}).toMaster();
let synthB = new Tone.PolySynth(2, Tone.Synth).set({
    "volume": -24,
    "detune": 100,
    "oscillator": {
        type: "sine4",
    },
    "envelope": {
        "attack": 0.010,
        "decay": 0.0,
        "sustain": 0.20,
        "release": 0.15,
    },
}).toMaster();
let synthC = new Tone.PolySynth(4, Tone.Synth).set({
    "volume": -7,
    "detune": 0,
    "oscillator": {
        "type": "sine2"
    },
    "envelope": {
        "attack": 0.015,
        "decay": 0.15,
        "sustain": 0.02,
        "release": 0.15,
    },
}).toMaster();
let Columnplayed = maxColumns - 1;
timeInterval = 0;

// array completo
numcell = numOctaves * 12 * maxColumns;
pianoRoll = nota(numcell);
let matrice = Array();
modelButton = false;

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



const type = [{
        name: "Maj7",
        shape: [4, 7, 11]
    },
    {
        name: "Min7",
        shape: [3, 7, 10]
    },
    {
        name: "7",
        shape: [4, 7, 10]
    },
    {
        name: "Half Diminished",
        shape: [3, 6, 10]
    },
    {
        name: "Diminished",
        shape: [3, 6, 9]
    },
    {
        name: "",
        shape: [4, 7]
    },
    {
        name: "Min",
        shape: [3, 7]
    },
]

const allNotes1D = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


// Import

// import {type , allNotes1D , chordBuilder} from './chordBuilder.js';    // non riesco a farlo funzionare

// costruttore nota
function nota() {
    this.ottava = "";
    this.nome = "";
    this.colonna = "";
    this.riga = "";
    this.selezionato = false; // booleano per definire se è selezionato o meno (nota attiva o disattiva)
    this.id = this.riga + this.colonna; // concatenare indice riga e indice colonna
    this.root = false;
    this.getNota = function() { return this.nome; };
    this.getColonna = function() { return this.colonna; };
    this.getRiga = function() { return this.riga };
    this.getOttava = function() { return this.ottava; }
    this.getId = function() {
        return this.id;
    }
    this.isSelezionato = function() {
        return this.selezionato;
    }
    this.isRoot = function() { return this.root; }
    this.getFrequenza = function() {};
}

function generaMatrice() {
    let numeroOttava = 0;
    let numeroNota = 0;
    let indice = numcell;
    for (let indiceColonna = maxColumns - 1; indiceColonna >= 0; indiceColonna--) {
        for (let indiceRiga = (numOctaves * 12) - 1; indiceRiga >= 0; indiceRiga--) {
            numeroNota = indiceRiga % 12;
            let tmpNota = new nota();
            tmpNota.riga = indiceRiga;
            tmpNota.colonna = indiceColonna;
            tmpNota.nome = key_color[numeroNota].pitch;
            numeroOttava = indiceRiga - numeroNota;
            numeroOttava = numeroOttava / 12;
            tmpNota.ottava = numeroOttava;
            tmpNota.id = String(indice);
            indice--;
            tmpNota.selezionabile = false;
            tmpNota.selezionato = false;
            matrice.push(tmpNota);
        }

    }
}

function unselectAllMatrix() {
    for (index = 0; index < matrice.length; index++) {
        if (matrice[index].isSelezionato() == true) {
            matrice[index].selezionato = false;
        }
        if (matrice[index].isRoot()) {
            matrice[index].root = false;
        }
        idCell = matrice[index].getId();
        cell = document.getElementById(idCell);
        cell.classList.remove("disabled");
    }
}

function unclickableColumn(numCol) {
    columnCell = matrice.filter(x => (x.getColonna() == numCol && x.isSelezionato() == false));
    for (index = 0; index < columnCell.length; index++) {
        idCell = columnCell[index].getId();
        cell = document.getElementById(idCell);
        cell.classList.add("disabled");
    }
}

function clickableColumn(numCol) {
    columnCell = matrice.filter(x => x.getColonna() == numCol);
    for (index = 0; index < columnCell.length; index++) {
        idCell = columnCell[index].getId();
        cell = document.getElementById(idCell);
        cell.classList.remove("disabled");
        indexMatrix = matrice.findIndex(x => (x.getId() == columnCell[index].getId()));
        if (matrice[indexMatrix].isSelezionato()) {
            selezionato = false;
        }
        if (matrice[indexMatrix].isRoot()) {
            root = false;
        }
    }
}

function removeColor(numColumn) {
    columnCell = matrice.filter(x => x.getColonna() == numColumn);
    for (index = 0; index < columnCell.length; index++) {
        idCell = columnCell[index].getId();
        cell = document.getElementById(idCell);
        cell.classList.remove("red_background");
    }
}

function printChord(noteArray, octaveNoteSelected, columnNumber) {
    for (index = 0; index < noteArray.length; index++) {
        if (index > 0) {
            if (allNotes1D.indexOf(noteArray[index]) < allNotes1D.indexOf(noteArray[index - 1])) {
                octaveNoteSelected += 1
            }
        }
        noteToPrint = matrice.find(x => (x.getNota() == noteArray[index] && x.getOttava() == octaveNoteSelected && x.getColonna() == columnNumber));
        idCell = noteToPrint.getId();
        cell = document.getElementById(idCell);
        indexCell = matrice.findIndex(x => x.getId() == idCell);
        matrice[indexCell].selezionato = true;
        cell.classList.add("red_background");
    }
}

function chordBuilder(noteNumber, shape) {
    let tonic = noteNumber % 12
    let Chord = [tonic]
    for (i = 0; i < shape.length ; i++) {
        Chord.push((shape[i] + tonic) % 12)
    }
    ChordNotes = []
    for (i = 0; i < Chord.length ; i++) {
        ChordNotes.push(allNotes1D[Chord[i]])
    }
    return ChordNotes
}

function chordTypeSelected(columnNumber, chordType) {
    noteSelected = matrice.filter(x => (x.getColonna() == columnNumber && x.isSelezionato() == true && x.isRoot() == true));
    noteSelected = noteSelected[0];
    if (noteSelected != null) {
        noteName = noteSelected.getNota();
        noteNumber = allNotes1D.indexOf(noteName);
        octaveNoteSelected = noteSelected.getOttava();
        shape = type[type.findIndex(x => x.name == chordType)].shape;
        noteArray = chordBuilder(noteNumber, shape);
        printChord(noteArray, octaveNoteSelected, columnNumber);
    }
    unclickableColumn(columnNumber)
}

// CONTROLLER
function tableBackscroll() {
    const table = document.getElementById("table-scroll");
    table.scrollLeft = 0;
}

function scroll() {
    const bar = document.getElementById("scrollingBar");
    const pianoContainer = document.getElementById("output_block");
    const tableScroll = document.getElementById("table-scroll");
    let speed = 0.6;
    let direction = 1;
    let barLeftPos = bar.offsetLeft,
        barRightPos = barLeftPos + bar.offsetWidth;
    let containerWidth = pianoContainer.offsetWidth;
    if (barRightPos < containerWidth / 2) {
        bar.style.left = (barLeftPos + speed * direction) + 'px';
    }else if (tableScroll.scrollWidth - tableScroll.scrollLeft > containerWidth) {
        tableScroll.scrollLeft +=1;
    } else if (barRightPos < tableScroll.offsetWidth) {
        bar.style.left = (barLeftPos + speed * direction) + 'px';
    }
}


function addNote(cell, idCell) {
    cell.classList.toggle("red_background");
    // manca di segnare nella matrice che la casella è "piena"
    matrixIndex = numOctaves * 12 * maxColumns - idCell;
    if (matrice[matrixIndex].isSelezionato() == false) {
        matrice[matrixIndex].selezionato = true;
        matrice[matrixIndex].root = true;
        //blocca click su tutta la colonna
        unclickableColumn(matrice[matrixIndex].getColonna());
    } else {
        matrice[matrixIndex].selezionato = false;
        matrice[matrixIndex].root = false;
        // rimetti click su tutta la getColonna
        clickableColumn(matrice[matrixIndex].getColonna());
        removeColor(matrice[matrixIndex].getColonna());
        // risetta l'header a "chord type"
        // ...
    }
}

// VIEW

function createFixedColumn(scaleNumber, noteNumber){
  const fixedColumn = document.createElement("th");
  fixedColumn.classList.add("leftstop");
  color = key_color[noteNumber].color;
  fixedColumn.classList.add(color);
  label = key_color[noteNumber].pitch+" "+scaleNumber;
  var t = document.createTextNode(label);
  fixedColumn.append(t);
  return fixedColumn;
}

function createRow(scaleNumber, noteNumber) {
    const row = document.createElement("tr");
    let rowNumber = numOctaves * 12 - (scaleNumber * 12 + noteNumber) - 1;
    // per ogni riga aggiungo la prima colonna che rimarrà fissa e poi tutte le altre
    fixedColumn = createFixedColumn(scaleNumber, noteNumber);
    row.appendChild(fixedColumn);
    for (let columnNumber = 0; columnNumber < maxColumns; columnNumber++) {
        const cell = document.createElement("td");
        cell.classList.add("white");
        const button = document.createElement("button");
        button.classList.add("cellButton");
        let idCell = numcell - rowNumber - (columnNumber * numOctaves * 12);
        button.onclick = function() { addNote(cell, idCell); };
        cell.appendChild(button);
        cell.setAttribute("id", idCell);
        row.appendChild(cell);
        // alternanza sfondi per righe piano roll (nero e bianco)
        if (noteNumber == 1 || noteNumber == 3 || noteNumber == 6 || noteNumber == 8 || noteNumber == 10) {
            cell.classList.add('black_background');
        } else {
            cell.classList.add('white_background');
        }
    }
    return row;
}

function createHeader() {
    const table_head = document.createElement("thead");
    //table_head.classList.add("topstop");
    const row = document.createElement("tr");
    row.classList.add("topstop");
    for (let columnNumber = maxColumns; columnNumber >= 0; columnNumber--) {
        const cell = document.createElement("th");
        // creazione prima riga di chord type
        if (columnNumber != maxColumns) {
            const select = document.createElement("select");
            //select.classList.add("topstop");
            const option0 = document.createElement("option");
            option0.text = "Chord type";
            option0.setAttribute("value", "default");
            const option1 = document.createElement("option");
            option1.text = "Maj7";
            option1.setAttribute("value", "Maj7");
            const option2 = document.createElement("option");
            option2.text = "Min7";
            option2.setAttribute("value", "Min7");
            const option3 = document.createElement("option");
            option3.text = "7";
            option3.setAttribute("value", "7");
            const option4 = document.createElement("option");
            option4.text = "Half Diminished";
            option4.setAttribute("value", "Half Diminished");
            const option5 = document.createElement("option");
            option5.text = "Diminished";
            option5.setAttribute("value", "Diminished");
            select.appendChild(option0);
            select.appendChild(option1);
            select.appendChild(option2);
            select.appendChild(option3);
            select.appendChild(option4);
            select.appendChild(option5);
            select.addEventListener("change", function(event) {
                let chordType = this.value;
                clickableColumn(columnNumber);
                removeColor(columnNumber);
                if(chordType!="default"){
                  chordTypeSelected(columnNumber, chordType);
                }
            }, false);
            cell.appendChild(select);

        } else {
            // inserimento casella scelta numero ottave per piano roll
            const icon = document.createElement("i");
            icon.setAttribute("class", "fas fa-check");
            icon.setAttribute("id", "octaveButton");
            const boxOctave = document.createElement("div");
            boxOctave.setAttribute("id", "BoxOctave");
            const input = document.createElement("input");
            input.setAttribute("id", "valore");
            input.setAttribute("type", "number");
            input.setAttribute("min", "2");
            input.setAttribute("max", "7");
            boxOctave.appendChild(input);
            const sendButton = document.createElement("button");
            sendButton.setAttribute("id", "send");
            sendButton.appendChild(icon);
            sendButton.onclick = changeNumOctave;
            boxOctave.appendChild(sendButton);
            cell.appendChild(boxOctave);
        }
        row.appendChild(cell);
    }
    table_head.appendChild(row);
    return table_head;
}

function createTable() {
    const main_table = document.createElement("table");
  	table_head = createHeader();
  	const table_body =document.createElement("tbody");
    //per ogni nota creo una riga della tabella e la carico nella tabella
    for(let rowNumber = numOctaves * key_color.length - 1; rowNumber >= 0; rowNumber--){
      scaleNumber = Math.floor(rowNumber/key_color.length);
      noteNumber = rowNumber - (key_color.length * scaleNumber);
      row= createRow(scaleNumber, noteNumber);
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
    const table_wrap =document.createElement("div");
    table_wrap.classList.add("table-wrap");
  	main_table = createTable();
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
    const columns = document.getElementsByClassName("white");
    for (let index = 0; index < columns.length; index++) {
        columns[index].classList.remove("red_background");
        unselectAllMatrix();
    }
    modelButton = false;
    timeInterval = 0;
    Columnplayed= maxColumns-1;
}

readme.onclick = function() {
    window.open("readme.html");
}

credits.onclick = function() {
    window.open("credits.html");
}

contact_us.onclick = function() {
    window.open("contact_us.html");
}

//sistemare il messaggio di errore si può togliere
function changeNumOctave() {
    value = Number(document.getElementById("valore").value);
    if (value < MIN_value | value > MAX_value) {

    } else {
        const ErrorMess = document.getElementById("errore");
        if (ErrorMess) {
            ErrorMess.remove();
        }
        numOctaves = value;
        refresh();
        firstRender();
    }
}

// cancella tutto il contenuto del piano roll
function refresh() {
    numcell = numOctaves * 12 * maxColumns;
    matrice = [];
    timeInterval=0;
    tableBackscroll();
    bar.style.left='83px';
    const pianoContainer = document.getElementById("output_block");
    while (pianoContainer.lastChild) {
        pianoContainer.removeChild(pianoContainer.lastChild);
    }
}

function firstRender() {
    const pianoContainer = document.getElementById("output_block");
    pianoRollTable = createPianoRoll();
    pianoContainer.appendChild(pianoRollTable);
    bar = createBar();
    pianoContainer.appendChild(bar);
    var scrollInterval;
    playButton.onclick = function() {
        if (!modelButton) {
          //noncliccabile();
            modelButton = true;
            play();
            scrollInterval = setInterval(playAndScroll, 10);
            stopButton.onclick = function() {
                modelButton = false;
                clearInterval(scrollInterval);
            }
        };
    }
    rewindButton.onclick = function() {
        tableBackscroll();
        bar.style.left='83px';
        modelButton = false;
        Columnplayed = maxColumns-1;
        timeInterval=0;
        clearInterval(scrollInterval);
    }

    // no parametro perchè sovrascriviamo numOttave, 1 singola variabile globale
    generaMatrice();
}


firstRender();

function playAndScroll(){
  timeInterval +=10;
  if(timeInterval%900 == 0){
    play();
  }
  scroll();
}


function play() {
    let noteSelected = new Array();
    let vettoreNote = new Array();
    noteSelected = matrice.filter(x => (x.getColonna() == Columnplayed && x.isSelezionato() == true));
    if (noteSelected != null) {
        for (let index = 0; index < noteSelected.length; index++) {
            let nomeNota = noteSelected[index].getNota();
            let octave = noteSelected[index].getOttava();
            vettoreNote.push(nomeNota + octave);
        }
        synth.triggerAttackRelease(vettoreNote, 2);
        synthB.triggerAttackRelease(vettoreNote, 2);
        //synthC.triggerAttackRelease(vettoreNote, 1);
    }
    vettoreNote = [];
    Columnplayed--;
    synth = new Tone.PolySynth(2, Tone.Synth).set({
        "detune": 100,
        "oscillator": {},
        "envelope": {
            "attack": 0.010,
            "decay": 0.0,
            "sustain": 0.02,
            "release": 0.15,
        },
        "volume": -8,
        "portamento": 0.005,
    }).toMaster();
    synthB = new Tone.PolySynth(2, Tone.Synth).set({
        "volume": -24,
        "detune": 100,
        "oscillator": {
            type: "sine4",
        },
        "envelope": {
            "attack": 0.010,
            "decay": 0.0,
            "sustain": 0.02,
            "release": 0.15,
        },
    }).toMaster();
}

function noncliccabile() {
    matrice.forEach(element => {
        idCell = element.getId();
        cell = document.getElementById(idCell);
        cell.classList.add("disabled");
    });
}
