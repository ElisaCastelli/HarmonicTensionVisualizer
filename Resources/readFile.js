import {fillMatrix}from './matrix.js';
import { printSelected, fillFinalProgression, unselectMatrix, selectRoot } from '../script.js';

/** Function used to read the file uploaded */
export function uploadFile(file) {
    let textType = /text.*/;
    let matrixString = "";
    let progressionString = "";
    let finalProgression =[];
    if (file.type.match(textType)) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            let text = reader.result;
            let lastIndex = text.indexOf("\n");
            matrixString = text.substring(0, lastIndex);
            fillMatrix(matrixString);
            printSelected();
            progressionString = text.substring(lastIndex, text.length);
            finalProgression = fillFinalProgression(progressionString);
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

/** FUnction used to download the file that contains your progressiom */
export function downloadFile(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}