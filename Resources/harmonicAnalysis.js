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
	let priority_keys;
	let finalProg = progression_plus;
	let finalKey;
	accepted_keys.sort((a, b) => (a.points > b.points) ? -1 : 1);
	console.log("keys that will be tested: ", accepted_keys);

	/** PHASE 2): analyze each possible key, counting the effective number of wrong notes found*/
	for (let k = 0; k < accepted_keys.length; k++) {
		progression_plus = getProgDegrees(progression, accepted_keys[k]);
		accepted_keys[k].points = 0;
		priority_keys = [];
		priority_keys.push(accepted_keys[0]);

		/** analyze each "wrong" chord, based on the chosen key, with different options*/
		for (let i = 0; i < progression_plus.length; i++) {

			// if the chord is wrong:
			if (!(progression_plus[i].type_coherent && progression_plus[i].degree_coherent)) {

				/** OPTION A): SECONDARY DOMINANT */ 
				if (progression_plus[i].type == "7" && i + 1 < progression_plus.length) {
					temp = findSecondaryDom(progression_plus[i], progression_plus[i + 1]);
					if (temp) {
						accepted_keys[k].points++;
						progression_plus[i] = temp;
						progression_plus[i].surprise = "A";
						priority_keys.push(temp.curr_key);
						if (!(progression_plus[i + 1].type_coherent && progression_plus[i + 1].degree_coherent)) {
							temp = getProgDegrees([progression[i + 1]], temp.curr_key);
							temp = temp[0];
							progression_plus[i + 1] = temp;
							progression_plus[i + 1].surprise = "A";
						}
						continue;
					}
				}
					
				/** OPTION B): CHORD SUBSTITUTION*/
				temp = findSubs(progression, priority_keys, progression_plus, i);
				if (temp) {
					progression_plus[i] = temp;
					priority_keys.push(temp.curr_key);
					continue;
				}

				/** OPTION C): MODAL INTERCHANGE */
				temp = findModalInterchange(progression, priority_keys, progression_plus[i], i);
				if (temp) {
					progression_plus[i] = temp;
					priority_keys.push(temp.curr_key);
					accepted_keys[k].points++;
					continue;
				}
		
				/** OPTION D): CHANGE OF SCALE */
				temp = findChangeKey(progression, priority_keys, progression_plus, i);
				if (temp) {
					progression_plus = temp;
					priority_keys.push(temp.curr_key);
					accepted_keys[k].points++;
					continue;
				}

				/** OPTION E): GENERAL CHORD OUT OF KEY*/
				progression_plus[i].surprise = "D";
				progression_plus[i].event = "out of key";
				accepted_keys[k].points++;
				continue;
			}
			// if first chord is in key and is tonic, give priority
			if (i == 0 && progression_plus[i].tonic == "I") {
				accepted_keys[k].points--;
			}
		}

		/**PHASE 2b: check again all the chords that are still out of key*/
		for (let i = 0; i < progression_plus.length; i++) {
			// rivaluta if, prima era generico e sistemava più robe, prova a rimetterlo ma escludere tritoni
			if (progression_plus[i].event == "out of key") {
				/**try the key of the following chord */
				temp = getProgDegrees(progression_plus[i], progression_plus[i + 1].curr_key);
				temp = temp[0];
				if (temp) {
					progression_plus[i] = temp;
					continue;
				}
			}
		}
		if (k == 0) {
			finalKey = accepted_keys[k];
			finalProg = progression_plus;
		} else if (accepted_keys[k].points < finalKey.points){
			finalKey = accepted_keys[k];
			finalProg = progression_plus;
		} else if (accepted_keys[k].points == finalKey.points && 
			modes[accepted_keys[k].scale_index].tonal_harmony &&
			! modes[finalKey.scale_index].tonal_harmony) {
			finalKey = accepted_keys[k];
			finalProg = progression_plus;
		}
	}
	console.log("tested keys: ", accepted_keys)
	accepted_keys.sort((a, b) => (a.points < b.points) ? -1 : 1);
	console.log("tested keys: ", accepted_keys)

	/** PHASE 3): assign tension to each chord */
	finalProg = evaluateTension(finalProg);
	console.log("progression analyzed: ", finalProg);
	return finalProg;

}