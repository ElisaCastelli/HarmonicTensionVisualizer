/** DEFINITIONS: type of chords accepted
 * '' = major triad
 * min = minor triad
 * dim = diminished triad
 * aug = augmented triad
 * maj7 = major seventh
 * min7 = minor seventh
 * 7 = dominant
 * halfdim = half diminished
 * dim7 = diminished quadriad
 */

/** ASSUMPTIONS (may be modified in future updates)
 * 1) just major scale progressions
 * 2) no modal progressions
 * 2) only triads and quadriads
 */
//const chord_notation = /^[A-G][#b]?(min|dim|aug|maj7|min7|7|halfdim|dim7)?$/;
//class Chord {
//	constructor(chord){
//		if (chord_notation.test(chord)) {
//			this.chord = chord;
//		}
//		else {
//			throw "chord is not valid";
//		}
//	}
//}

// patterns for accepted chords
// const note_notation = /^[A-G][#b]?$/;
// const type_notation = /^(min|dim|aug|maj7|min7|7|halfdim|dim7)?$/;

const degrees = ["I", "II", "III", "IV", "V", "VI", "VII"];

// object containing notes at corresponding index, used for extracting value
const allnotes = {
	norm: ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"],
	sharp: ["", "C#", "", "D#", "", "", "F#", "", "G#", "", "A#", ""],
	flat: ["", "Db", "", "Eb", "", "", "Gb", "", "Ab", "", "Bb", ""],
	letters: ["C", "D", "E", "F", "G", "A", "B"]
};


// array of possible modes (for now just modes of major scale)
const modes = [{
	name: 'major (Ionian)',
	intervals: [0, 2, 4, 5, 7, 9, 11],
	triads: ["", "min", "min", "", "", "min", "dim"],
	quadriads: ["maj7", "min7", "min7", "maj7", "7", "min7", "halfdim"],
	tonal_harmony: true
}, {
	name: 'Dorian',
	intervals: [0, 2, 3, 5, 7, 9, 10],
	triads: ["min", "min", "", "", "min", "dim", ""],
	quadriads: ["min7", "min7", "maj7", "7", "min7", "halfdim", "maj7"],
	tonal_harmony: false
}, {
	name: 'Phrygian',
	intervals: [0, 1, 3, 5, 7, 8, 10],
	triads: ["min", "", "", "min", "dim", "", "min"],
	quadriads: ["min7", "maj7", "7", "min7", "halfdim", "maj7", "min7"],
	tonal_harmony: false
}, {
	name: 'Lydian',
	intervals: [0, 2, 4, 6, 7, 9, 11],
	triads: ["", "", "min", "dim", "", "min", "min"],
	quadriads: ["maj7", "7", "min7", "halfdim", "maj7", "min7", "min7"],
	tonal_harmony: false
}, {
	name: 'Mixolydian',
	intervals: [0, 2, 4, 5, 7, 9, 10],
	triads: ["", "min", "dim", "", "min", "min", ""],
	quadriads: ["7", "min7", "halfdim", "maj7", "min7", "min7", "maj7"],
	tonal_harmony: false
}, {
	name: 'Minor (aeolian)',
	intervals: [0, 2, 3, 5, 7, 8, 10],
	triads: ["min", "dim", "", "min", "min", "", ""],
	quadriads: ["min7", "halfdim", "maj7", "min7", "min7", "maj7", "7"],
	tonal_harmony: true
}, {
	name: 'Locrian',
	intervals: [0, 1, 3, 5, 6, 8, 10],
	triads: ["dim", "", "min", "min", "", "", "min"],
	quadriads: ["halfdim", "maj7", "min7", "min7", "maj7", "7", "min7"],
	tonal_harmony: false
}];
//every mode of major scale could be generated by a function 
//instead of writing it down

function arraySum(total, num) {
	return total + num;
} 

//approfondisci bene che cavolo sono sti prototype e cosa cambia con le classi
export function Chord(note, type) {
	this.note = note;
	this.type = type || '';
	/*if (! note_notation.test(this.note)) {
		throw "note is not valid";
	}
	if (! type_notation.test(this.type)) {
		throw "type is not valid";
	} 
	*/
}
//vedi sopra, defining getAbsValue Method of Chord
Chord.prototype.getAbsValue = function(){
	let value = allnotes.norm.indexOf(this.note);
	if (value < 0)
		value = allnotes.flat.indexOf(this.note);
	if (value < 0)
		value = allnotes.sharp.indexOf(this.note);	
	return value;
}
// get the value of a note, relative to the tonic
Chord.prototype.getTonicInterval = function(tonic){
	let value = this.getAbsValue();
	let shift = tonic.getAbsValue();
	if (shift != 0)
		value = value - shift >= 0 ? value - shift : value - shift + 12;
	return value;
}
Chord.prototype.toString = function(){
	return this.note.concat(this.type);
}

function getScaleIndex(scale_name){
	for (var i = 0; i < modes.length; i++) {
		if (modes[i].name == scale_name) {
			return i;
		}
	}
}

function getDegree(chord, key){
	if (key == null) {
		throw "no key was given";
		return 0;
	}
	let curr_interval = chord.getTonicInterval(new Chord(key.tonic));
	let chord_deg_index = modes[getScaleIndex(key.scale)].intervals.indexOf(curr_interval);
	// if note out of scale
	if (chord_deg_index < 0){
		chord_letter = chord.note.charAt(0);
		tonic_letter = key.tonic.charAt(0);
		let temp_degree = allnotes.letters.indexOf(chord_letter) - allnotes.letters.indexOf(tonic_letter);
		// if the difference returns a negative value
		if (temp_degree < 0) {
			//set the real degree value
			temp_degree = Math.abs(temp_degree) + 1;
			//get the reciprocal interval, then remove the 1 added before
			temp_degree = 9 - temp_degree - 1;
		}
		let temp_interval = modes[getScaleIndex(key.scale)].intervals[temp_degree];
		if (temp_interval + 1 == curr_interval)
			return degrees[temp_degree].concat("#");
		else
			return degrees[temp_degree].concat("b");
	}
	//console.log(chord_deg_index);
	return degrees[chord_deg_index];
}

function getProgDegrees(progression, key){
	
	let degrees_progression = [];
	let deg_chord = {};
	let triad_check;
	let quadriad_check;
	for (let i = 0; i < progression.length; i++) {
		deg_chord = {
			note: progression[i].note,
			type: progression[i].type,
			type_coherent: true,
			degree: getDegree(progression[i], key),
			degree_coherent: true,
			curr_key: key.scale,
			tension: 1
		};
		if (deg_chord.degree.includes("#") || deg_chord.degree.includes("b")) {
			deg_chord.degree_coherent = false;
		}
		// check if the degree type is different from its scale
		triad_check = modes[getScaleIndex(key.scale)].triads[degrees.indexOf(deg_chord.degree)] == progression[i].type;
		quadriad_check = modes[getScaleIndex(key.scale)].quadriads[degrees.indexOf(deg_chord.degree)] == progression[i].type;
		if (! (triad_check || quadriad_check)) {
			deg_chord.type_coherent = false;
		}
		degrees_progression.push(deg_chord);
	}
	return degrees_progression;
}

function findKey(progression){
	// variable for saving the current tonic hypothesis
	let tonic;
	// variable for storing every interval between a chord and the current tonic
	let curr_interval;
	
	// each accepted key will gain or lose points according to different parameters (number of substitutions, kind of substitutions, ...)
	let accepted_keys = [];
	let tempKey = {};
	
	let chord_deg_index;
	let chord_degree;
	let triad_check;
	let quadriad_check;
	
	// for every possible tonic in the progression
	for (let tonic_index = 0; tonic_index < progression.length; tonic_index++) {
		// saving the current tonic
		tonic = progression[tonic_index];
		
		// for every scale known by the program
		for (let scale = 0; scale < modes.length; scale++) {
			
			// reset the counter
			tempKey = {
				tonic: tonic.note,
				scale: modes[scale].name,
				points: 0
			};
			// check that the chord is inside the scale "tonic.note modes[scale]"
			for (let chord = 0; chord < progression.length; chord++) {
				// evaluate interval with current tonic hypothesis
				curr_interval = progression[chord].getTonicInterval(tonic);
				
				// check if the interval between the two chords is contained in the scale
				if (modes[scale].intervals.includes(curr_interval)){
					
					// get the chord degree (real degree = chord_deg_index + 1, 
					// because array indexing starts from 0, while chord degrees start from 1)
					chord_deg_index = modes[scale].intervals.indexOf(curr_interval);
					chord_degree = degrees[chord_deg_index];
					
					// check if the type of the chord is equal to the triad or quadriad of the current scale
					triad_check = modes[scale].triads[chord_deg_index] == progression[chord].type;
					quadriad_check = modes[scale].quadriads[chord_deg_index] == progression[chord].type;
					// point assignment
					
					// this is just a statistic idea, tonic probably is at beginning and end of song
					// ocio a logica e parentesi!! primo anno di università, dai
					if((tonic_index == 0 || tonic_index == progression.length -1) && (triad_check || quadriad_check)){
						tempKey.points+=2;
					}
					else if (triad_check || quadriad_check){
						tempKey.points++;
						//if (chord_modes)
						//chord_modes[chord].push(modes[scale].name);
					}
				}
			}
			
			accepted_keys.push(tempKey);
			
			for (let i = 0; i < accepted_keys.length - 1; i++) {
				if (tempKey.tonic == accepted_keys[i].tonic && tempKey.scale == accepted_keys[i].scale){
					accepted_keys[i].points += tempKey.points;
					accepted_keys.pop();
					break;
				}
			}
		}
	}
	// sort accepted_keys based on points
	accepted_keys.sort((a, b) => (a.points > b.points) ? -1 : 1);
	// select the key/keys with highest .points value
	let concurrent_keys = [];
	while (accepted_keys[0].points == accepted_keys[1].points) {
		concurrent_keys.push(accepted_keys.shift())
	}
	concurrent_keys.push(accepted_keys.shift());
	return concurrent_keys;
}

// needs to distinguish between triad and quadriad
// maybe quadriads add a +1 to tension?? maybe it's not that simple
const majScaleChordFunction = [{
	name: "tonic",
	degrees: ["I", "III", "VI"],
	tension: 1
}, {
	name: "subdominant",
	degrees: ["II", "IV"],
	tension: 3
}, {
	name: "dominant",
	degrees: ["V", "VII"],
	tension: 5
}];

const progPatterns = [{
	name: "dominant resolution",
	degrees: ["V", "I"],
	triads: ["", ""],
	quadriads: ["7", "maj7"],
	tension: [5, 1]
}, {
	name: "II-V-I resolution",
	degrees: ["II", "V", "I"],
	triads: ['min', "", ""],
	quadriads: ["min7", "7", "maj7"],
	tension: [3, 6, 1]	// se arrivo da un 2, il 5 è potenziato di tensione
}, {
	name: "II-V movement",
	degrees: ["II", "V"],
	triads: ['min', ""],
	quadriads: ["min7", "7"],
	tension: [3, 6]
}, {
	name: "V of V",
	degrees: ["V", "I"],
	triads: [],
	quadriads: ["7", "7"],
	tension: [5, 5]
}, {//come metterlo giù se non voglio controllare il grado?
	name: "maj7 -> 7",
	degrees: ["VIb", "V"],
	triads: [],
	quadriads: ["maj7", "7"],
	tension: [5, 5]
}];

// here the magic happens
export function evaluateTension(progression){

	// phase 1): select keys with highest number of compatible chords
	let accepted_keys = findKey(progression); // array with selected keys
	
	if (accepted_keys.length == 0) {
		throw "no key was given";
	}
	
	let degrees_progression;
	let tempChord;
	// phase 2): choose the key with highest number of correct chords before the first wrong one
	// for each accepted_key
	for (let i = 0; i < accepted_keys.length; i++) {
		// exception: give priority to major and minor scales
		if (modes[getScaleIndex(accepted_keys[i].scale)].tonal_harmony) {
			accepted_keys[i].points+= 10;
		}
		
		// estimate relative degrees and coherence of each chord in the progression 
		degrees_progression = getProgDegrees(progression, accepted_keys[i]);
		
		//for each chord
		for (let j = 0; j < progression.length; j++) {
			// if I find a chord not coherent with the current accepted key
			if (! (degrees_progression[j].type_coherent && degrees_progression[j].degree_coherent)){
				break;
			}
			accepted_keys[i].points++;
		}
	}
	accepted_keys.sort((a, b) => (a.points > b.points) ? -1 : 1);
	let key = accepted_keys[0];

	// phase 3): analyze each "wrong" chord, with different options 
	
	// same operation as before, based on the chosen key
	degrees_progression = getProgDegrees(progression, key);
	
	// array of all keys that may be found during analysis 
	let priority_keys = [];
	priority_keys.push(key);
	
	let tempKeys = [];
	
	// search for chords out of key
	for (let i = 0; i < degrees_progression.length; i++) {
		
		if (!( degrees_progression[i].type_coherent && degrees_progression[i].degree_coherent)) {
			
			// OPTION A): MODAL INTERCHANGE
			
			//reset temp array
			tempKeys = [];
			//for each mode, with same tonic
			for (let m = 0; m < modes.length; m++) {
				
				// check if the scale is compatible with any other mode
				tempKeys.push({tonic: key.tonic, scale: modes[m].name, points: 0});
				
				//for each mode, with same tonic
				for (let j = i; j < degrees_progression.length; j++) {
					
					tempChord = getProgDegrees([progression[j]], tempKeys[m]);
					if (! (tempChord[0].type_coherent && tempChord[0].degree_coherent)) {
						break;
					}
					//give points for each compatible chord
					tempKeys[m].points++;
				}
			}
			//sort by points
			tempKeys.sort((a, b) => (a.points > b.points) ? -1 : 1);
			// sort by mode similarity
			let keyIntervalsSum = modes[getScaleIndex(key.scale)].intervals.reduce(arraySum);
			for (let m = 0; m < tempKeys.length; m++) {
				if (tempKeys[m].points < tempKeys[0].points) {
					break;
				}
				
				// choose the scale that has less differences (b or #) compared to the original mode
				if(Math.abs(modes[getScaleIndex(tempKeys[m].scale)].intervals.reduce(arraySum) - keyIntervalsSum) <
						Math.abs(modes[getScaleIndex(tempKeys[0].scale)].intervals.reduce(arraySum) - keyIntervalsSum)){
					tempKeys[0] = tempKeys[m];
				}
			}
			// if at least one mode is compatible
			if (tempKeys[0].points > 0) {
				console.log(progression[i].toString(), "is borrowed from :", tempKeys[0].tonic, tempKeys[0].scale);
				// add this key to priority_keys
				priority_keys.push(tempKeys[0]);
				// update chord information
				degrees_progression[i].curr_key = tempKeys[0].scale;
				continue;
			}
			// note: the choices above are just a convention in order to solve ambiguiti, 
			// it is not the aim of the project to identify the correct interpretation
			
			// OPTION B): CHANGE OF SCALE
			
			if (i != 0 && degrees_progression[i - 1].degree == "V") {
				
			}
			
		}
		
		
	}
	
	
	
	// TENSION PROGRESSION
	// let tension_progression = new Array(progression.length);
	// tension_progression.fill(1);
	// only for major scale, diatonic substitutions
	if (modes[getScaleIndex(key.scale)].name == 'major (Ionian)'){
		for (let i = 0; i < degrees_progression.length; i++) {
			for (let j = 0; j < majScaleChordFunction.length; j++) {
				if (majScaleChordFunction[j].degrees.indexOf(degrees_progression[i].degree) >= 0 && degrees_progression[i].type_coherent) {
					degrees_progression[i].tension = majScaleChordFunction[j].tension;
				}
			}
		}
	}
	// to be reviewed!
	// for other scales, every chord that is not tonic, there is a little constant tension
	else {
		for (let i = 0; i < degrees_progression.length; i++) {
		
			if (degrees_progression[i].degree != "I") {
				degrees_progression[i].tension = 2;
			}

		}
	}
	
	// sort patterns from longest to shortest
	progPatterns.sort((a, b) => (a.tension.length > b.tension.length) ? -1 : 1);
	
	// for each chord in the progression
	for (let i = 0; i < degrees_progression.length; i++) {	
		let found_pattern;
		let pattern;
		// for each tension pattern 
		for (let p = 0; p < progPatterns.length; p++) {
			pattern = degrees_progression.slice(i, i + progPatterns[p].degrees.length);
			found_pattern = true;
			// check every following chord that belong to the current pattern
			for (let j = 0; j < pattern.length; j++) {
				if (pattern[j].degree == progPatterns[p].degrees[j] && 
						(pattern[j].type == progPatterns[p].triads[j] || 
						pattern[j].type == progPatterns[p].quadriads[j])) {
				}
				else {
					found_pattern = false;
					break;
				}
			}
			if (found_pattern) {
				console.log("found pattern:", progPatterns[p].name);
				// substitute tension values in tension_progression
				Array.prototype.splice.apply(tension_progression, [i, progPatterns[p].tension.length].concat(progPatterns[p].tension));
				i += progPatterns[p].tension.length;
				break;
			}
		}
		
	}
	console.log(degrees_progression[0].tension);
	return degrees_progression;
}

// test progression, try the chords you like
/*
const progression = [];
try {
	progression.push(new Chord('A', 'min'));
	progression.push(new Chord('C'));
	progression.push(new Chord('D'));
	progression.push(new Chord('F'));
	progression.push(new Chord('A', 'min'));

} catch (e) {
	console.error(e);
}

console.log('\n ACCEPTED KEYS:\n', findKey(progression));
try {
	console.log("Progression degrees and tension array:\n", evaluateTension(progression));
} catch (e) {
	console.error(e);
}
*/

// Harmony analysis
// - quadriadi + tese di triadi
// - raggruppare pattern per scala?
// - majScaleChordFunction solo controllo per scala maggiore	FATTO
// - harmony analysis cambia pattern/sostituzioni considerate in base a a scala
// - pattern cambiano tensione in base a triade o quadriade (II V I triade è meno teso della corrispondente quadriade)
// - cerca sostituzioni e interscambi modali
// - se arrivo da un 2, il 5 è potenziato di tensione	FATTO, MA DA RIVEDERE
// - dovrei fare modo di non controllare i gradi assoluti, ma solo il rapporto tra


