import State from "../../lib/State.js";
import TitleScreenMenuOptions from "../enums/TitleScreenMenuOptions.js";
import TitleScreenMenuOptionSelected from "../enums/TitleScreenMenuOptionSelected.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine, stateStack, timer } from "../globals.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import GreenCountryName from "../enums/GreenCountryName.js";
import Background from "../objects/Background.js";
import BackgroundName from "../enums/BackgroundName.js";
import Country from "../objects/Country.js";
import Color from "../enums/Color.js";
import GameStateName from "../enums/GameStateName.js";
import FontName from "../enums/FontName.js";
import TransitionState from "./TransitionState.js";
import PlayState from "./PlayState.js";
import BlueCountryName from "../enums/BlueCountryName.js";
import RedCountryName from "../enums/RedCountryName.js";
import TimerId from "../enums/TimerId.js";
import PreviousRecordsState from "./PreviousRecordsState.js";
import HowToPlayState from "./HowToPlayState.js";
import Textbox from "../user-interface/elements/Textbox.js";
import SoundName from "../enums/SoundName.js";

export default class TitleScreenState extends State {
	constructor() {
		super();

		this.menuOptions = [TitleScreenMenuOptions.PlayGame, TitleScreenMenuOptions.PreviousRecords];

		// Currently selected menu item.
		this.currentMenuOption = TitleScreenMenuOptionSelected.Selected;

		// Colours we'll use to change the title text.
		this.menuTitleColours = [
			Color.Green,
			Color.Blue,
			Color.Red
		];

		this.titleLetters = ['C', 'o', 'u', 'n', 't', 'r', 'y',
							 'G', 'u', 'e', 's', 's', 'e', 'r'];
		
		// Used for the 'Guesser' to be on a new line
	    this.offsetToNewLine = 7;

		this.background = new Background(BackgroundName.EuropeBackground);
        this.countries = [];

        this.countriesKeys = Object.values(GreenCountryName);
		this.originalValue = this.countriesKeys.length;

        this.addedFilledCountryNames = [];

		// this.howToPlayTextbox = new Textbox(
		// 	(CANVAS_WIDTH - 150) / 32,
		// 	(CANVAS_HEIGHT - 125) / 32,
		// 	100, 
		// 	2,
		// 	"H",
		// 	{
		// 		isAdvanceable: false,
		// 		fontSize: 50,
		// 		borderColour: Color.Blue
		// 	}
		// );
	}

	enter(parameters){
		this.transitionAlpha = 0;
		this.autoFillCountry();
		this.startColourTimer();

		// Create the textbox for the H, meaning how to play, or help
		this.howToPlayTextbox = new Textbox(
			(CANVAS_WIDTH - 125) / 32,
			(CANVAS_HEIGHT - 125) / 32,
			100, 
			3,
			"H",
			{
				isAdvanceable: false,
				fontSize: 50,
				shouldCenterText: true,
				borderColour: Color.Blue
			}
		);

		// Add a timer for x duration, tween the textbox to go up and down
		timer.addTask(() => {
			timer.tween(
				this.howToPlayTextbox.position,
				['y'],
				[this.howToPlayTextbox.position.y - 50],
				0.35,
				() => {
					timer.tween(
						this.howToPlayTextbox.position,
						['y'],
						[this.howToPlayTextbox.position.y + 50],
						0.35
					)
				}
			)
			
		}, 7);
	}

	update(dt){
		if (this.inTransition) {
			return;
		}

		if (keys.w || keys.s) {
			keys.w = keys.s = false;

			this.currentMenuOption = this.currentMenuOption === TitleScreenMenuOptionSelected.Selected 
								   ? TitleScreenMenuOptionSelected.NotSelected 
								   : TitleScreenMenuOptionSelected.Selected;
			
			sounds.play(SoundName.MenuSelection);					   
		}

		if (keys.Enter) {
			keys.Enter = false;

			this.startTransition();
		}

		// Show how to play page 
		if (keys.h){
			keys.h = false;

			sounds.play(SoundName.HowToPlaySelect);

			stateStack.pop();
			stateStack.push(new HowToPlayState());
		}

		if (this.allCountriesFilled()){
			this.countries = [];
			this.addedFilledCountryNames = [];
			this.countriesKeys = Object.values(GreenCountryName);
			this.originalValue = this.countriesKeys.length;
			this.autoFillCountriesTimer.clear();
			this.autoFillCountry();
		}

		// this.howToPlayTextbox?.update();
		timer.update(dt);
	}

	addCountry(imageName){
		this.countries.push(new Country(imageName));
	}

	allCountriesFilled(){
		return this.countries.length === this.originalValue;
	}

	autoFillCountry(){
		this.autoFillCountriesTimer = timer.addTask(() => {
			let randomCountry = this.countriesKeys[Math.floor(Math.random() * this.countriesKeys.length)];
			
			this.addCountry(randomCountry);
			this.countriesKeys.splice(this.countriesKeys.indexOf(randomCountry), 1)
			this.addedFilledCountryNames.push(randomCountry);
		}, 1);
	}

	render(){
		context.save();
		this.background.render();
		this.drawDarkBackground();
		this.countries.forEach((country) => country.render());
		this.drawTitleText();
		this.drawMenu();
		this.drawTransitionOverlay();
		this.howToPlayTextbox?.render();
		context.restore();
	}

	async startTransition() {
		if (this.currentMenuOption === TitleScreenMenuOptionSelected.Selected) {
			TransitionState.fade(() => {
				stateStack.pop();
				stateStack.push(new PlayState());
			});
			
			this.clearTimerTasks();
		}
		else {
			this.clearTimerTasks();
			stateStack.pop();
			// stateStack.push(new PreviousRecordsState(this));
			stateStack.push(new PreviousRecordsState({
				background: this.background,
				darkBackground: this.drawDarkBackground,
				countries: this.countries
			}));
		}

		// Disable input during transition.
		this.inTransition = true;
	}

	/**
	 * Clears the timer tasks before moving into the the next state
	 */
	clearTimerTasks(){
		// Get index of the task for the auto fill countries
		// const index = timer.tasks.indexOf(this.autoFillCountriesTimer);

		// delete this.colourTimer.;
		// delete this.autoFillCountriesTimer;

		// // Delete the task for the auto fill countries
		// timer.tasks.splice(index, 1);

		this.colourTimer.clear();
		this.autoFillCountriesTimer.clear();

		// timer.tasks.forEach((task, index) => {
		// 	// Delete the task for the auto fill countries
		// 	if (task.id === TimerId.Important){
		// 		timer.tasks[index].clear();
		// 	}
		// });
	}

	/**
	 * Keep the background and tiles a little darker to emphasize foreground.
	 */
	drawDarkBackground() {
		context.fillStyle = 'rgb(0, 0, 0, 0.3)';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	/**
	 * Draw the transition overlay rectangle. It is normally fully transparent,
	 * unless we're moving to a new state, in which case it slowly becomes opaque.
	 */
	drawTransitionOverlay() {
		context.fillStyle = `rgb(255, 255, 255, 0)`;
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	drawTitleText() {
		const offSet = -200;
		const menuWidth = 900;
		const menuHeight = 325;

		// Draw a semi-transparent rectangle behind the title.
		context.fillStyle = 'rgb(255, 255, 255, 0.7)';

		roundedRectangle(
			context,
			(CANVAS_WIDTH / 2) - menuWidth / 2,
			CANVAS_HEIGHT / 4 - 150,
			menuWidth,
			menuHeight,
			25,
			true,
			false,
		);

		context.font = `125px ${FontName.Joystix}`;
		context.textBaseline = 'middle';
		context.textAlign = 'center';

		let textColorIndex = 0;
		let currentLetterIndex = 0;

		// Print MATCH 3 letters in their current colors based on the timer.
		for (let i = 0; i < this.titleLetters.length; i++) {
			// Shadow.
			// context.fillStyle = `rgb(34, 32, 52, 1)`;
			// context.fillText(this.titleLetters[i][0], CANVAS_WIDTH / 2 + 50 * i - 125, CANVAS_HEIGHT / 2 + offSet + 60);

			if (textColorIndex >= this.menuTitleColours.length){
				textColorIndex = 0;
			}

			context.fillStyle = this.menuTitleColours[textColorIndex];

			if (currentLetterIndex === this.offsetToNewLine){
				currentLetterIndex = 0;
			}

			if (i < this.offsetToNewLine){
				context.fillText(this.titleLetters[i][0], ((CANVAS_WIDTH / 2) - menuWidth / 4 + 50) + 100 * currentLetterIndex - 130, ((CANVAS_HEIGHT / 2) - menuHeight / 4) + offSet - 25);
			}
			else {
				context.fillText(this.titleLetters[i][0], ((CANVAS_WIDTH / 2) - menuWidth / 4 + 50) + 100 * currentLetterIndex - 130, ((CANVAS_HEIGHT / 2) - menuHeight / 4) + offSet + 125);
			}

			textColorIndex++;
			currentLetterIndex++;
		}
	}

	/**
	 * Draws "Start" and "Quit Game" text over semi-transparent rectangles.
	 */
	drawMenu() {
		const offSet = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 190 };
		const menuWidth = 800;
		const menuHeight = 300;
		const textOffsetOption1 = 100;
		const textOffsetOption2 = 360;

		// Draw rectangle behind menu options.
		context.fillStyle = 'rgb(255, 255, 255, 0.7)';
		// context.fillStyle = 'red';

		roundedRectangle(
			context,
			offSet.x - menuWidth / 2,
			offSet.y - menuHeight / 2 + 75,
			menuWidth,
			menuHeight,
			25,
			true,
			false,
		);

		this.drawMenuOption(this.menuOptions[0], offSet.x, offSet.y + 30, 0)
		this.drawMenuOption(this.menuOptions[1], offSet.x, offSet.y + 145, 1)

		// this.menuOptions.forEach((menuOption, index) => {
		// 	this.drawMenuOption(menuOption, offSet.x, offSet.y + 70 * index * 3, index)
		// });
	}

	drawMenuOption(text, x, y, index) {
		context.save();
		context.font = `65px ${FontName.Joystix}`;
		this.drawTextShadow(text, x, y);

		if (this.currentMenuOption === index) {
			context.fillStyle = Color.Blue;
		}
		else {
			context.fillStyle = Color.UnselectedOption;
		}

		context.fillText(text, x, y);
		context.restore();
	}

	/**
	 * Helper function for drawing just text backgrounds; draws several layers
	 * of the same text over top of one another for a thicker shadow.
	 */
	drawTextShadow(text, x, y) {
		context.save();
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillStyle = Color.TextShadow;
		context.fillText(text, x + 2, y + 1);
		context.fillText(text, x + 1, y + 1);
		context.fillText(text, x + 0, y + 1);
		context.fillText(text, x + 1, y + 2);
		context.restore();
	}

	startColourTimer() {
		this.colourTimer = timer.addTask(() => {
			// Shift every colour to the next, looping the last to the front.
			this.menuTitleColours = this.menuTitleColours.slice(1).concat(this.menuTitleColours.slice(0, 1));
		}, 1);
	}
}
