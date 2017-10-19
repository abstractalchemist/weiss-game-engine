import { Observable } from 'rxjs/Rx'
import Dispatcher from './event_dispatcher'
import GameState, { GamePhases, currentplayer } from './game_state'
import {  update, copyarray, updatearray, removearrayelem } from './immutable'

const { create } = Observable;

const ControllerFactory = function(game_state, dispatcher) {


    
    return {
	standup(game_state) {
	    return create(obs => {
		
	    })
	},
	draw() {
	},
	clock() {
	},
	main() {
	},
	climax() {
	},
	attack() {
	},
	end() {
	}
	
    }
}

const Controller = ControllerFactory(GameState, Dispatcher);

export { ControllerFactory, Controller as default }
