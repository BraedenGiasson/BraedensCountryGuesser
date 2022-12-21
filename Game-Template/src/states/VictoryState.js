import State from "../../lib/State.js";
import FontName from "../enums/FontName.js";
import TitleScreenMenuOptions from "../enums/TitleScreenMenuOptions.js";
import TitleScreenMenuOptionSelected from "../enums/TitleScreenMenuOptionSelected.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, stateStack, timer, OFFSET, sounds } from "../globals.js";
import TransitionState from "./TransitionState.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import Color from "../enums/Color.js";
import PlayState from "./PlayState.js";
import TitleScreenState from "./TitleScreenState.js";
import SoundName from "../enums/SoundName.js";

export default class VictoryState extends State {
	constructor(playState, options = {}) {
		super();

		this.playState = playState;
		this.options = options;

		this.menuOptions = [TitleScreenMenuOptions.PlayAgain, TitleScreenMenuOptions.MainMenu];
	
		// Currently selected menu item.
		this.currentMenuOption = TitleScreenMenuOptionSelected.Selected;

		sounds.play(SoundName.GameWin);

		this.titleTextLines = this.getLines(options.titleMessage, CANVAS_WIDTH - 500);
		this.messageTextLines = this.getLines(options.messageText ?? null, CANVAS_WIDTH - 200);
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

		timer.update(dt);
	}

	render(){
		context.save();
		this.drawDarkBackground();
		this.drawTitleText();
		this.drawMessageText();
		this.drawGameInfo();
		this.drawMenu();
		this.drawTransitionOverlay();
		context.restore();
	}

	async startTransition() {
		if (this.currentMenuOption === TitleScreenMenuOptionSelected.Selected) {
			TransitionState.fade(() => {
				stateStack.clear();
				stateStack.push(new PlayState());
			});
		}
		else {
			TransitionState.fade(() => {
				stateStack.clear();
				stateStack.push(new TitleScreenState());
			});
		}

		// Disable input during transition.
		this.inTransition = true;
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

    /**
	 * @param {string} text
	 * @param {number} maxWidth
	 * @returns The separated text lines based on the given maxWidth.
	 */
	getLines(text, maxWidth) {
		const wordsByLine = text.split('\n'); // Split by new line if manually specified in text.
		const lines = [];

		wordsByLine.forEach((line) => {
			let words = line.replace(/\t+/g, '').split(" "); // Remove any tab characters.
            
			let currentLine = words[0];

			context.font = `${this.fontSize}px ${this.fontFamily}`;

			for (let i = 1; i < words.length; i++) {
				let word = words[i];
				const width = context.measureText(currentLine + " " + word).width;

				if (width < maxWidth) {
					currentLine += " " + word;
				}
				else {
					lines.push(currentLine);
					currentLine = word;
				}
			}

			lines.push(currentLine);
		});

		return lines;
	}

	drawTitleText() {
		const offSet = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 190 };
		const menuWidth = 900;
		const menuHeight = 325;

		context.font = `90px ${FontName.Joystix}`;
		context.textBaseline = 'top';
		context.fillStyle = Color.White;
			
        this.titleTextLines?.forEach((line, index) => {
            context.fillText(
                line, 
                offSet.x - context.measureText(line).width / 2, 
                index === 0
						? 50 
						: 125 * index
            );
        })
	}

	drawMessageText(){
		if (this.options.messageText !== null){
			const offSet = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 190 };

			context.font = `50px ${FontName.Joystix}`;
			context.textBaseline = 'middle';
			context.fillStyle = Color.White;

			this.messageTextLines?.forEach((line, index) => {
				context.fillText(
					line, 
					offSet.x - context.measureText(line).width / 2, 
					250 + index * 50 
				);
			})
		}
	}

	drawGameInfo(){
		const offSet = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

		context.font = `65px ${FontName.Joystix}`;
		context.textBaseline = 'middle';
		context.fillStyle = Color.White;

		const timeText = `Time taken: ${this.playState.timer} seconds`;
		const correctGuessesText = `Correct guesses: ${this.playState.map.correctCountries.length}/${this.playState.map.totalCountriesForMap}`;

		context.fillText(
			timeText, 
			offSet.x - context.measureText(timeText).width / 2, 
			offSet.y - 75,
		);
		context.fillText(
			correctGuessesText, 
			offSet.x - context.measureText(correctGuessesText).width / 2, 
			offSet.y,
		);
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

		this.drawMenuOption(
			this.menuOptions[0], 
			offSet.x - context.measureText(this.menuOptions[0]).width / 2, 
			offSet.y + 30, 
			0
		);
		this.drawMenuOption(
			this.menuOptions[1], 
			offSet.x - context.measureText(this.menuOptions[1]).width / 2, 
			offSet.y + 145, 
			1
		);
	}

	drawMenuOption(text, x, y, index) {
		context.save();
		context.font = `65px ${FontName.Joystix}`;

		if (this.currentMenuOption === index) {
			context.fillStyle = Color.Blue;
		}
		else {
			context.fillStyle = Color.UnselectedOption;
		}

		context.fillText(text, x, y);
		context.restore();
	}
}
