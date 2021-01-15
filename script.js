// MODEL 
numOctaves=3;
maxColumns=100;
const key_color =  [
    {
      pitch: "C",
      color: "white", 
    },
    {
      pitch: "C#", 
      color: "black"
    },
    {
      pitch:"D",
      color:"white"
    },
    {
      pitch:"D#",
      color: "black"
    },
    {
      pitch:"E",
      color:"white"
    },
    {
      pitch: "F",
      color:"white"
    },
    {
      pitch: "F#",
      color: "black"
    },
    {
      pitch :"G",
      color:"white"
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

// CONTROLLER

function scroll() {
  const bar = document.getElementById("scrollingBar");
  const pianoContainer = document.getElementById("output_block");
  var speed = 1;
  var direction=1;
  var boxLeftPos = bar.offsetLeft, boxRightPos = boxLeftPos + bar.offsetWidth;
  if (boxRightPos < pianoContainer.offsetWidth) {
     bar.style.left = (boxLeftPos + speed * direction) + 'px';  
  }
} 

function addNote(event){
  
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

function createRow(scaleNumber, noteNumber){
  const row = document.createElement("tr");
  // per ogni riga aggiungo la prima colonna che rimarrà fissa e poi tutte le altre
  fixedColumn= createFixedColumn(scaleNumber, noteNumber);
  row.appendChild(fixedColumn);
  for(let columnNumber=0; columnNumber<maxColumns;columnNumber++){
    const column = document.createElement("td");
    column.classList.add("white");
    const button = document.createElement("button");
    button.classList.add("cellButton");
    button.onclick = function(){ addNote(event);};
    //  da togliere, è solo per vedere i button colorati
    button.classList.add("pressButton");
    //
    column.appendChild(button);
    row.appendChild(column);
      if(noteNumber==1 || noteNumber==3 || noteNumber==6 || noteNumber==8 || noteNumber==10)
    {
      column.classList.add('black_background');
    }
    else {
      column.classList.add('white_background');
    }
    
  }
  return row;
}

function createHeader(){
	const table_head = document.createElement("thead");
	const row = document.createElement("tr");
	row.classList.add("topstop");
	for(let columnNumber=0; columnNumber<maxColumns;columnNumber++){
		const cell = document.createElement("th");
		if(columnNumber==0){
			const playButton = document.createElement("button");
			var t = document.createTextNode("PLAY");
  		playButton.append(t);
      playButton.setAttribute("id", "playButton");
      playButton.onclick = function(){ var myVar = setInterval(scroll, 10);};
			cell.appendChild(playButton);
		}
		
		row.appendChild(cell);
	}
	
	table_head.appendChild(row);
	return table_head;
}

function createTable(){
  const main_table = document.createElement("table");
	table_head = createHeader();
	const table_body =document.createElement("tbody");
  //per ogni nota creo una riga della tabella e la carico nella tabella
  for(let rowNumber=0;rowNumber<numOctaves*key_color.length;rowNumber++){
    scaleNumber = Math.floor(rowNumber/key_color.length);
    noteNumber = rowNumber - (key_color.length * scaleNumber);
    row= createRow(scaleNumber, noteNumber);
    table_body.appendChild(row);
  }
	main_table.appendChild(table_head);
	main_table.appendChild(table_body);
  return main_table;
}

function createPianoRoll(){
	const pianoRollTable = document.createElement("div");
  pianoRollTable.classList.add("table-scroll");
	pianoRollTable.setAttribute("id", "table-scroll");
  const table_wrap =document.createElement("div");
  table_wrap.classList.add("table-wrap");
	main_table = createTable();
	table_wrap.appendChild(main_table);
  pianoRollTable.appendChild(table_wrap);
	return pianoRollTable;
}

function createBar(){
	const bar = document.createElement("div");
  bar.setAttribute("id", "scrollingBar");
  bar.classList.add("scrollingBar");
	return bar;
}

function firstRender(){
	const pianoContainer = document.getElementById("output_block");
  pianoRollTable=createPianoRoll();
	pianoContainer.appendChild(pianoRollTable);
	bar = createBar();
	pianoContainer.appendChild(bar);
}
firstRender();

