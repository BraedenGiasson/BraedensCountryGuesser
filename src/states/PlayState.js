import { pickRandomElement } from "../../lib/RandomNumberHelpers.js";
import State from "../../lib/State.js";
import BackgroundName from "../enums/BackgroundName.js";
import BlueCountryName from "../enums/BlueCountryName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateStack, timer } from "../globals.js";
import Background from "../objects/Background.js";
import Country from "../objects/Country.js";
import Map from "../objects/Map.js";
import Menu from "../user-interface/elements/Menu.js";
import Panel from "../user-interface/elements/Panel.js";
import CountrySelectionState from "./CountrySelectionState.js";
import DialogueState from "./DialogueState.js";
import GameOverState from "./GameOverState.js";
import GameStatsState from "./GameStatsState.js";
import TitleScreenState from "./TitleScreenState.js";
import TransitionState from "./TransitionState.js";
import VictoryState from "./VictoryState.js";

export default class PlayState extends State {
	constructor() {
		super();

		this.MAX_HINTS = 10;
		this.STARTING_LIVES = 3;
		this.NUMBER_TO_LOSE_A_LIFE = 3;
		this.NUMBER_OF_CLOSE_COUNTRIES = 2;
		// this.numberOfLives = 1;
		this.numberOfLives = this.STARTING_LIVES;
		this.numberWrongGuessesInARow = 0;
		this.timer = 0;
		this.hintsLeft = this.MAX_HINTS;
		this.countries = [];
		this.map = new Map();
		this.paused = false;
		this.pausedToExit = false;
	}

	enter(){
		// Show user message before continuing
		stateStack.push(new DialogueState(
			`Enjoy the game! If you don't know how to play, go back to the main menu and click 'h'!`,
			Panel.TOP_DIALOGUE,
			() => {
				this.startTimer();
				this.gameStats = new GameStatsState(this, this.map);
				stateStack.push(new CountrySelectionState(this, this.map));
			}
		));
		// stateStack.push(new CountrySelectionState(this, this.map));
	}

	didWin(){
		// return this.map.correctCountries.length === 1;
		return this.map.correctCountries.length === this.map.totalCountriesForMap
		    && this.map.allCountriesKeys.length === 0;
	}

	didLose(){
		return this.numberOfLives === 0;
	}

	update(dt){		
		if (this.paused && !this.pausedToExit){
			if (keys.p) {
				keys.p = false;
				this.paused = false;
				// sounds.pause.play();
			}
			else {
				return;
			}
		}
		else if (keys.p && !this.pausedToExit){
			keys.p = false;
			this.paused = true;
			// sounds.pause.play();
			return;
		}

		if (this.pausedToExit){
			this.exitGameMenu?.update(dt);
			return;
		}
		// Show how to play page 
		else if (keys.Escape){
			keys.Escape = false;
			this.pausedToExit = true;

			// sounds.play(SoundName.HowToPlaySelect);

			// Create the options menu
			this.exitGameMenu = new Menu(
				Menu.EXIT_GAME_MENU.x,
				Menu.EXIT_GAME_MENU.y,
				Menu.EXIT_GAME_MENU.width,
				Menu.EXIT_GAME_MENU.height,
				[
					{ 
						text: "No", 
						onSelect: () => this.processExitGame()
					},
					{
						text: "Yes", 
						onSelect: () => this.processExitGame()
					}
				],
				{
					title: 'Exit game?',
					orientation: 'horizontal',
					isExitGameMenu: true
				}
			);
		}

		if (this.didWin()){
			this.win();
		}
		else if (this.didLose()){
			this.lose();
		}

		timer.update(dt);
		this.map.update(dt);
		this.gameStats?.update(dt);
	}

	render(){
		this.map.render();
		this.gameStats?.render();
		this.exitGameMenu?.render();

		if (this.paused) {
			context.save();
			context.font = "200px Joystix";
			context.fillStyle = "white";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			// context.fillText(`⏸`, CANVAS_WIDTH /2 + 200, CANVAS_HEIGHT * 0.5);
			context.fillText(`⏸`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
			context.restore();
		}
	}

	win(){
		timer.clear();
		// stateStack.pop();
		stateStack.push(new VictoryState(this,
			{
				titleMessage: "Damn, you guessed every country correctly!",
				messageText: "Keep on killing it!"
			})
		);
	}

	lose(){
		timer.clear();
		// stateStack.pop();
		stateStack.push(new GameOverState(this, 
			{
				titleMessage: "Oh no... You tried your best!",
				messageText: "Don't give up, it's part of the learning process!"
			})
		);
	}

	startTimer() {
		timer.addTask(() => this.timer++, 4);
	}

	addWrongGuess(){
		this.numberWrongGuessesInARow++;
	}

	resetNumberWrongGuesses(){
		this.numberWrongGuessesInARow = 0;
	}

	/**
	 * 
	 */
	processExitGame(){
		const selectedOptionText = this.exitGameMenu.selection.items[this.exitGameMenu.selection.currentSelection].text;

		if (selectedOptionText === 'Yes'){
			this.pausedToExit = false;
			this.paused = false;

			TransitionState.fade(() => {
				stateStack.clear();
				stateStack.push(new TitleScreenState());
			});
		}
		else if (selectedOptionText === 'No'){
			this.pausedToExit = false;
			this.paused = false;
			keys.Escape = false;
			this.exitGameMenu = null;
		}
	}
}
