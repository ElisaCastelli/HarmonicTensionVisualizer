export function readMatrice(file) {
    let textType = /text.*/;
    let matrixString = "";
    //let matrixSelected = new Array();
    if (file.type.match(textType)) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            let text = reader.result;
            let lastIndex = text.indexOf("\n");
            matrixString = text.substring(0, lastIndex);
            console.log(matrixString);
        }
    } else {
        console.log("File not supported!");
    }
    return matrixString;
}

export function readProgression(file) {
    let textType = /text.*/;
    let finalProgressionSelected = new Array();
    if (file.type.match(textType)) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            let text = reader.result;
            let lastIndex = text.indexOf("\n");
            let finalProgString = text.substring(lastIndex, text.length);
            console.log(finalProgString);
        }
    } else {
        console.log("File not supported!");
    }
    return finalProgressionSelected;
}

export function downloadFile(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}