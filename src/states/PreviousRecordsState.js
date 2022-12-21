import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import PreviousRecordsManager from "../../lib/PreviousRecordsManager.js";
import State from "../../lib/State.js";
import Color from "../enums/Color.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, stateStack } from "../globals.js";
import TitleScreenState from "./TitleScreenState.js";

/**
 * Represents the screen where we can view all high scores previously recorded.
 */
export default class PreviousRecordsState extends State {
	constructor(options) {
		super();

		this.previousRecords = PreviousRecordsManager.loadPreviousRecords();
	
		// this.titleScreenState = titleScreenState;
		this.options = options;
	}

	update(dt) {
		// Return to the start screen if we press escape.
		if (keys.Escape) {
			keys.w = keys.s = keys.Escape = false;
			// sounds.wallHit.play();

			stateStack.pop();
			stateStack.push(new TitleScreenState())
		}
	}

	render() {
		this.options.background.render();
		this.drawDarkBackground();
		this.options.countries.forEach((country) => country.render());

		const incrementPixelAmount = 78;
		const offsetY = 235;
		const menuWidth = CANVAS_WIDTH - 200;
		const menuHeight = CANVAS_HEIGHT - 15;

		context.save();

		context.fillStyle = 'rgb(255, 255, 255, 0.7)';

		roundedRectangle(
			context,
			(CANVAS_WIDTH / 2) - menuWidth / 2,
			7.5,
			menuWidth,
			menuHeight,
			25,
			true,
			false,
		);

		context.fillStyle = Color.Black;
		context.font = "90px Joystix";
		context.textAlign = 'center';
		context.fillText(`🎉 PREVIOUS RECORDS 🎉`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.125);

		context.font = "80px Joystix";

		for (let i = 0; i < 10; i++) {
			const correctCountries = this.previousRecords[i].correctCountries ?? '---';
			const time = this.previousRecords[i].time ?? '---';

			context.textAlign = 'left';
			context.fillText(`${i + 1}.`, CANVAS_WIDTH * 0.25, offsetY + i * incrementPixelAmount);
			context.textAlign = 'center';
			context.fillText(`${correctCountries}/60`, CANVAS_WIDTH * 0.5, offsetY + i * incrementPixelAmount);
			context.textAlign = 'right';
			context.fillText(`${time}`, CANVAS_WIDTH * 0.75, offsetY + i * incrementPixelAmount);
		}

		context.font = "30px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT - 30);
		context.restore();
	}

	/**
	 * Keep the background and tiles a little darker to emphasize foreground.
	 */
	drawDarkBackground() {
		context.fillStyle = 'rgb(0, 0, 0, 0.3)';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}
}
