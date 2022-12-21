import Vector from "../../lib/Vector.js";

export default class GameObject {
	/**
	 * The base class to be extended by all game objects in the game.
	 *
	 * @param {Vector} dimensions The height and width of the game object.
	 * @param {Vector} position The x and y coordinates of the game object.
	 */
	constructor(dimensions, position) {
		this.dimensions = dimensions;
		this.position = position;
		this.sprites = [];
		this.currentFrame = 0;
		this.cleanUp = false;
		this.renderPriority = 0;
		this.animation = null;
	}

	update(dt) { 
		if (this.animation !== null){
			if (this.animation.isDone()){
				this.cleanUp = true;
			}

			this.animation.update(dt);
		}
	}

	render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		if (this.animation !== null){
			this.sprites[this.animation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
		}
		else {
			this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y));
		}
	}
}
