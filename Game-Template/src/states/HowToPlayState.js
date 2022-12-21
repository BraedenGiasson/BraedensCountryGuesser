import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, stateStack } from "../globals.js";
import HowToPlayPanel from "../user-interface/elements/HowToPlayPanel.js";
import Textbox from "../user-interface/elements/Textbox.js";
import HowToPlayInfo from "../enums/HowToPlayInfo.js";
import TitleScreenState from "./TitleScreenState.js";

export default class HowToPlayState extends State {
	/**
	 * State that presents a Textbox to the player
	 * and performs a callback after the Textbox closes.
	 *
	 * @param {string} text
	 * @param {object} placement Where on the screen the Textbox should be displayed.
	 * @param {function} callback
	 */
	constructor() {
		super();

		this.textbox = new HowToPlayPanel(
			HowToPlayPanel.PANEL.x,
			HowToPlayPanel.PANEL.y,
			HowToPlayPanel.PANEL.width,
			HowToPlayPanel.PANEL.height,
			HowToPlayInfo,
			{
				isAdvanceable: true,
				titleFontSize: 60,
				textFontSize: 40
			}
		)
	}

	update() {
		this.textbox.update();

		if (this.textbox.isClosed) {
			stateStack.pop();
			stateStack.push(new TitleScreenState());
		}
	}

	render() {
		this.textbox.render();
	}
}