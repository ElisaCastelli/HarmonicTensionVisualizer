let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let data = new Array(canvas.width);
let dataOut = new Array(canvas.width);
let x = 0;
let tension = 0;
let maxTension = 10;
let maxHeight = canvas.height;
let maxSpeed = 0.03;

//ctx.fillStyle = 'LightSlateGrey';
//ctx.fillStyle = 'rgb(64,75,80)';

function tensionChange(finalTension) {
  let initialTension = tension
  let diff = (finalTension-initialTension)/30
  for (let i=1 ; i <= 30 ; i++) {
    setTimeout( function() {tension += diff} , i*(50/3))
  }
}

function generateData(tension,maxTension) {
  if (x < 2*Math.PI){
    x += (1+(tension/maxTension))*maxSpeed * 2 * Math.PI;
  } else {
    x = 0 // per evitare che x aumenti all'infinito
    x += (1+(tension/maxTension))*maxSpeed * 2 * Math.PI; // per che l'animazione sia fluida
  }
  
  // crea l'array contenente il valore della funzione seno
  for (let i=0 ; i<data.length ; i++) {
    data[i] = ( ((maxHeight/2)*(tension/maxTension) ) * Math.sin( 10*(tension/maxTension)*Math.PI * (i/data.length) + x )) // modificare il primo valore del seno per modificare il numero di periodi
  }

  // applica una hanning window al seno
  for (let i = 0 ; i < data.length ; i++) {
    let multiplier = 0.5 * (1 - Math.cos(2*Math.PI*i/data.length));
    dataOut[i] = (multiplier * data[i]) + maxHeight/2 ;
  }
  return dataOut;
}

function waveColor(tension,maxTension) {
  let r = 255
  let g = 255 - 255*(tension/maxTension)
  let b = 255 - 255*(tension/maxTension)
  let color = "rgb(" + r + ", " + g + ", " + b + ")"
  ctx.strokeStyle = color;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  //ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.beginPath()
  generateData(tension,maxTension)
  waveColor(tension,maxTension)
  ctx.moveTo(0,dataOut[0]);
  for (let i=0 ; i<dataOut.length ; i++ ){
    ctx.lineTo(i,dataOut[i])
    ctx.stroke()
  }
}

let start = setInterval(draw , 30);

export { tensionChange , start };