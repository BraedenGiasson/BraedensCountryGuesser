import Color from "../../enums/Color.js";
// import SoundName from "../../enums/SoundName.js";
import { context, keys, sounds, timer } from "../../globals.js";
import Panel from "./Panel.js";

export default class GuessResultPanel extends Panel {
	static GUESS_PANEL = {
		x: -5,
		y: 8,
		width: 1150, 
		height: 15
	};

	/**
	 * A Textbox element is a Panel with text overlaid on top.
	 * The text can be "advanceable" meaning the player can hit
	 * enter or space to advance to the next "page" of text.
	 * If not advanceable, the controlling state will take care
	 * of closing the Textbox.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {string} texts
	 * @param {object} options Font size/colour/family and whether the textbox should be advanceable.
	 */
	constructor(x, y, width, height, texts, options = {}) {
		super(x, y, width, height, options);

		this.titleFontSize = options.titleFontSize ?? Panel.FONT_SIZE;
		this.messageFontSize = options.messageFontSize ?? Panel.FONT_SIZE;
		this.fontColour = options.fontColour ?? Color.Black;
		this.fontFamily = options.fontFamily ?? Panel.FONT_FAMILY;
		this.isClosed = false;

		this.titleLines = this.constructTitleLines(texts.titleText);
		this.messageLines = this.constructMessageLines(texts.messageText);
		this.continueLines = this.constructContinueLines(texts.continueText);
	}

	render() {
		super.render();

		context.save();
		this.renderTitleText();
		this.renderMessageText();
		this.renderContinueText();
		context.restore();
	}

	renderTitleText(){
		context.textBaseline = 'top';
		context.font = `${this.titleFontSize}px ${this.fontFamily}`;
		context.fillStyle = this.fontColour;

		this.titleLines?.forEach((line, index) => {
			context.fillText(line, 
				this.position.x + (this.dimensions.x / 2 - (context.measureText(line).width / 2)), //- this.padding 
				this.position.y + index * this.titleFontSize + this.padding + 10);
		});
	}
	
	renderMessageText(){
		context.textBaseline = 'top';
		context.font = `${this.messageFontSize}px ${this.fontFamily}`;
		context.fillStyle = this.fontColour;

		this.messageLines?.forEach((line, index) => {
			context.fillText(line, 
				this.position.x + (this.dimensions.x / 2 - (context.measureText(line).width / 2)),
				(this.position.y + index * this.titleFontSize + this.padding) + 200);
		});
	}
	
	renderContinueText(){
		context.textBaseline = 'top';
		context.font = `${this.messageFontSize}px ${this.fontFamily}`;
		context.fillStyle = this.fontColour;

		this.continueLines?.forEach((line, index) => {
			context.fillText(line, 
				this.position.x + (this.dimensions.x / 2 - (context.measureText(line).width / 2)),
				this.position.y + this.dimensions.y - 50 -  this.padding);
		});
	}

	constructTitleLines(titleText){
        const lines = this.getLines(
			titleText, 
			this.dimensions.x - this.padding * 4 - 25,
			this.titleFontSize
		);
        return lines;
    }
	
	constructMessageLines(messageText){
        const lines = this.getLines(
			messageText, 
			this.dimensions.x - this.padding * 2.5,
			this.messageFontSize
		);
        return lines;
    }
	
	constructContinueLines(continueText){
        const lines = this.getLines(
			continueText, 
			this.dimensions.x - this.padding * 2.5,
			this.messageFontSize
		);
        return lines;
    }

	/**
	 * @param {string} text
	 * @param {number} maxWidth
	 * @returns The separated text lines based on the given maxWidth.
	 */
	getLines(text, maxWidth, fontSize) {
		const wordsByLine = text.split('\n'); // Split by new line if manually specified in text.
		const lines = [];

		wordsByLine.forEach((line) => {
			const words = line.replace(/\t+/g, '').split(" "); // Remove any tab characters.

			let currentLine = words[0];

			context.font = `${fontSize}px ${this.fontFamily}`;

			for (let i = 1; i < words.length; i++) {
				const word = words[i];
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
}
