import Vector from "../../../lib/Vector.js";
import Color from "../../enums/Color.js";
import FontName from "../../enums/FontName.js";
import { CANVAS_HEIGHT, context } from "../../globals.js";
import Panel from "./Panel.js";
import Selection from "./Selection.js";

export default class Menu extends Panel {
	static COUNTRIES_MENU = {
		x: 0.25, 
		y: 8.9, 
		width: 450, 
		height: 23
	};

	/**
	 * A UI element that is a Selection on a Panel.
	 * More complicated Menus may be collections
	 * of Panels and Selections that form a greater whole.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {array} items Elements are objects that each
	 * have a string `text` and function `onSelect` property.
	 */
	constructor(x, y, width, height, items) {
		super(x, y, width, height);

		this.selection = new Selection(x, y, width, height, items);
	}

	update() {
		this.selection.update();
	}

	render() {
		super.render();
		this.renderMenuTitle();
		this.selection.render();
	}

	/**
	 * Renders the text of the menu selection.
	 */
	renderMenuTitle(){
		context.fillStyle = Color.Black;
		context.font = `60px ${FontName.Joystix}`;
		context.fillText("Guess", 
			this.selection.position.x + ((this.selection.dimensions.x / 2) - (context.measureText("Guess").width / 2)), // (context.measureText("Guess").width / 2)) 
			this.selection.position.y + 100
		);
	}
}
