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


export function downloadFile(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}