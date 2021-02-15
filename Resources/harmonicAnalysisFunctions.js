import { allNotes1D } from './chordBuilder.js';
import { diminishedDomSub, tritoneSub } from './Substitutions.js';

/**  patterns for accepted chords*/
const note_notation = /^[A-G][#b]?$/;
const type_notation = /^(min|dim|aug|maj7|min7|7|halfdim|dim7)?$/;
/** const values for possible Degrees, triads and quadriads */
const degrees = ["I", "II", "III", "IV", "V", "VI", "VII"];
const triads = ["", "min", "dim", "aug"];
const quadriads = ["maj7", "min7", "7", "halfdim", "dim7"];

/** All notes, with index associated to interval with C */
const allnotes = {
	norm: ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"],
	sharp: ["", "C#", "", "D#", "", "", "F#", "", "G#", "", "A#", ""],
	flat: ["", "Db", "", "Eb", "", "", "Gb", "", "Ab", "", "Bb", ""],
	degrees: ["I", "I#", "II", "II#", "III", "IV", "IV#", "V", "V#", "VI", "VI#", "VII"],
	letters: ["C", "D", "E", "F", "G", "A", "B"]
};

/**Modes of Major Scale */
export const modes = [{
	name: 'Ionian',
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
	name: 'Aeolian',
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

/** Chord prototype*/
export function Chord(note, type) {
	this.note = note;
	this.type = type || '';
	if (! note_notation.test(this.note)) {
		throw "note is not valid: " + note;
	}
	if (! type_notation.test(this.type)) {
		throw "type is not valid: " + type;
	} 
	
}
/** ChordPlus prototype:
 * Contains additional information obtained during the analysis*/
export function ChordPlus(note, type, degree, key) {
	this.note = note;
	this.type = type;
	this.degree = degree;
	this.curr_key = key;
	
	this.substitution = "";
	this.type_coherent = true;
	this.degree_coherent = true;
	this.event = "";
	this.curr_pattern = "";
	/**Values for visual representation*/
	this.tension = 1;
	this.surprise = "";
}

/** Key prototype*/
export function Key(tonic, scale){
	this.tonic = tonic;
	this.scale = scale;
	this.scale_index = getScaleIndex(scale);
	this.points = 0;
}

/** returns numeric value of Chord's tonic, used for comparisons*/
Chord.prototype.getAbsValue = function(){
	let value = allnotes.norm.indexOf(this.note);
	if (value < 0)
		value = allnotes.flat.indexOf(this.note);
	if (value < 0)
		value = allnotes.sharp.indexOf(this.note);	
	return value;
}

/** returns interval of Chord's note, according to input tonic*/
Chord.prototype.getTonicInterval = function(tonic){
	let value = this.getAbsValue();
	let shift = tonic.getAbsValue();
	if (shift != 0)
		value = value - shift >= 0 ? value - shift : value - shift + 12;
	return value;
}

/**returns string of current Chord */
Chord.prototype.toString = function(){
	return this.note.concat(this.type);
}

/**returns string of current ChordPlus */
ChordPlus.prototype.toString = function(){
	return this.note.concat(this.type);
}
ChordPlus.prototype.getAbsValue = function(){
	let value = allnotes.norm.indexOf(this.note);
	if (value < 0)
		value = allnotes.flat.indexOf(this.note);
	if (value < 0)
		value = allnotes.sharp.indexOf(this.note);	
	return value;
}

/**returns string of current Key */
Key.prototype.toString = function(){
	return this.tonic + " " + this.scale;
}

Key.prototype.equalTo = function(other){
	return this.tonic == other.tonic && this.scale == other.scale;
}

/** support function, used to evaluate sum of Array values with reduce()*/
function arraySum(total, num) {
	return total + num;
} 

/** returns index of a mode contained in modes*/
function getScaleIndex(scale_name){
	for (var i = 0; i < modes.length; i++) {
		if (modes[i].name == scale_name) {
			return i;
		}
	}
}

/** returns the degree of a Chord, according to a given Key */
function getDegree(chord, key){
	if (key == null) {
		throw "no key was given";
		return 0;
	}
	let curr_interval = chord.getTonicInterval(new Chord(key.tonic));
	let chord_deg_index = modes[key.scale_index].intervals.indexOf(curr_interval);
	// if note out of scale
	if (chord_deg_index < 0){
		let chord_letter = chord.note.charAt(0);
		let tonic_letter = key.tonic.charAt(0);
		let temp_degree = allnotes.letters.indexOf(chord_letter) - allnotes.letters.indexOf(tonic_letter);
		// if the difference returns a negative value
		if (temp_degree < 0) {
			//set the real degree value
			temp_degree = Math.abs(temp_degree) + 1;
			//get the reciprocal interval, then remove the 1 added before
			temp_degree = 9 - temp_degree - 1;
		}
		let temp_interval = modes[key.scale_index].intervals[temp_degree];
		if (temp_interval + 1 == curr_interval)
			return degrees[temp_degree].concat("#");
		else
			return degrees[temp_degree].concat("b");
	}
	return degrees[chord_deg_index];
}

/** returns an array of ChordPlus with degree evaluated, according to given Key */
export function getProgDegrees(progression, key){
	let progression_plus = [];
	let triad_check;
	let quadriad_check;
	let temp;
	// for a single input
	if (progression.length === undefined) {
		temp = [];
		temp.push(progression);
		progression = temp;
	}
	for (let i = 0; i < progression.length; i++) {
		// to avoid errors with ChordPlus
		temp = new Chord(progression[i].note, progression[i].type);
		progression_plus.push( new ChordPlus(temp.note, temp.type, getDegree(temp, key), key));
		if (progression_plus[i].degree.includes("#") || progression_plus[i].degree.includes("b")) {
			progression_plus[i].degree_coherent = false;
		}
		// check if the degree type is different from its scale
		triad_check = modes[key.scale_index].triads[degrees.indexOf(progression_plus[i].degree)] == progression[i].type;
		quadriad_check = modes[key.scale_index].quadriads[degrees.indexOf(progression_plus[i].degree)] == progression[i].type;
		if (! (triad_check || quadriad_check)) {
			progression_plus[i].type_coherent = false;
		}
	}
	return progression_plus;
}

/** analyzes a given chord progression and returns the most compatible keys */
export function findKey(progression){
	// variable for saving the current tonic hypothesis
	let tonic;
	// variable for storing every interval between a chord and the current tonic
	let curr_interval;
	
	// each accepted key will gain or lose points according to different parameters (number of substitutions, kind of substitutions, ...)
	let accepted_keys = [];
	let tempKey;
	
	let chord_deg_index;
	let chord_degree;
	let triad_check;
	let quadriad_check;
	/**I need at least one I chord to accept a key*/
	let firstDegreePresent;
	
	// for every possible tonic in the progression
	for (let tonic_index = 0; tonic_index < progression.length; tonic_index++) {
		// saving the current tonic
		tonic = progression[tonic_index];
		
		// for every scale known by the program
		for (let scale = 0; scale < modes.length; scale++) {
			
			// reset the counter
			tempKey = new Key(tonic.note, modes[scale].name);
			firstDegreePresent = false;
			
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
					
					/** THREE HYPOTHESIS:
					 * 1): tonic probably is the first chord of the progression
					 * 2): I degrees increase probability that current key is correct
					 * 3): dominant chords do the same*/
					if (tonic_index == 0 && (triad_check || quadriad_check)) {
						tempKey.points += 2;
					}
					else if (chord_degree == "I" && (triad_check || quadriad_check)){
						firstDegreePresent = true;
						tempKey.points += 2;
					}
					else if (chord_degree == "V" && quadriad_check){
						tempKey.points += 2;
					}
					else if (triad_check || quadriad_check){
						tempKey.points++;
					}
				}
			}
			// if I have already saved the current key, merge the occourrences and sum points
			if (firstDegreePresent) {
				accepted_keys.push(tempKey);
				// merge duplicate occourrences of keys
				for (let i = 0; i < accepted_keys.length - 1; i++) {
					if (tempKey.tonic == accepted_keys[i].tonic && tempKey.scale == accepted_keys[i].scale){
						accepted_keys[i].points += tempKey.points;
						accepted_keys.pop();
						break;
					}
				}
			}
			
		}
	}
	// sort accepted_keys based on points
	accepted_keys.sort((a, b) => (a.points > b.points) ? -1 : 1);
	// select the key/keys with highest .points value
	let concurrent_keys = [];
	
	for (let i = 0; i < accepted_keys.length - 1; i++) {
		concurrent_keys.push(accepted_keys[i]);
		if (typeof accepted_keys[i + 1].points != undefined && ! accepted_keys[i].points == accepted_keys[i + 1].points)
			break
	}
	concurrent_keys.push(accepted_keys.shift());
	return concurrent_keys;
}

/** Standard tensions for: tonal context (major scale)*/
const diatonicFunction = [{
	name: "tonic",
	degrees: [/*"I",*/ "III", "VI"],
	triad_tension: 2,
	quadriad_tension: 3
}, {
	name: "subdominant",
	degrees: ["II", "IV"],
	triad_tension: 4,
	quadriad_tension: 5
}, {
	name: "dominant",
	degrees: ["V", "VII"],
	triad_tension: 7,
	quadriad_tension: 9
}];

/** Standard tensions for: modal context */
const modal_tension = 3;

/** Standard tension of Chords containing tritone*/
const tritoneTensions = {
	chords: ["7", "dim", "halfdim", "dim7"],
	tension: [8, 9, 7, 10]
}

/** Well known progression Patterns */
const MajPatterns = [{
	name: "dominant resolution",
	degrees: ["V", "I"],
	triads: ["n", ""],
	quadriads: ["7", "maj7"],
	triad_tension: [7, 1],
	quadriad_tension: [9, 1]
}, {
	name: "II-V-I resolution",
	degrees: ["II", "V", "I"],
	triads: ['min', "", ""],
	quadriads: ["min7", "7", "maj7"],
	triad_tension: [4, 7, 1],
	quadriad_tension: [5, 10, 1]
}, {
	name: "II-V pattern",
	degrees: ["II", "V"],
	triads: ['min', ""],
	quadriads: ["min7", "7"],
	triad_tension: [4, 7],
	quadriad_tension: [5, 10]
}, {
	name: "I-VI-II-V pattern",
	degrees: ["I", "VI", "II", "V"],
	triads: ["", "min", "min", ""],
	quadriads: ["maj7", "min7", "min7", "7"],
	triad_tension: [1, 2, 4, 7],	// da ascoltare e discutere con gruppo
	quadriad_tension: [2, 3, 5, 9] // da ascoltare e discutere con gruppo
}, {
	name: "III-VI-II-V pattern",
	degrees: ["III", "VI", "II", "V"],
	triads: ["min", "min", "min", ""],
	quadriads: ["min7", "min7", "min7", "7"],
	triad_tension: [2, 2, 4, 7],	// da ascoltare e discutere con gruppo
	quadriad_tension: [3, 3, 5, 9] // da ascoltare e discutere con gruppo
}, {
	name: "I-II-III-IV pattern",
	degrees: ["I", "II", "III", "IV"],
	triads: ["", "min", "min", ""],
	quadriads: ["maj7", "min7", "min7", "maj7"],
	triad_tension: [1, 3, 2, 4],	// da ascoltare e discutere con gruppo
	quadriad_tension: [2, 4, 3, 5] // da ascoltare e discutere con gruppo
}, {
	name: "V of V",
	degrees: ["V", "I"],
	triads: ["n", "n"],
	quadriads: ["7", "7"],
	triad_tension: [7, 7],
	quadriad_tension: [9, 9]
}, {//come metterlo giù se non voglio controllare il grado?
	name: "maj7 -> 7",
	degrees: ["V#", "V"], // come fare?
	triads: ["", ""],
	quadriads: ["maj7", "7"],
	triad_tension: [4, 8],
	quadriad_tension: [5, 10]
}];

/** finds secondary dominant resolution*/
export function findSecondaryDom(chord1, chord2){
	let tempProg = [new Chord(chord1.note, chord1.type) , new Chord(chord2.note, chord2.type)];
	let tempKeys = findKey(tempProg);
	for (let i = 0; i < tempKeys.length; i++) {
		tempProg = getProgDegrees(tempProg, tempKeys[i]);
		if (tempProg[0].degree == "V" && tempProg[1].degree == "I") {
			console.log("heyyy", chord1, chord2)
			if (chord2.curr_key.scale == "Aeolian") {	// verifica se necessario modificare altri parametri
				tempProg[0].event = "dominant of " + tempProg[1].toString();
			} else {
				tempProg[0].event = "secondary dominant of " + tempProg[1].toString();
			}
			return tempProg[0];
		}
	}
	return false;
}


/** finds if a chord is borrowed from a parallel mode (modal interchange) */
export function findModalInterchange(progression, priority_keys, chord, index){
	let surprise = "B";
	let tempChord;
	let tempKeys = [];
	
	//for each mode, with same tonic
	for (let m = 0; m < modes.length; m++) {
		// check if the scale is compatible with any other mode
		tempKeys.push(new Key(chord.curr_key.tonic, modes[m].name));
		//for each chord
		for (let j = index; j < progression.length; j++) {
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
	/** if multiple modes with same points:
	 * 1): check if any of them is inside priority_keys
	 * 2): sort by mode similarity*/
	let keyIntervalsSum = modes[chord.curr_key.scale_index].intervals.reduce(arraySum);
	for (let m = 0; m < tempKeys.length; m++) {
		if (tempKeys[m].points < tempKeys[0].points) {
			break;
		}
		if (priority_keys.includes(tempKeys[m])) {
			tempKeys[0] = tempKeys[m];
			break;
		}
		// choose the scale that has less differences (b or #) compared to the original mode
		else if(Math.abs(modes[tempKeys[m].scale_index].intervals.reduce(arraySum) - keyIntervalsSum) <
				Math.abs(modes[tempKeys[0].scale_index].intervals.reduce(arraySum) - keyIntervalsSum)){
			tempKeys[0] = tempKeys[m];
		}
	}
	// review!!!
	progression = getProgDegrees(progression, tempKeys[0]);
	chord = progression[index]
	if (tempKeys[0].points > 0 && chord.degree_coherent && chord.type_coherent) {
		console.log(progression[index].toString(), "is borrowed from :", tempKeys[0].toString());
		chord.event = "borrowed from " + tempKeys[0].toString();
		chord.surprise = surprise;
		return chord;
	}
	else
		return false;

}

/** finds if a chord is a substitution of anothe chord, compatible with current scale*/
export function findSubs(progression, priority_keys, chord, index){
	let surprise = "A";
	let tempChord;
	// gereralization of music theory
	if (["dim", "halfdim", "dim7"].includes(chord.type))
		tempChord = diminishedDomSub(chord);
	else if (chord.type == "7")
		tempChord = tritoneSub(chord);
	else
		return false;
	
	// check if it is coherent with the current key
	tempChord = getProgDegrees([tempChord], chord.curr_key);
	tempChord = tempChord[0];
	
	tempChord.substitution = chord;
	if (tempChord.type_coherent && tempChord.degree_coherent) {
		// save original chord and add event
		chord = tempChord;
		chord.event = "substitution";
		chord.surprise = surprise;
		return chord;
	}
	// test with cowboy bebop: if it works there, it works
	else if (tempChord.degree_coherent) {
		let tempChordSubs = findModalInterchange(progression, priority_keys, tempChord, index);
		let tempChordOrig = findModalInterchange(progression, priority_keys, tempChord.substitution, index);
		
		if (tempChordOrig) {
			console.log("modal interchange", tempChordOrig)
			chord = tempChordOrig;
			chord.surprise = "B";
			return chord;
		}
		else if (tempChordSubs) {
			console.log("substitution of modal interchange", tempChordSubs)
			chord = tempChordSubs;
			chord.surprise = surprise;
			return chord;
		}
	// test with have you met miss jones: if it works there, it works
	else if (tempChord.type == "7" && (index + 1) < progression.length) {
		// search for secondary dominant
		let sub = tempChord.substitution;
		tempChord = findSecondaryDom(new Chord(tempChord.note, tempChord.type), progression[index + 1])
		if (tempChord) {
			console.log("substitution of secondary dominant", tempChord);
			chord = tempChord;
			chord.surprise = surprise;
			chord.substitution = sub;	// forse inutile, controlla quando il sole è sorto grazie
			chord.curr_pattern = "dominant resolution";
			return chord;
		}
	}
	}
	
	else
		return false;
}

/** check if from this point a new key is possible */
export function findChangeKey(progression, priority_keys, progression_plus, index){
	let surprise = "C";
	let curr_key = progression_plus[index].curr_key;
	let tempKeys = findKey(progression.slice(index, progression.length));
	console.log("temp keys:", tempKeys);
	// in case of multiple keys, check if one of them is inside priority_keys
	for (let k = 0; k < tempKeys.length; k++) {
		if (priority_keys.includes(tempKeys[k])) {
			tempKeys[0] = tempKeys[k];
		}
		// if one possible key is the current one, there is no change of key
		if (tempKeys[k].equalTo(curr_key)) {
			return false;
		}
	}
	let temp_deg_progression = getProgDegrees(progression.slice(index, progression.length), tempKeys[0]);

	if (tempKeys[0].points > 0) {
		for (let j = 0; j < progression.length - index; j++) {
			progression_plus[index + j] = temp_deg_progression[j];
		}
		// check also if some previous chords are both in current and original scale
		temp_deg_progression = getProgDegrees(progression.slice(0, index), tempKeys[0]);
		for (let j = index - 1; j > 0; j--) {
			if (temp_deg_progression[j].type_coherent && temp_deg_progression[j].degree_coherent)
				progression_plus[j] = temp_deg_progression[j];
			else
				break;
		}
		progression_plus[index].event = "change of key: " + tempKeys[0].toString();
		progression_plus[index].surprise = surprise;
		return progression_plus;
	}
	else
		return false;
}

/** assigns tension to each chord in the progression */
export function evaluateTension(progression_plus){
	/** assign tension based on functions*/
	let temp_index;
	for (let i = 0; i < progression_plus.length; i++) {
		if (progression_plus[i].degree_coherent && progression_plus[i].type_coherent) {
			/** tension of first degree: minimum */
			if ((progression_plus[i].degree == "I"))
				progression_plus[i].tension = triads.includes(progression_plus[i].type) ? 1 : 2;
			/** only for major scale, tension based on diatonic substitutions */
			else if (progression_plus[i].curr_key.name == modes[0].name) {
				for (let j = 0; j < diatonicFunction.length; j++)
					progression_plus[i].tension = 
						triads.includes(progression_plus[i].type) ? diatonicFunction[j].triad_tension : diatonicFunction[j].quadriad_tension;
			}
			/** for other scales, every chord that is not tonic has a little constant tension */
			else if (progression_plus[i].degree != "I")
				progression_plus[i].tension = modal_tension;
		}
		// assign high tension to chords that contain tritone
		if (tritoneTensions.chords.includes(progression_plus[i].type)){
			if (progression_plus[i].substitution != "") {
				temp_index = tritoneTensions.chords.indexOf(progression_plus[i].substitution.type);
				if (temp_index >= 0)
					progression_plus[i].tension = tritoneTensions.tension[temp_index];
			}
			else {
				temp_index = tritoneTensions.chords.indexOf(progression_plus[i].type);
				progression_plus[i].tension = tritoneTensions.tension[temp_index];
			}
		}
	}
	
	
	// sort patterns from longest to shortest
	MajPatterns.sort((a, b) => (a.triad_tension.length > b.triad_tension.length) ? -1 : 1);
	
	/**assign tension based on patterns*/
	let found_pattern;
	let extract;
	let temp_tonic;
	let temp_key;
	let tmp;
	// for each chord in the progression
	for (let i = 0; i < progression_plus.length; i++) {	
		
		// for each tension pattern 
		for (let p = 0; p < MajPatterns.length; p++) {
			extract = progression_plus.slice(i, i + MajPatterns[p].degrees.length);
			found_pattern = true;
			if (extract.length != MajPatterns[p].degrees.length) {
				continue;
			}

			// evaluate relative degrees to pattern
			if (MajPatterns[p].degrees.includes("I")) {
				tmp = MajPatterns[p].degrees.indexOf("I");
				temp_tonic = extract[tmp];
			}
			else {
				tmp = MajPatterns[p].degrees[0];
				console.log("hh", MajPatterns[p].degrees[0])
				tmp = allnotes.degrees.indexOf(tmp);
				temp_index = extract[0].getAbsValue() - tmp >= 0 ? extract[0].getAbsValue() - tmp : extract[0].getAbsValue() - tmp + 12;
				console.log("hey", extract[0].getAbsValue(), tmp)
				temp_tonic = new Chord(String(allNotes1D[temp_index]));
			}
			temp_key = new Key(temp_tonic.note, modes[0].name);
			extract = getProgDegrees(extract, temp_key);

			// check every following chord that could belong to the current pattern
			for (let j = 0; j < extract.length; j++) {
				if (extract[j].degree == MajPatterns[p].degrees[j] && 
						(extract[j].type == MajPatterns[p].triads[j] || 
						extract[j].type == MajPatterns[p].quadriads[j])) {
				}
				else {
					found_pattern = false;
					break;
				}
			}
			/** if every chord fits the pattern and length is correct, update ChordPlus and move on*/
			if (found_pattern && extract.length == MajPatterns[p].degrees.length) {
				console.log("found pattern:", MajPatterns[p].name);
				/** substitute tension values, choosing between triad and quadriad values  */
				for (let j = i; j < i + MajPatterns[p].degrees.length && j < progression_plus.length; j++) {
					progression_plus[j].tension = progression_plus[j].type == 
						MajPatterns[p].triads[j - i] ? MajPatterns[p].triad_tension[j - i] : MajPatterns[p].quadriad_tension[j - i];
					progression_plus[j].curr_pattern = MajPatterns[p].name;
					if (!(progression_plus[j].type_coherent && progression_plus[j].degree_coherent)) {
						progression_plus[j].degree = MajPatterns[p].degrees[j - i];
					}
				}
				i += MajPatterns[p].degrees.length - 1;//revisiona
				break;
			}
		}
		
	}
	return progression_plus;
}


