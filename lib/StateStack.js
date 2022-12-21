export default class StateStack {
	constructor() {
		this.states = [];
	}

	update(dt) {
		this.top().update(dt);
	}

	render(context) {
		this.states.forEach((state) => state.render(context));
	}

	push(state) {
		this.states.push(state);
		this.top().enter();
	}

	pop() {
		this.top().exit();
		return this.states.splice(this.states.length - 1, 1)[0];
	}

	/**
	 * Pops all the states until the specified state.
	 * @param {*} instance The state to stop at.
	 * @returns 
	 */
	popAllUntilInstanceOf(instance){
		while (true) {
			// If it's the state, return back
			if (this.top() instanceof instance){
				return;
			}

			// Otherwise pop the top state
			this.pop();
		}
	}

	top() {
		return this.states[this.states.length - 1];
	}

	clear() {
		this.states = [];
	}
}
