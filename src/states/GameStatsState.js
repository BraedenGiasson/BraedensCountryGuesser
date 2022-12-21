import State from "../../lib/State.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import Heart from "../objects/Heart.js";
import Hint from "../objects/Hint.js";
import GameStatsPanel from "../user-interface/game/GameStatsPanel.js";


export default class GameStatsState extends State {
    constructor(playState, map){
        super();

        this.playState = playState;
        this.map = map;

        const statsMessage = this.constructMessage();
        const hearts = this.initializeHearts();
        const hints = this.initializeHints();

        this.gameStats = new GameStatsPanel(
            GameStatsPanel.GAME_STATS.x,
			GameStatsPanel.GAME_STATS.y,
			GameStatsPanel.GAME_STATS.width,
			GameStatsPanel.GAME_STATS.height,
            statsMessage,
            hearts,
            hints,
            { 
				fontSize: 36,
                playState: playState
			}
        );
    }

    update(dt){
        this.gameStats?.update(this.constructMessage());
    }

    render(){
        this.gameStats?.render(this.initializeHearts(), this.initializeHints());
    }

    constructMessage(){
        const textItems = [];

        textItems.push({
                text: `Correct: ${this.map.correctCountries.length}/${this.map.totalCountriesForMap}`
            });
        textItems.push({
                text: `Timer:  ${this.playState.timer} secs`
            });
        
        return textItems;
    }

    initializeHearts(){
        const hearts = [];
        let index = 0;

        // Create the empty hearts
        for (let k = 0; k < (this.playState.STARTING_LIVES - this.playState.numberOfLives); k++) {
            hearts.push(new Heart(
                ImageName.HeartEmpty,
                new Vector(Heart.WIDTH, Heart.HEIGHT),
				new Vector(
                    (GameStatsPanel.GAME_STATS.width / 13) + (index * 82.5), // 6
                    GameStatsPanel.GAME_STATS.y + 40)
            ));

            index++;
        }

        // Create the full hearts
        for (let i = 0; i < this.playState.numberOfLives; i++) {
            hearts.push(new Heart(
                ImageName.HeartFull,
                new Vector(Heart.WIDTH, Heart.HEIGHT),
				new Vector(
                    // (30) + (index * 85), 
                    (GameStatsPanel.GAME_STATS.width / 13) + (index * 82.5), 
                    GameStatsPanel.GAME_STATS.y + 40)
            ));   
            
            index++;
        }

        return hearts;
    }

    initializeHints(){
        const hints = [];
        let index = 0;

        // Use empty heart if no hearts left
        if (this.playState.hintsLeft === 0){
            hints.push(new Hint(
                ImageName.HintEmpty,
                new Vector(Heart.WIDTH, Heart.HEIGHT),
				new Vector(
                    // (30) + (index * 85), 
                    (GameStatsPanel.GAME_STATS.width - 180) + (index * 85), 
                    GameStatsPanel.GAME_STATS.y + 5)
            ));  
        }
        // Otherwise use full heart
        else{
            // Create the full hearts
            hints.push(new Hint(
                ImageName.HintFull,
                new Vector(Heart.WIDTH, Heart.HEIGHT),
                new Vector(
                    // (30) + (index * 85), 
                    (GameStatsPanel.GAME_STATS.width - 180) + (index * 85), 
                    GameStatsPanel.GAME_STATS.y + 5)
            ));   
        }

        return hints;
    }
}