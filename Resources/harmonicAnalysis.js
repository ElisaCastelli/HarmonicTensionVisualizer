import { findKey, modes, getProgDegrees, findSubs, findSecondaryDom, findModalInterchange, findChangeKey, evaluateTension } from './harmonicAnalysisFunctions.js';


/** Main function*/
export function harmonyAnalysis(progression) {

	/** PHASE 1): select keys with highest number of compatible chords*/
	let accepted_keys = findKey(progression); // array with selected keys
	if (accepted_keys.length == 0) {
		throw "no key was given";
	}
	let progression_plus;
	let temp;

	/** PHASE 2): choose the key with highest number of correct chords before the first wrong one*/
	// for each accepted_key
	for (let i = 0; i < accepted_keys.length; i++) {
		// exception: give priority to major and minor scales
		if (modes[accepted_keys[i].scale_index].tonal_harmony) {
			accepted_keys[i].points += 10;
		}
		// estimate relative degrees and coherence of each chord in the progression 
		progression_plus = getProgDegrees(progression, accepted_keys[i]);

		//for each chord
		for (let j = 0; j < progression.length; j++) {
			// if I find a chord not coherent with the current accepted key
			if (!(progression_plus[j].type_coherent && progression_plus[j].degree_coherent))
				break;
			accepted_keys[i].points++;
		}
	}
	accepted_keys.sort((a, b) => (a.points > b.points) ? -1 : 1);

	/** PHASE 3): analyze each "wrong" chord, based on the chosen key, with different options*/
	progression_plus = getProgDegrees(progression, accepted_keys[0]);

	// array of all keys that may be found during analysis 
	let priority_keys = [];
	priority_keys.push(accepted_keys[0]);

	for (let i = 0; i < progression_plus.length; i++) {

		// if the chord is wrong:
		if (!(progression_plus[i].type_coherent && progression_plus[i].degree_coherent)) {

			/** OPTION A): SECONDARY DOMINANT */ 
			if (progression_plus[i].type == "7" && i + 1 < progression_plus.length) {
				temp = findSecondaryDom(progression[i], progression[i + 1]);
				if (temp) {
					progression_plus[i] = temp;
					priority_keys.push(temp.curr_key);
					if (!(progression_plus[i + 1].type_coherent && progression_plus[i + 1].degree_coherent)) {
						temp = getProgDegrees([progression[i + 1]], temp.curr_key);
						temp = temp[0];
						progression_plus[i + 1] = temp;
					}
					continue;
				}
			}
				
			/** OPTION B): CHORD SUBSTITUTION*/
			temp = findSubs(progression, priority_keys, progression_plus[i], i);
			if (temp && temp.curr_pattern == "dominant resolution") {
				console.log("situazione da definire")
			}
			else if (temp) {
				progression_plus[i] = temp;
				priority_keys.push(temp.curr_key);
				continue;
			}

			/** OPTION C): MODAL INTERCHANGE */
			temp = findModalInterchange(progression, priority_keys, progression_plus[i], i);
			if (temp) {
				progression_plus[i] = temp;
				priority_keys.push(temp.curr_key);
				continue;
			}
	
			/** OPTION D): CHANGE OF SCALE */
			temp = findChangeKey(progression, priority_keys, progression_plus, i);
			if (temp) {
				progression_plus = temp;
				priority_keys.push(temp.curr_key);
				continue;
			}

			/** OPTION E): GENERAL CHORD OUT OF KEY*/
			progression_plus[i].surprise = "D";
			progression_plus[i].event = "out of key";
		}
	}

	/**PHASE 3b: check again all the chords that are still out of key*/
	for (let i = 0; i < progression_plus.length; i++) {
		if (!(progression_plus[i].type_coherent && progression_plus[i].degree_coherent)) {
			/**try the key of the following chord */
			console.log("da qua!")
			temp = getProgDegrees(progression[i], progression_plus[i + 1].curr_key);
			temp = temp[0];
			console.log(temp)
			if (temp) {
				
				progression_plus[i] = temp;
				continue;
			}
		}
	}

	console.log("progression analyzed: ", progression_plus);

	/** PHASE 4): assign tension to each chord */
	progression_plus = evaluateTension(progression_plus);

	return progression_plus;

}

// NOTES
// - raggruppare pattern per scala?
// - harmony analysis cambia pattern/sostituzioni considerate in base a a scala
// - dovrei fare modo di non controllare i gradi assoluti, ma solo il rapporto tra toniche IMPORTANTE