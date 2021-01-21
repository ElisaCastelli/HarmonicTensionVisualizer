// MODEL 
numOctaves = 3;
maxColumns = 30;
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

numcell = numOctaves * maxColumns;
model = Array(numcell).fill(false);
modelButton = false;
half_length = 2;

// CONTROLLER
function tableAutoscroll() {
    const tableScroll = document.getElementById("table-scroll");
    tableScroll.scrollLeft += 1.5;
}

function scroll() {
    const bar = document.getElementById("scrollingBar");
    const pianoContainer = document.getElementById("output_block");
    let speed = 1;
    let direction = 1;
    let barLeftPos = bar.offsetLeft,
        barRightPos = barLeftPos + bar.offsetWidth;
    if (barRightPos < pianoContainer.offsetWidth / half_length) {
        bar.style.left = (barLeftPos + speed * direction) + 'px';
    } else {
        tableAutoscroll();
    }
}

function addNote(column, numCell) {
    column.classList.toggle("red_background");
    // manca di segnare nella matrice che la casella è "piena"
}

// VIEW

function createFixedColumn(scaleNumber, noteNumber) {
    const fixedColumn = document.createElement("th");
    fixedColumn.classList.add("leftstop");
    color = key_color[noteNumber].color;
    fixedColumn.classList.add(color);
    const labelDiv = document.createElement("div");
    labelDiv.classList.add("leftstop");
    label = key_color[noteNumber].pitch + scaleNumber;
    let t = document.createTextNode(label);
    labelDiv.append(t);
    fixedColumn.append(labelDiv);
    return fixedColumn;
}

function createRow(scaleNumber, noteNumber) {
    const row = document.createElement("tr");

    // per ogni riga aggiungo la prima colonna che rimarrà fissa e poi tutte le altre
    fixedColumn = createFixedColumn(scaleNumber, noteNumber);
    row.appendChild(fixedColumn);
    for (let columnNumber = 0; columnNumber < maxColumns; columnNumber++) {
        const column = document.createElement("td");
        column.classList.add("white");
        const button = document.createElement("button");
        button.classList.add("cellButton");
        let numCell = scaleNumber * 12 + noteNumber;
        button.onclick = function() { addNote(column, numCell); };
        column.appendChild(button);
        row.appendChild(column);
        if (noteNumber == 1 || noteNumber == 3 || noteNumber == 6 || noteNumber == 8 || noteNumber == 10) {
            column.classList.add('black_background');
        } else {
            column.classList.add('white_background');
        }
    }
    return row;
}

function createHeader() {
    const table_head = document.createElement("thead");
    const row = document.createElement("tr");
    row.classList.add("topstop");
    for (let columnNumber = 0; columnNumber < maxColumns; columnNumber++) {
        const cell = document.createElement("th");
        row.appendChild(cell);
    }
    table_head.appendChild(row);
    return table_head;
}

function createTable() {
    const main_table = document.createElement("table");
    main_table.setAttribute("id", "table");
    main_table.classList.add("table-wrap");
    table_head = createHeader();
    const table_body = document.createElement("tbody");
    //per ogni nota creo una riga della tabella e la carico nella tabella
    for (let rowNumber = numOctaves * key_color.length - 1; rowNumber >= 0; rowNumber--) {
        scaleNumber = Math.floor(rowNumber / key_color.length);
        noteNumber = rowNumber - (key_color.length * scaleNumber);
        row = createRow(scaleNumber, noteNumber);
        table_body.appendChild(row);
    }
    main_table.appendChild(table_head);
    main_table.appendChild(table_body);
    return main_table;
}

function createPianoRoll() {
    const pianoRollTable = document.createElement("div");
    pianoRollTable.classList.add("table-scroll");
    pianoRollTable.setAttribute("id", "table-scroll");
    main_table = createTable();
    pianoRollTable.appendChild(main_table);
    return pianoRollTable;
}

function createBar() {
    const bar = document.createElement("div");
    bar.setAttribute("id", "scrollingBar");
    bar.classList.add("scrollingBar");
    return bar;
}

function firstRender() {
    const pianoContainer = document.getElementById("output_block");
    pianoRollTable = createPianoRoll();
    pianoContainer.appendChild(pianoRollTable);
    bar = createBar();
    pianoContainer.appendChild(bar);
    playButton.onclick = function() {
        if (!modelButton) {
            modelButton = true;
            var scrollInterval = setInterval(scroll, 10);
            stopButton.onclick = function() {
                modelButton = false;
                clearInterval(scrollInterval);
                rewindButton.onclick = function() {
                    bar.style.left = '103px';
                }
            }
        };
    }



}


firstRender();