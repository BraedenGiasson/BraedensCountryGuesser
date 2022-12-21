import { getRandomNumber, getRandomPositiveInteger, getRandomPositiveNumber, pickRandomElement } from "../../lib/RandomNumberHelpers.js";
import State from "../../lib/State.js";
import Color from "../enums/Color.js";
import CountryHint from "../enums/CountryHint.js";
import CountryName from "../enums/CountryName.js";
import PickCountry from "../enums/PickCountry.js";
import { CANVAS_WIDTH, context, keys, OFFSET, SEPARATOR, stateStack, timer } from "../globals.js";
import CountryFactory from "../services/CountryFactory.js";
import Menu from "../user-interface/elements/Menu.js";
import Textbox from "../user-interface/elements/Textbox.js";
import CorrectCountryState from "./CorrectCountryState.js";
import IncorrectCountryState from "./IncorrectCountryState.js";

export default class CountrySelectionState extends State {
	static COUNTRY_OPTIONS_COUNT = 4;

	constructor(playState, map) {
		super();

		this.playState = playState;
		this.map = map;

		this.hintsTextbox = null;
		this.hintUsed = false;

		const items = this.generateCountyOptions(map);
		// this.map.countryToGuess = this.pickCountryToGuess(items);

		// Create the options menu
		this.countriesMenu = new Menu(
			Menu.COUNTRIES_MENU.x,
			Menu.COUNTRIES_MENU.y,
			Menu.COUNTRIES_MENU.width,
			Menu.COUNTRIES_MENU.height,
			items
		);
	}

	generateCountyOptions(map){
		const items = [];

		const chooseCountryIndex = getRandomPositiveInteger(0, this.map.allCountriesKeys.length - 1);
		const countryPick = this.map.allCountriesKeys[chooseCountryIndex];

		this.map.countryToGuess = this.createGuessCountry(countryPick.CountryName);

		let possibleCountries = countryPick.Difficulty.Medium;

		for (let i = 0; i < this.playState.NUMBER_OF_CLOSE_COUNTRIES; i++) {
			const randomDifficultyCountryIndex = getRandomPositiveInteger(0, possibleCountries.length - 1);
			const difficultyCountryPick = possibleCountries[randomDifficultyCountryIndex];

			possibleCountries.splice(randomDifficultyCountryIndex, 1);
			
			items.push({ 
				text: difficultyCountryPick, 
				onSelect: () => this.processGuess()
			});
		}

		this.map.allCountriesKeys.splice(chooseCountryIndex, 1);

		let randomCountryIndex = getRandomPositiveInteger(0, map.allCountriesKeys.length - 1);
		let randomCountryName = map.allCountriesKeys[randomCountryIndex].CountryName;

		while (this.containsCountryName(items, randomCountryName)) {
			randomCountryIndex = getRandomPositiveInteger(0, map.allCountriesKeys.length - 1);
			randomCountryName = map.allCountriesKeys[randomCountryIndex].CountryName;
		}

		items.push({ 
			text: randomCountryName, 
			onSelect: () => this.processGuess()
		});

		let randomIndex = getRandomPositiveInteger(0, map.MAX_COUNTRY_OPTIONS);

		items.splice(randomIndex, 0, { 
			text: countryPick.CountryName, 
			onSelect: () => this.processGuess()
		});

		// items.push({ 
		// 	text: removeSeparator[0], 
		// 	onSelect: () => this.processGuess()
		// });

		// /**
		//  * Determine how many country options to show.
		//  * 4 if there's still more than 4 countries left.
		//  * Otherwise just show the amount that's left.
		//  */
		// const optionsSize = map.allCountriesKeys.length >= CountrySelectionState.COUNTRY_OPTIONS_COUNT
		// 				  ? CountrySelectionState.COUNTRY_OPTIONS_COUNT
		// 				  : map.allCountriesKeys.length;

		// for (let i = 0; i < optionsSize; i++) {
		// 	const countryName = pickRandomElement(map.allCountriesKeys);
		// 	const removeSeparator = countryName.split(SEPARATOR);

		// 	// Add the country as an option
		// 	items.push({ 
		// 		text: removeSeparator[0], 
		// 		onSelect: () => this.processGuess()
		// 	});
		// }

		return items;
	}

	containsCountryName(items, countryName){
		return items.some((item) => item.text === countryName);
	}

	createGuessCountry(countryName){
		const addSeparator = `${countryName}${SEPARATOR}blue`
		
		// Remove the country to guess from the list of countries so it doesn't show up again
		this.map.allCountriesKeys = this.map.allCountriesKeys.filter((item) => item !== addSeparator);

		return CountryFactory.createInstance(addSeparator);
	}

	/**
	 * 
	 */
	processGuess(){
		const selectedCountry = this.countriesMenu.selection.items[this.countriesMenu.selection.currentSelection].text;

		if (this.map.isCorrectGuess(selectedCountry)){
			stateStack.push(new CorrectCountryState(this, selectedCountry))
		}
		else {
			stateStack.push(new IncorrectCountryState(this, selectedCountry))
		}
	}

	update(dt){
		this.playState.update(dt);
		this.map.update(dt);
		this.countriesMenu.update();
		this.hintsTextbox?.update();

		if (keys.h){
			keys.h = false;

			if (this.playState.hintsLeft !== 0
				&& this.hintsTextbox === null
				&& !this.hintUsed)
			{
				const getHint = this.getHintForCountryToGuess();

				this.hintsTextbox = new Textbox(
					((CANVAS_WIDTH + OFFSET.x) / 2 - (Textbox.HINTS_PANEL.width / 2)) / 32,
					// (CANVAS_WIDTH/ 2 - Textbox.HINTS_PANEL.width / 2) / 32,
					-1,
					Textbox.HINTS_PANEL.width,
					Textbox.HINTS_PANEL.height,
					getHint,
					{
						isAdvanceable: false,
						fontSize: 30,
						borderColour: Color.Blue
					}
				);

				this.hintUsed = true;
				this.playState.hintsLeft--;

				timer.tween(
					this.hintsTextbox.position,
					['y'],
					[20],
					1.25,
					() => {
						// Wait 5 seconds then get rid of notification
						timer.wait(
							24,
							() => {
								timer.tween(
									this.hintsTextbox.position,
									['y'],
									[-300],
									1.25,
									() => this.hintsTextbox = null
								)
							})
					}
				)
			}
		}
	}

	/**
	 * Gets the hint for the country to guess.
	 * @returns 
	 */
	getHintForCountryToGuess(){
		switch (this.map.countryToGuess.name) {
			case CountryName.ÅlandIslands:
				return CountryHint.ÅlandIslands;
			case CountryName.Albania:
				return CountryHint.Albania;
			case CountryName.Algeria:
				return CountryHint.Algeria;
			case CountryName.Andorra:
				return CountryHint.Andorra;
			case CountryName.Armenia:
				return CountryHint.Armenia;
			case CountryName.Austria:
				return CountryHint.Austria;
			case CountryName.Azerbaijan:
				return CountryHint.Azerbaijan;
			case CountryName.Belarus:
				return CountryHint.Belarus;
			case CountryName.Belgium:
				return CountryHint.Belgium;
			case CountryName.BosniaAndHerzegovina:
				return CountryHint.BosniaAndHerzegovina;
			case CountryName.Bulgaria:
				return CountryHint.Bulgaria;
			case CountryName.Croatia:
				return CountryHint.Croatia;
			case CountryName.Cyprus:
				return CountryHint.Cyprus;
			case CountryName.CzechRepublic:
				return CountryHint.CzechRepublic;
			case CountryName.Denmark:
				return CountryHint.Denmark;
			case CountryName.Estonia:
				return CountryHint.Estonia;
			case CountryName.FaroeIslands:
				return CountryHint.FaroeIslands;
			case CountryName.Finland:
				return CountryHint.Finland;
			case CountryName.France:
				return CountryHint.France;
			case CountryName.Georgia:
				return CountryHint.Georgia;
			case CountryName.Germany:
				return CountryHint.Germany;
			case CountryName.Greece:
				return CountryHint.Greece;
			case CountryName.Hungary:
				return CountryHint.Hungary;
			case CountryName.Iceland:
				return CountryHint.Iceland;
			case CountryName.Iran:
				return CountryHint.Iran;
			case CountryName.Iraq:
				return CountryHint.Iraq;
			case CountryName.Ireland:
				return CountryHint.Ireland;
			case CountryName.Israel:
				return CountryHint.Israel;
			case CountryName.Italy:
				return CountryHint.Italy;
			case CountryName.Jordan:
				return CountryHint.Jordan;
			case CountryName.Kazakhstan:
				return CountryHint.Kazakhstan;
			case CountryName.Kosovo:
				return CountryHint.Kosovo;
			case CountryName.Latvia:
				return CountryHint.Latvia;
			case CountryName.Lebanon:
				return CountryHint.Lebanon;
			case CountryName.Liechtenstein:
				return CountryHint.Liechtenstein;
			case CountryName.Lithuania:
				return CountryHint.Lithuania;
			case CountryName.Luxembourg:
				return CountryHint.Luxembourg;
			case CountryName.Moldova:
				return CountryHint.Moldova;
			case CountryName.Montenegro:
				return CountryHint.Montenegro;
			case CountryName.Morocco:
				return CountryHint.Morocco;
			case CountryName.Netherlands:
				return CountryHint.Netherlands;
			case CountryName.NorthMacedonia:
				return CountryHint.NorthMacedonia;
			case CountryName.Norway:
				return CountryHint.Norway;
			case CountryName.Palestine:
				return CountryHint.Palestine;
			case CountryName.Poland:
				return CountryHint.Poland;
			case CountryName.Portugal:
				return CountryHint.Portugal;
			case CountryName.Romania:
				return CountryHint.Romania;
			case CountryName.Russia:
				return CountryHint.Russia;
			case CountryName.SaudiArabia:
				return CountryHint.SaudiArabia;
			case CountryName.Serbia:
				return CountryHint.Serbia;
			case CountryName.Slovakia:
				return CountryHint.Slovakia;
			case CountryName.Slovenia:
				return CountryHint.Slovenia;
			case CountryName.Spain:
				return CountryHint.Spain;
			case CountryName.Sweden:
				return CountryHint.Sweden;
			case CountryName.Switzerland:
				return CountryHint.Switzerland;
			case CountryName.Syria:
				return CountryHint.Syria;
			case CountryName.Tunisia:
				return CountryHint.Tunisia;
			case CountryName.Turkey:
				return CountryHint.Turkey;
			case CountryName.Ukraine:
				return CountryHint.Ukraine;
			case CountryName.UnitedKingdom:
				return CountryHint.UnitedKingdom;
			default:
				break;
		}
	}

	render(){
		this.playState.render();
		this.countriesMenu.render();
		this.hintsTextbox?.render();
	}
}