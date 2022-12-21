import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateMachine from "../lib/StateMachine.js";
import StateStack from "../lib/StateStack.js";
import Timer from "../lib/Timer.js";

export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();


// Replace these values according to how big you want your canvas.
export const CANVAS_WIDTH = 1750; // 1280
export const CANVAS_HEIGHT = 1024;

export const BOARD_WIDTH = 1280;

export const OFFSET = {
    x: CANVAS_WIDTH - 1280,
    y: 0
};

export const DEFAULT_X = OFFSET.x;
export const DEFAULT_Y = 0;
export const SEPARATOR = "-";
export const MAX_PREVIOUS_RECORDS = 10;

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const stateStack = new StateStack();
export const timer = new Timer();
export const sounds = new Sounds();
