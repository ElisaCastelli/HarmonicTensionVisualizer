export function readFile(file){
    let textType = /text.*/;
	if (file.type.match(textType)) {
		let reader = new FileReader();
        reader.readAsText(file);	
		reader.onload = function(e) {
            let text = reader.result;
            let lastIndex = text.indexOf("]");
            // parsing chords
            while(lastIndex >=0){
                let firstIndex = text.indexOf("[") +1;
                let firstChord = text.substring(firstIndex, lastIndex);
                let textTemp = text.slice(lastIndex+1, text.length);
                text ="";
                text = textTemp;
                //print cells from firstChord
                console.log(firstChord);
                console.log(lastIndex);
                lastIndex = text.indexOf("]");
            }
            
		}
		
	} else {
        console.log("File not supported!");
	} 
}