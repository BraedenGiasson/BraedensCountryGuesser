import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_X, DEFAULT_Y, images, SEPARATOR } from "../globals.js";
import Sprite from "../../lib/Sprite.js";

export default class Country {

    /**
     * Instantiates a new instance of the {@link Country} class.
     * @param {*} imageName The country image name.
     */
    constructor(imageName){
        this.country = Country.generateSprite(imageName);
        this.name = this.getCountryName(imageName);
    }

    getCountryName(imageName){
        const nameSplitBySeparator = imageName.split(SEPARATOR);
        return nameSplitBySeparator[0];
    }

    render(){
        this.country.render(DEFAULT_X, DEFAULT_Y);
    }

    /**
     * Generates the country sprite.
     * @param {*} imageName 
     * @returns 
     */
    static generateSprite(imageName){
        return new Sprite(
            images.get(imageName), 
            0, DEFAULT_Y,
			CANVAS_WIDTH, CANVAS_HEIGHT,
            imageName)
        ;
    }
}