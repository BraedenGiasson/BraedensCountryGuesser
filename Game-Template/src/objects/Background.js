import { BOARD_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_X, DEFAULT_Y, images } from "../globals.js";
import Sprite from "../../lib/Sprite.js";

export default class Background {

    /**
     * Instantiates a new instance of the {@link Background} class.
     * @param {*} imageName The background image name.
     */
    constructor(imageName){
        this.image = Background.generateSprite(imageName);
    }

    render(){
        this.image.render(DEFAULT_X, DEFAULT_Y);
    }

    /**
     * Generates the background sprite.
     * @param {*} imageName 
     * @returns 
     */
    static generateSprite(imageName){
        return new Sprite(
            images.get(imageName), 
            0, DEFAULT_Y,
			BOARD_WIDTH, CANVAS_HEIGHT)
        ;
    }
}