import State from "../../lib/State.js";
import Timer from "../../lib/Timer.js";
import Color from "../enums/Color.js";
import SoundName from "../enums/SoundName.js";
import { keys, SEPARATOR, sounds, stateStack } from "../globals.js";
import Country from "../objects/Country.js";
import CountrySelectionState from "./CountrySelectionState.js";
import GuessedInformationState from "./GuessedInformationState.js";
import PlayState from "./PlayState.js";

export default class CorrectCountryState extends State {
	constructor(countrySelectionState, selectedCountry) {
		super();

		this.countrySelectionState = countrySelectionState;
		this.playState = this.countrySelectionState.playState;

		this.countrySelectionState.map.countryToGuess = null;
		this.countrySelectionState.map.addCorrectCountry(
			`${selectedCountry}${SEPARATOR}green`
		);

		this.decreaseTimer();
		this.playState.resetNumberWrongGuesses();

		this.colourCorrectOption();

		sounds.play(SoundName.CorrectSelection);
		
		if (this.playState.didWin()){
			this.playState.win();
			return;
		}

		const panelOptions = {
			titleText:  "Nice job! That was correct!",
            messageText: `Keep it up! You're killing it!`,
            continueText: "Press 'Enter' to continue...",
			borderColour: Color.Green,
			panelHeight: 11
		};
		
		stateStack.push(new GuessedInformationState(this.countrySelectionState, panelOptions));
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
	 * Decreases the timer since the player correctly guessed the country.
	 */
	decreaseTimer(){
		this.playState.timer -= Timer.AMOUNT;

		// Set to 0 if timer goes below 0
		if (this.playState.timer <= 0){
			this.playState.timer = 0;
		}
	}

	/**
	 * Colours the correctly selected menu option green.
	 */
	colourCorrectOption(){
		this.countrySelectionState.countriesMenu.selection.items[
			this.countrySelectionState.countriesMenu.selection.currentSelection
		].borderColour = Color.Green;
		this.countrySelectionState.countriesMenu.selection.items[
			this.countrySelectionState.countriesMenu.selection.currentSelection
		].panelColour = Color.Green;
	}
}