import BackgroundName from "../enums/BackgroundName.js";
import BlueCountryName from "../enums/BlueCountryName.js";
import CountryName from "../enums/CountryName.js";
import PickCountry from "../enums/PickCountry.js";
import { timer } from "../globals.js";
import CountryFactory from "../services/CountryFactory.js";
import Background from "./Background.js";
import Country from "./Country.js";

export default class Map {
	// x, y, width = CANVAS_WIDTH, height = CANVAS_HEIGHT
    constructor() {
		// this.x = x;
		// this.y = y;
		// this.width = width;
		// this.height = height;

        // this.allCountriesKeys = Object.values(BlueCountryName);
        this.allCountriesKeys = PickCountry;
		this.totalCountriesForMap = this.allCountriesKeys.length;
		
		this.background = new Background(BackgroundName.EuropeBackground);
        
		this.MAX_COUNTRY_OPTIONS = 4;
		this.countryToGuess = null;
		this.allCountriesOnMap = [];
        this.correctCountries = [];
        this.incorrectCountries = [];
	}

    addCorrectCountry(imageName){
		this.correctCountries.push(CountryFactory.createInstance(imageName));
	}
   
    addIncorrectCountry(imageName){
		this.incorrectCountries.push(CountryFactory.createInstance(imageName));
	}

	/**
	 * Checks if the specified guess is the correct country guess.
	 * @param {*} guess The player's guess.
	 * @returns True if the specified guess is the correct country guess; otherwise false.
	 */
	isCorrectGuess(guess){
		return guess === this.countryToGuess.name;
	}

	update(dt){
		timer.update(dt);
	}

	render(){
		this.background.render();
		this.countryToGuess?.render();
		this.allCountriesOnMap.forEach((country) => country.render());
		this.correctCountries.forEach((country) => country.render());
		this.incorrectCountries.forEach((country) => country.render());
	}
}