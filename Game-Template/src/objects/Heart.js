import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, sounds } from "../globals.js";
import GameObject from "./GameObject.js";

export default class Heart extends GameObject {
    static WIDTH = 760; //418
    static HEIGHT = 700;

    /**
	 * A heart that the player can hit to heal a full heart.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
    constructor(heartImage, dimensions, position){
        super(dimensions, position);
 
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(heartImage),
            Heart.WIDTH,
            Heart.HEIGHT
        );

        // Set the heart to render to the location of the full heart in the sprite sheet
        this.currentFrame = 0;
    }

    render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		this.sprites[this.currentFrame].render(
            Math.floor(x), 
            Math.floor(y),
            { x: 0.095, y: 0.1 }); //0.1
	}
}