import TitleScreenMenuOptions from "../src/enums/TitleScreenMenuOptions.js";
import { MAX_PREVIOUS_RECORDS } from "../src/globals.js";

/**
 * This class is responsible for reading and writing the high scores
 * of our game to and from the browser's local storage. Local storage
 * is a simple way to store small key/value pairs (kind of like cookies)
 * for a particular domain on your browser.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */
export default class PreviousRecordsManager {
	static loadPreviousRecords() {
		/**
		 * Since the high scores are being saved as a string containing JSON,
		 * we must parse the string into a valid JavaScript object in order
		 * to manipulate it.
		 */
		const highScores = JSON.parse(localStorage.getItem(TitleScreenMenuOptions.PreviousRecords)) ?? [];

		if (highScores.length === 0) {
			// If there are no scores, we want to populate the scores array with placeholders.
			for (let i = MAX_PREVIOUS_RECORDS; i > 0; i--) {
				highScores.push({ 
					correctCountries: 0, 
					time: 0 
				});
			}

			/**
			 * Since the high scores are represented as a JavaScript object,
			 * we must turn the object into a string in order to be able to
			 * save it using local storage.
			 */
			localStorage.setItem(TitleScreenMenuOptions.PreviousRecords, JSON.stringify(highScores));
		}

		return highScores;
	}

	static addPreviousRecord(correctCountries, time) {
		let previousRecords = PreviousRecordsManager.loadPreviousRecords();

		// Add the new score to the high scores array.
		previousRecords.push({ 
			correctCountries: correctCountries, 
			time: time 
		});
		// previousRecords.push({ name: name, score: score });

		/**
		 * Sort the scores from highest to lowest.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
		 */
		previousRecords = previousRecords.sort((a, b) => b.correctCountries - a.correctCountries);

		/**
		 * Only keep the top 10 scores.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
		 */
		previousRecords = previousRecords.slice(0, MAX_PREVIOUS_RECORDS);

		/**
		 * Since the high scores are represented as a JavaScript object,
		 * we must turn the object into a string in order to be able to
		 * save it using local storage.
		 */
		localStorage.setItem(TitleScreenMenuOptions.PreviousRecords, JSON.stringify(previousRecords));
	}
}
