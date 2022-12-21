import UserInterfaceElement from "../UserInterfaceElement.js";
// import SoundName from "../../enums/SoundName.js";
import { context, keys, sounds } from "../../globals.js";
import Vector from "../../../lib/Vector.js";
import TitleScreenMenuOptionSelected from "../../enums/TitleScreenMenuOptionSelected.js";
import Color from "../../enums/Color.js";
import FontName from "../../enums/FontName.js";
import TextOption from "./TextOption.js";

export default class Selection extends UserInterfaceElement {
	/**
	 * A UI element that gives us a list of textual items that link to callbacks;
	 * this particular implementation only has one dimension of items (vertically),
	 * but a more robust implementation might include columns as well for a more
	 * grid-like selection, as seen in many other kinds of interfaces and games.
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

		this.gapHeight = (this.dimensions.y - 30) / (items.length + 1);
		this.items = this.initializeItems(items);
		this.currentSelection = TitleScreenMenuOptionSelected.Selected;
		this.font = this.initializeFont();
		this.playerSelectedOption = false;
	}

	update() {
		if (keys.w || keys.ArrowUp) {
			this.navigateUp();
		}
		else if (keys.s || keys.ArrowDown) {
			this.navigateDown();
		}
		else if (keys.Enter || keys[' ']) {
			this.select();
		}
	}

	render() {
		this.items.forEach((item, index) => {
			this.renderSelectionItem(item, index);
		});
	}

	renderSelectionItem(item, index) {
		if (index === this.currentSelection) {
			this.renderOptionText(item, true);
		}
		else {
			this.renderOptionText(item);
		}
	}

	renderOptionText(item, isSelected = false){
		context.save();
		// context.textAlign = 'center';
		// context.textBaseline = 'middle';
		// context.font = this.font;

		// Render the blue border around the currently selected option
		if (isSelected && !this.playerSelectedOption){
			item.borderColour = Color.Blue;
		}
		// Render the grey color only if the option hasn't been selected by the user
		else if (!this.playerSelectedOption){
			item.borderColour = Color.Grey;
		}

		// context.fillText(item, item.position.x, item.position.y);
		// // context.fillText(item.text, item.position.x, item.position.y);
		item.render();
		context.restore();
	}

	renderSelectionArrow(item) {
		context.save();
		context.translate(this.position.x + 10, item.position.y - 5);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(6, 5);
		context.lineTo(0, 10);
		context.closePath();
		context.fill();
		context.restore();
	}

	navigateUp() {
		keys.w = false;
		keys.ArrowUp = false;

		// sounds.play(SoundName.SelectionMove);

		if (this.currentSelection === 0) {
			this.currentSelection = this.items.length - 1;
		}
		else {
			this.currentSelection--;
		}
	}

	navigateDown() {
		keys.s = false;
		keys.ArrowDown = false;

		// sounds.play(SoundName.SelectionMove);

		if (this.currentSelection === this.items.length - 1) {
			this.currentSelection = 0;
		}
		else {
			this.currentSelection++;
		}
	}

	select() {
		keys.Enter = false;
		keys[' '] = false;

		this.playerSelectedOption = true;

		// sounds.play(SoundName.SelectionChoice);
		this.items[this.currentSelection].onSelect();
	}

	/**
	 * Adds a position property to each item to be used for rendering.
	 *
	 * @param {array} items
	 * @returns The items array where each item now has a position property.
	 */
	initializeItems(items) {
		let currentY = this.position.y + 30;
		const textItems = [];

		// items.forEach((item) => {
		// 	const padding = currentY + this.gapHeight;

			// item.position = new Vector(this.position.x + this.dimensions.x / 2, padding);

		// 	currentY += this.gapHeight;
		// });

		items.forEach((item, index) => {
			const padding = currentY + this.gapHeight;

			textItems.push(new TextOption(
				this.position.x + (this.dimensions.x - TextOption.OPTION.width) / 2,
				padding,
				TextOption.OPTION.width,
				TextOption.OPTION.height,
				item.text,
				item.onSelect,
				{
					fontSize: 30
				}
			))

			currentY += this.gapHeight;
		})

		return textItems;
		// return items;
	}

	/**
	 * Scales the font size based on the size of this Selection element.
	 */
	initializeFont() {
		// return `${Math.min(UserInterfaceElement.FONT_SIZE, this.gapHeight)}px ${UserInterfaceElement.FONT_FAMILY}`;
		return `45px ${UserInterfaceElement.FONT_FAMILY}`;
	}
}
