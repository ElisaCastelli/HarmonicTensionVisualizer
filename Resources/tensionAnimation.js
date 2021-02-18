let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let data = new Array(canvas.width);
let dataOut = new Array(canvas.width);
let x = 0; // horizontal speed
let tension = 0;
let maxTension = 10;
let maxHeight = canvas.height;
let maxSpeed = 0.03;
let localSurprise = ""

ctx.strokeStyle = 'white';

function tensionChange(finalTension , surprise) {
  localSurprise = surprise
  let initialTension = tension
  let diff = (finalTension-initialTension)/30
  for (let i=1 ; i <= 30 ; i++) {
    setTimeout( function() {tension += diff} , i*(50/3))
  }
}

function generateData(tension,maxTension,localSurprise) {
  if (x < 2*Math.PI){
    x += (1+(tension/maxTension))*maxSpeed * 2 * Math.PI;
  } else {
    x = 0 // per evitare che x aumenti all'infinito
    x += (1+(tension/maxTension))*maxSpeed * 2 * Math.PI; // per che l'animazione sia fluida
  }
  
  if (localSurprise == "" || localSurprise == "A" || localSurprise == "D") {
    maxSpeed = 0.03;
    // crea l'array contenente il valore della funzione seno
    for (let i=0 ; i<data.length ; i++) {
      data[i] = ( ((maxHeight/2)*(tension/maxTension) ) * Math.sin( 6*(tension/maxTension)*Math.PI * (i/data.length) + x )) // modificare il primo valore del seno per modificare il numero di periodi
    }
    
    // applica una window al seno
    for (let i = 0 ; i < data.length ; i++) {
      let hanningWin = 0.5 * (1 - Math.cos(2*Math.PI*i/data.length)); // hamming window
      let triangularWin = 1 - Math.abs((i - data.length/2) / ((data.length+1)/2)) // triangular window
      let a0 = 0.21557895
      let a1 = 0.41663158
      let a2 = 0.277263158
      let a3 = 0.083578947
      let a4 = 0.006947368
      let flatTopWin = a0 - a1*Math.cos( 2*Math.PI*i / data.length) + a2*Math.cos( 4*Math.PI*i / data.length) - a3*Math.cos( 6*Math.PI*i / data.length) + a4*Math.cos( 8*Math.PI*i / data.length) // Flat top window
      dataOut[i] = (hanningWin * data[i]) + maxHeight/2;
    }
  } else {
    maxSpeed = 0.04
    for (let i=0 ; i<data.length ; i++) {
      data[i] = ( ((maxHeight/2)*(tension/maxTension) ) * Math.sin( 30*(5/maxTension)*Math.PI * (i/data.length) + x )) // modificare il primo valore del seno per modificare il numero di periodi
    }
  
    let data1 = [];
    let data2 = [];
  
    for (let i = 0 ; i < data.length/2 ; i++) {
      // window
      //let flatTopWin = a0 - a1*Math.cos( 2*Math.PI*i / (data.length/4)) + a2*Math.cos( 4*Math.PI*i / (data.length/4)) - a3*Math.cos( 6*Math.PI*i / (data.length/4)) + a4*Math.cos( 8*Math.PI*i / (data.length/4)) // Flat top window
      let hanningWin = 0.5 * (1 - Math.cos(2*Math.PI*i / (data.length/2))); // hamming window
      data1[i] = (hanningWin * data[i]) + maxHeight/2;
    }
  
    for (let i = 0 ; i < data.length/2 ; i++) {
      // data ridotto
      let hanningWin = 0.5 * (1 - Math.cos(2*Math.PI*i / (data.length/2))); // hamming window
      data2[i] = (hanningWin * data[i + data.length/2]) + maxHeight/2;
    }
  
    dataOut = data1.concat(data2);
  }
  
  /*
  let data1 = new Array(data.length/4);
  let data2 = new Array(data.length/2);
  let data3 = new Array(data.length/4);

  for (let i = 0 ; i < data.length/4 ; i++) {
    // window
    let a0 = 0.21557895
    let a1 = 0.41663158
    let a2 = 0.277263158
    let a3 = 0.083578947
    let a4 = 0.006947368
    let flatTopWin = a0 - a1*Math.cos( 2*Math.PI*i / (data.length/4)) + a2*Math.cos( 4*Math.PI*i / (data.length/4)) - a3*Math.cos( 6*Math.PI*i / (data.length/4)) + a4*Math.cos( 8*Math.PI*i / (data.length/4)) // Flat top window
    let hanningWin = 0.5 * (1 - Math.cos(2*Math.PI*i / (data.length/4))); // hamming window
    data1[i] = (hanningWin * data[i]) + maxHeight/2;
  }

  for (let i = 0 ; i < data.length/2 ; i++) {
    // data ridotto
    let hanningWin = 0.5 * (1 - Math.cos(2*Math.PI*i / (data.length/2))); // hamming window
    data2[i] = (hanningWin * data[i + data.length/4]) + maxHeight/2;
  }
  console.log(data2.length)

  for (let i = 0 ; i < data.length/4 ; i++) {
    // window
    let a0 = 0.21557895
    let a1 = 0.41663158
    let a2 = 0.277263158
    let a3 = 0.083578947
    let a4 = 0.006947368
    let flatTopWin = a0 - a1*Math.cos( 2*Math.PI*i / (data.length/4)) + a2*Math.cos( 4*Math.PI*i / (data.length/4)) - a3*Math.cos( 6*Math.PI*i / (data.length/4)) + a4*Math.cos( 8*Math.PI*i / (data.length/4)) // Flat top window
    let hanningWin = 0.5 * (1 - Math.cos(2*Math.PI*i / (data.length/4))); // hamming window
    data3[i] = (hanningWin * data[i + data.length*(3/4)]) + maxHeight/2;
  }

  dataOut = data1.concat(data2).concat(data3);*/

  /*
  console.log("data:" ,data.length);
  console.log("data 1:" ,data1.length);
  console.log("data 2:" ,data2.length);
  console.log("data 3:" ,data3.length);
  console.log("dataOut:" ,dataOut.length);*/
  return dataOut;
}

function waveColor(tension , maxTension , localSurprise) {
  if ( localSurprise == "" || localSurprise == "A" || localSurprise == "D") {
    let r = 255
    let g = 255 - 255*(tension/maxTension);
    let b = 255 - 255*(tension/maxTension);
    let color = "rgb(" + r + ", " + g + ", " + b + ")" ;
    ctx.strokeStyle = color; 
  } else {
    let r = 255 - 255*(tension/maxTension);
    let g = 255;
    let b = 255 - 255*(tension/maxTension);
    let color = "rgb(" + r + ", " + g + ", " + b + ")" ;
    ctx.strokeStyle = color; 
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  //ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.beginPath()
  generateData(tension,maxTension,localSurprise)
  waveColor(tension,maxTension, localSurprise)
  ctx.moveTo(0,dataOut[0]);
  for (let i=0 ; i<dataOut.length ; i++ ){
    ctx.lineTo(i,dataOut[i])
    ctx.stroke()
  }
}

let start = setInterval(draw , 30);

export { tensionChange , start };