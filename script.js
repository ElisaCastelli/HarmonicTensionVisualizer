// import tone
// import * as Tone from 'tone'

import {type , allNotes1D , chordBuilder} from './chordBuilder.js';    // non riesco a farlo funzionare

// MODEL
let numOctaves = 3;
let numOctavesMin = 2;
let numOctaveMax = 4;
let maxColumns = 20;
let MIN_value = 2;
let MAX_value = 7;

// creazione synthetizer
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
    "volume": -8,
}).toMaster();

let Columnplayed = maxColumns - 1;
let timeInterval = 0;

// array completo
let numcell = numOctaves * 12 * maxColumns;
let pianoRoll = nota(numcell);
let matrice = Array();
let modelButton = false;

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



/*const type = [{
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
        name: "Diminished7",
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
    {
        name: "Dim",
        shape: [3, 6]
    }
]*/

// const allNotes1D = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


// Import



// costruttore nota
function nota(ottava, nome, colonna, riga, id) {
    this.ottava = ottava;
    this.nome = nome;
    this.colonna = colonna;
    this.riga = riga;
    this.id = id;
    let selezionato = false; // booleano per definire se è selezionato o meno (nota attiva o disattiva)
    let selezionabile = false;
    //let id = this.riga + this.colonna; // concatenare indice riga e indice colonna
    let root = false;
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
    this.isSelezionabile = function() {
        return this.selezionabile;
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
            numeroOttava = indiceRiga - numeroNota;
            numeroOttava = numeroOttava / 12;
            let tmpNota = new nota(numeroOttava,key_color[numeroNota].pitch,  indiceColonna, indiceRiga,String(indice));
            /*tmpNota.riga = indiceRiga;
            tmpNota.colonna = indiceColonna;
            nome = key_color[numeroNota].pitch;

            tmpNota.ottava = numeroOttava;*/
            //tmpNota.id = String(indice);
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

function removeAllColor(numColumn) {
    columnCell = matrice.filter(x => x.getColonna() == numColumn);
    for (index = 0; index < columnCell.length; index++) {
        idCell = columnCell[index].getId();
        cell = document.getElementById(idCell);
        cell.classList.remove("red_background");
        cell.classList.remove("light_background");
    }
}

function removeLightColor(numColumn) {
    columnCell = matrice.filter(x => x.getColonna() == numColumn);
    for (index = 0; index < columnCell.length; index++) {
        idCell = columnCell[index].getId();
        cell = document.getElementById(idCell);
        cell.classList.remove("light_background");
    }
}

function printSelectable(noteArray, columnNumber) {
    for (index = 1; index < noteArray.length; index++) {
        notesToPrint = matrice.filter(x => (x.getNota() == noteArray[index] && x.getColonna() == columnNumber));
        for (i = 0 ; i < notesToPrint.length ; i++) {
            idCell = notesToPrint[i].getId();
            cell = document.getElementById(idCell);
            indexCell = matrice.findIndex(x => x.getId() == idCell);
            matrice[indexCell].selezionabile = true;
            cell.classList.remove("disabled");
            cell.classList.add("light_background");
        }
    }
}

/*function chordBuilder(noteNumber, shape) {
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
}*/

function chordTypeSelected(columnNumber, chordType) {
    noteSelected = matrice.find(x => (x.getColonna() == columnNumber && x.isSelezionato() == true && x.isRoot() == true));
    if (noteSelected != null) {
        noteName = noteSelected.getNota();
        noteNumber = allNotes1D.indexOf(noteName);
        octaveNoteSelected = noteSelected.getOttava();
        shape = type[type.findIndex(x => x.name == chordType)].shape;
        noteArray = chordBuilder(noteNumber, shape);
        printSelectable(noteArray, columnNumber);
    }
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


function addNote(cell, idCell, columnNumber) {
    columnNumber = 19 - columnNumber;
    matrixIndex = numOctaves * 12 * maxColumns - idCell;
    findRoot = matrice.find(x => (x.getColonna() == columnNumber && x.isSelezionato() == true && x.isRoot() == true));
    noteSelezionabili = matrice.filter(x => (x.getColonna() == columnNumber && x.isSelezionabile() == true));

    // selecting the first note ( the root of the chord)
    if (findRoot == undefined) {
        addRoot(cell, matrixIndex)
    }

    // removing the root
    else if (findRoot.getId() == idCell) {
        removeRoot(matrixIndex)
    }

    // adding or removing chord tones
    for (i=0 ; i<noteSelezionabili.length ; i++) {
        if (noteSelezionabili[i].getId() == idCell ) {
            addTone(cell , columnNumber , matrixIndex);
        }
    }

}

function addRoot(cell, matrixIndex) {
    cell.classList.toggle("red_background");
    // manca di segnare nella matrice che la casella è "piena"
    matrice[matrixIndex].selezionato = true;
    matrice[matrixIndex].root = true;
    unclickableColumn(matrice[matrixIndex].getColonna());
}

function removeRoot (matrixIndex) {
    for (i=0 ; i<matrice.length ; i++) {
        matrice[i].selezionato = false;
        matrice[i].selezionabile = false;
    }
    matrice[matrixIndex].root = false;
    clickableColumn(matrice[matrixIndex].getColonna());
    removeAllColor(matrice[matrixIndex].getColonna());
    // risetta l'header a "chord type"
    // ...
}

function addTone(cell , columnNumber , matrixIndex) {
    if (matrice[matrixIndex].selezionato == true){
        matrice[matrixIndex].selezionato = false;
    } else {
        matrice[matrixIndex].selezionato = true;
    }
    cell.classList.toggle("disabled");
    cell.classList.toggle("red_background");

    sameNote = matrice.filter(x => (x.getColonna() == columnNumber && x.getNota() == matrice[matrixIndex].getNota()));
    for (i=0 ; i< sameNote.length ; i++) {
        sameNoteid = sameNote[i].getId();
        sameNoteCell = document.getElementById(sameNoteid);
        sameNoteCell.classList.toggle("disabled");
        sameNoteCell.classList.toggle("light_background");
    }
}

// VIEW

function createFixedColumn(scaleNumber, noteNumber){
  const fixedColumn = document.createElement("th");
  fixedColumn.classList.add("leftstop");
  color = key_color[noteNumber].color;
  fixedColumn.classList.add(color);
  label = key_color[noteNumber].pitch+" "+scaleNumber;
  divLabel = document.createElement("div");
  var t = document.createTextNode(label);
  divLabel.appendChild(t);
  divLabel.classList.add("label");
  fixedColumn.append(divLabel);
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
        button.onclick = function() { addNote(cell, idCell, columnNumber); };
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
            option1.text = "Major";
            option1.setAttribute("value", "");
            const option2 = document.createElement("option");
            option2.text = "Minor";
            option2.setAttribute("value", "Min");
            const option3 = document.createElement("option");
            option3.text = "Diminished";
            option3.setAttribute("value", "Dim");
            const option4 = document.createElement("option");
            option4.text = "Maj7";
            option4.setAttribute("value", "Maj7");
            const option5 = document.createElement("option");
            option5.text = "Min7";
            option5.setAttribute("value", "Min7");
            const option6 = document.createElement("option");
            option6.text = "7";
            option6.setAttribute("value", "7");
            const option7 = document.createElement("option");
            option7.text = "Half Diminished";
            option7.setAttribute("value", "Half Diminished");
            const option8 = document.createElement("option");
            option8.text = "Diminished 7";
            option8.setAttribute("value", "Diminished7");

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
                if(chordType!="default"){
                  chordTypeSelected(columnNumber, chordType);
                }
            }, false);
            cell.appendChild(select);

        } /*else {
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
        }*/
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
    bar.style.left='93px';
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
          //playButton.classList.add("clickedBarButton");
            modelButton = true;
            play();
            scrollInterval = setInterval(playAndScroll, 25);
            stopButton.onclick = function() {
                modelButton = false;
                //playButton.classList.remove("clickedBarButton");
                //stopButton.classList.add("clickedBarButton");
                clearInterval(scrollInterval);
            }
        };
    }
    rewindButton.onclick = function() {
        tableBackscroll();
        bar.style.left='93px';
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
  timeInterval +=25;
  if(timeInterval%2350 == 0){
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
        console.log(vettoreNote);
        sampler.triggerAttackRelease(["C2", "A2", "G2"], 2);
    }
    vettoreNote = [];
    Columnplayed--;
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
        "volume": -8,
    }).toMaster();
}

function noncliccabile() {
    matrice.forEach(element => {
        idCell = element.getId();
        cell = document.getElementById(idCell);
        cell.classList.add("disabled");
    });
}
