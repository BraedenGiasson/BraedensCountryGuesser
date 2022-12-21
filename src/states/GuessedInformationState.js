import State from "../../lib/State.js";
import Color from "../enums/Color.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, OFFSET, stateStack, timer } from "../globals.js";
import GuessResultPanel from "../user-interface/elements/GuessResultPanel.js";
import Textbox from "../user-interface/elements/Textbox.js";


export default class GuessedInformationState extends State {
	constructor(countrySelectionState, panelOptions) {
		super();

        this.countrySelectionState = countrySelectionState;
       
        this.textbox = new GuessResultPanel(
			GuessResultPanel.GUESS_PANEL.x,
			(CANVAS_HEIGHT / 2) / 32 - (panelOptions.panelHeight / 2),
			// GuessResultPanel.GUESS_PANEL.y,
			GuessResultPanel.GUESS_PANEL.width,
			panelOptions.panelHeight, //GuessResultPanel.GUESS_PANEL.height
            {
                titleText: panelOptions.titleText,
                messageText: panelOptions.messageText,
                continueText: panelOptions.continueText,
                titleText: panelOptions.titleText,
                // titleText:  "Oops! That was the wrong country...",
                // messageText: `The correct country was ${correctCountryName}!\nMaybe next time trying using a hint!`,
                // continueText: "Press 'Enter' to continue..."
            },
			{ 
				titleFontSize: 60,
				messageFontSize: 40,
                // borderColour: Color.Red,
                borderColour: panelOptions.borderColour,
			}
		);

        // The final position the textbox should go to
        let finalTweenPosition = ((CANVAS_WIDTH + OFFSET.x) / 2 - (this.textbox.dimensions.x / 2));

        if (panelOptions.borderColour === Color.Green){
            const dimensionsOffset = 150;
            const positionsOffset = 75;

            timer.tween(
                this.textbox.position, 
                ['x'], 
                [finalTweenPosition], 
                1.75,
                () => {
                    timer.tween(
                        this.textbox.dimensions, 
                        ['x', 'y'], 
                        [this.textbox.dimensions.x + dimensionsOffset, this.textbox.dimensions.y + dimensionsOffset], 
                        0.5, // 2
                        () => {
                            timer.tween(
                                this.textbox.dimensions, 
                                ['x', 'y'], 
                                [this.textbox.dimensions.x - dimensionsOffset, this.textbox.dimensions.y - dimensionsOffset], 
                                0.5,
                            )
                        }
                    )

                    timer.tween(
                        this.textbox.position, 
                        ['x', 'y'], 
                        [this.textbox.position.x - positionsOffset, this.textbox.position.y - positionsOffset], 
                        0.5,
                        () => {
                            timer.tween(
                                this.textbox.position, 
                                ['x', 'y'], 
                                [this.textbox.position.x + positionsOffset, this.textbox.position.y + positionsOffset], 
                                0.5,
                            )
                        }
                    )

                    // timer.tween(
                    //     this.textbox.position, 
                    //     ['y'], 
                    //     [this.textbox.position.y - 100], 
                    //     0.45,
                    //     () => {
                    //         timer.tween(
                    //             this.textbox.position, 
                    //             ['y'], 
                    //             [this.textbox.position.y + 200], 
                    //             0.45,
                    //             () => {
                    //                 timer.tween(
                    //                     this.textbox.position, 
                    //                     ['y'], 
                    //                     [this.textbox.position.y - 100], 
                    //                     0.45
                    //                 );
                    //             }
                    //         );
                    //     }
                    // );
                }
            );
        }
        else if (panelOptions.borderColour === Color.Red){
            timer.tween(
                this.textbox.position, 
                ['x'], 
                [finalTweenPosition], 
                1.75,
                () => {
                    timer.tween(
                        this.textbox.position, 
                        ['x'], 
                        [finalTweenPosition - 100], 
                        0.45,
                        () => {
                            timer.tween(
                                this.textbox.position, 
                                ['x'], 
                                [finalTweenPosition], 
                                0.45
                            );
                        }
                    );
                }
            );
        }
	}

    update(dt){
        // this.textbox?.update();
        timer.update(dt);
    }

    render(){
        super.render();
        this.countrySelectionState.render();
        this.textbox?.render();
    }
}