import State from "../../lib/State.js";
import Timer from "../../lib/Timer.js";
import Color from "../enums/Color.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, keys, SEPARATOR, sounds, stateStack } from "../globals.js";
import Country from "../objects/Country.js";
import CountrySelectionState from "./CountrySelectionState.js";
import GuessedInformationState from "./GuessedInformationState.js";
import PlayState from "./PlayState.js";

export default class IncorrectCountryState extends State {
	constructor(countrySelectionState, selectedCountry) {
		super();

		this.countrySelectionState = countrySelectionState;
		this.playState = this.countrySelectionState.playState;

		this.countrySelectionState.map.addIncorrectCountry(
			`${this.countrySelectionState.map.countryToGuess.name}${SEPARATOR}red`
		);

		this.increaseTimer();

		// Increase the number of wrong guesses in a row
		this.playState.addWrongGuess();

		if (this.shouldLoseLife()){
			this.loseLife();
		}

		this.colourIncorrectOption();
		this.processColouringCorrectOption();

		sounds.play(SoundName.IncorrectSelection);

		if (this.playState.didLose()){
			this.playState.lose();
			return;
		}

		// Make the first letter of the country uppercase
		const correctCountryName = 
		 			this.countrySelectionState.map.countryToGuess.name.charAt(0).toUpperCase()
		  		  + this.countrySelectionState.map.countryToGuess.name.slice(1);

		const panelOptions = {
			titleText:  "Oops! That was the wrong country...",
            messageText: `The correct country was ${correctCountryName}!\nMaybe next time trying using a hint!`,
            continueText: "Press 'Enter' to continue...",
			borderColour: Color.Red,
			panelHeight: 15
		};
		
		stateStack.push(new GuessedInformationState(this.countrySelectionState, panelOptions));
		
		this.countrySelectionState.map.countryToGuess = null;
	}

	update(dt){
		if (keys.Enter){
			keys.Enter = false;

			stateStack.popAllUntilInstanceOf(PlayState);
			stateStack.push(new CountrySelectionState(this.playState, this.countrySelectionState.map));
		}

		this.countrySelectionState.update(dt);
	}

	render(){
		// this.countrySelectionState.render();
	}

	/**
	 * Increase the timer since the player wrongly guessed the country.
	 */
	increaseTimer(){
		this.playState.timer += Timer.AMOUNT;
	}

	/**
	 * Checks if the number of wrong guesses exceeds the number that should make the player lose a life.
	 * @returns True if the player should lose a life; otherwise false.
	 */
	shouldLoseLife(){
		return this.playState.numberWrongGuessesInARow >= this.playState.NUMBER_TO_LOSE_A_LIFE;
	}

	/**
	 * Deducts a life from the user and resets the number of wrong guesses.
	 */
	loseLife(){
		this.playState.numberOfLives--;
		this.playState.numberWrongGuessesInARow = 0;
	}

	/**
	 * Colours the incorrect selected menu option red.
	 */
	colourIncorrectOption(){
		this.countrySelectionState.countriesMenu.selection.items[
			this.countrySelectionState.countriesMenu.selection.currentSelection
		].borderColour = Color.Red;
		this.countrySelectionState.countriesMenu.selection.items[
			this.countrySelectionState.countriesMenu.selection.currentSelection
		].panelColour = Color.Red;
	}

	/**
	 * Processes the index of the correct country option and colours the border.
	 */
	processColouringCorrectOption(){
		let index = this.getIndexOfCorrectCountry();

		if (index !== null){
			this.countrySelectionState.countriesMenu.selection.items[
				index
			].borderColour = Color.Green;
		}
	}

	/**
	 * Gets the index in the menu option items of the correct country.
	 * @returns The index in the menu option items of the correct country.
	 */
	getIndexOfCorrectCountry(){
		let index = null;
		
		this.countrySelectionState.countriesMenu.selection.items.forEach((item, itemIndex) => {
			if (item.text.toLowerCase() === this.countrySelectionState.map.countryToGuess.name.toLowerCase()){
				index = itemIndex;
				return itemIndex;
			}
		});

		return index;
	}
}