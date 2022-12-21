import Vector from "../../../lib/Vector.js";
import Color from "../../enums/Color.js";
import { context } from "../../globals.js";
import Panel from "../elements/Panel.js";


export default class GameStatsPanel extends Panel {
    static GAME_STATS = {
		x: 0.25, 
		y: 0.1, 
		width: 450, 
		height: 8.65
	};

    constructor(x, y, width, height, textItems, hearts, hints, options = {}) {
		super(x, y, width, height);

        this.gapHeight = this.dimensions.y / (textItems.length + 1);
		this.fontSize = options.fontSize ?? Panel.FONT_SIZE;
		this.fontColour = options.fontColour ?? Color.Black;
		this.fontFamily = options.fontFamily ?? Panel.FONT_FAMILY;
		this.endOfText = false;
		this.isClosed = false;

        this.textItems = this.initializeTextItems(textItems);
        this.hearts = hearts;
        this.hints = hints;
        this.playState = options.playState;
	}

    update(textItems){
        this.textItems = this.initializeTextItems(textItems);
    }

    render(hearts, hints){
        super.render();

        this.hearts = hearts;
        this.hints = hints;

        context.save();

        this.renderTextItems();
        this.renderHearts();
        this.renderHints();
        
        context.restore();
    }

    renderTextItems(){
        context.textBaseline = 'top';
        context.textAlign = 'center';
		context.font = `${this.fontSize}px ${this.fontFamily}`;
		context.fillStyle = this.fontColour;

		this.textItems?.forEach((text, index) => {
			context.fillText(
                text.text, 
                text.position.x, 
                text.position.y,
                // this.position.x + this.dimensions.x / 2, 
                // this.position.y + (index * this.fontSize) + this.padding * 2,
                this.dimensions.x
            );
		});
    }

    renderHearts(){
        this.hearts.forEach((heart) => {
            heart.render();
        })
    }
   
    renderHints(){
        this.hints.forEach((hint) => {
            hint.render();
        })

        context.textBaseline = 'top';
        // context.textAlign = 'center';
		context.font = `$20px ${this.fontFamily}`;
		context.fillStyle = this.fontColour;

        context.fillText(
            `x${this.playState.hintsLeft}`, 
            this.dimensions.x - 50, 
            this.position.y + 70,
        );
    }

    initializeTextItems(items) {
		let currentY = this.position.y + 130;

		items.forEach((item) => {
			const padding = (currentY + this.gapHeight) / 1.5;

			item.position = new Vector(this.position.x + this.dimensions.x / 2, padding);

			currentY += this.gapHeight;
		});

		return items;
	}
}