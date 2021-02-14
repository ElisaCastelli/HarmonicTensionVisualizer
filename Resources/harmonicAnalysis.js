import { findKey, modes, getProgDegrees, findSubs, findModalInterchange, findChangeKey, evaluateTension } from './harmonicAnalysis_functions';

/** OVERVIEW:
 *
 */

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
		if (!(progression_plus[i].type_coherent && progression_plus[i].degree_coherent)) {


			// review!!!
			if (progression_plus[i].type == "7") {
				/** OPTION C): CHANGE OF SCALE */ /*
				temp = findChangeKey(progression, priority_keys, progression_plus, i);
				if (temp) {
					progression_plus = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}*/
				/** OPTION A): CHORD SUBSTITUTION*/
				temp = findSubs(progression, priority_keys, progression_plus[i], i);
				if (temp) {
					progression_plus[i] = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}

				/** OPTION B): MODAL INTERCHANGE */
				temp = findModalInterchange(progression, priority_keys, progression_plus[i], i);
				if (temp) {
					progression_plus[i] = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}
				/** OPTION C): CHANGE OF SCALE */
				temp = findChangeKey(progression, priority_keys, progression_plus, i);
				if (temp) {
					progression_plus = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}
			}
			else {

				/** OPTION A): CHORD SUBSTITUTION*/
				temp = findSubs(progression, priority_keys, progression_plus[i], i);
				if (temp) {
					progression_plus[i] = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}

				/** OPTION B): MODAL INTERCHANGE */
				temp = findModalInterchange(progression, priority_keys, progression_plus[i], i);
				if (temp) {
					progression_plus[i] = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}
				/** OPTION C): CHANGE OF SCALE */
				temp = findChangeKey(progression, priority_keys, progression_plus, i);
				if (temp) {
					progression_plus = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}
			}
			/** OPTION D): GENERAL CHORD OUT OF KEY*/
			progression_plus[i].surprise = "D";
			progression_plus[i].event = "out of key";
		}
	}

	console.log("progression analyzed: ", progression_plus);

	/** TENSION PROGRESSION */
	progression_plus = evaluateTension(progression_plus);

	return progression_plus;

}

// NOTES
// - raggruppare pattern per scala?
// - harmony analysis cambia pattern/sostituzioni considerate in base a a scala
// - dovrei fare modo di non controllare i gradi assoluti, ma solo il rapporto tra toniche IMPORTANTE