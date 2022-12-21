import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, sounds } from "../globals.js";
import GameObject from "./GameObject.js";

export default class Hint extends GameObject {
    static WIDTH = 500; //418
    static HEIGHT = 500;

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
            Hint.WIDTH,
            Hint.HEIGHT
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
            { x: 0.25, y: 0.25 });
	}
}