import Vector from "../../lib/Vector.js";
import FontName from "../enums/FontName.js";

export default class UserInterfaceElement {
	static FONT_SIZE = 20;
	static FONT_FAMILY = FontName.Joystix;
	static OFFSET = 32;

	/**
	 * The base UI element that all interface elements should extend.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(x, y, width, height) {
		this.position = new Vector(x * UserInterfaceElement.OFFSET, y * UserInterfaceElement.OFFSET);
		this.dimensions = new Vector(width, height * UserInterfaceElement.OFFSET);
	}
}
