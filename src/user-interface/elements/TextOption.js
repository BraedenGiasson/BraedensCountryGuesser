import Color from "../../enums/Color.js";
import { context } from "../../globals.js";
import Panel from "./Panel.js";


export default class TextOption extends Panel {
    static OPTION = {
		width: 380, //330
		height: 3.25
	};
    static EXIT_GAME_OPTION = {
		width: 250, //330
		height: 3.25
	};

    constructor(x, y, width, height, text, onSelect, options = {}) {
		super(x, y, width, height, options);

        this.position.x = x;
        this.position.y = y;

		this.fontSize = options.fontSize ?? Panel.FONT_SIZE;
		this.fontColour = options.fontColour ?? Color.Black;
		this.fontFamily = options.fontFamily ?? Panel.FONT_FAMILY;
		this.isClosed = false;

        this.text = text;
        this.onSelect = onSelect;

        this.lines = this.constructLines();
	}

    render(){
        super.render();

        context.save();
        this.renderTextItems();
        context.restore();
    }

    renderTextItems(){
        context.textAlign = 'center';
        context.textBaseline = 'middle';
		context.font = `${this.fontSize}px ${this.fontFamily}`;
		context.fillStyle = this.fontColour;
		
        this.lines?.forEach((line, index) => {
            context.fillText(
                line, 
                this.position.x + (this.dimensions.x / 2), 
                this.lines.length > 1
                    ? this.position.y - 12.5 + (index * this.fontSize) + (this.dimensions.y / 2)
                    : this.position.y + index * this.fontSize + (this.dimensions.y / 2)
            );
            // context.fillText(
            //     line, 
            //     this.position.x + ((this.dimensions.x - (this.dimensions.x - context.measureText(this.text).width))), 
            //     this.position.y + this.fontSize ,
            //     this.dimensions.x
            // );
        })
    }

    constructLines(){
        const lines = this.getLines(this.text, this.dimensions.x - this.padding * 8) // + 10
        return lines;
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

            // Make first letter of word uppercase
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            
			let currentLine = words[0];

			context.font = `${this.fontSize}px ${this.fontFamily}`;

			for (let i = 1; i < words.length; i++) {
				let word = words[i];
				const width = context.measureText(currentLine + " " + word).width;

                // Make first letter of word uppercase if the word isn't 'and'
                if (word !== "and") {
                    word = word.charAt(0).toUpperCase() + word.slice(1);
                }

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