import { Observable } from 'rxjs/Rx'
import Dispatcher from './event_dispatcher'
import GameState, { GamePhases, currentplayer, getfieldposition } from './game_state'

const { create } = Observable;

const ControllerFactory = function(game_state, dispatcher) {

    let current_game_state = game_state;
    
    return {
	start(gamestate) {
	    let gs = gamestate || current_game_state;
	    return create(obs => {
		obs.complete();
	    })
		.selectMany(this.standup.bind(this))
	    	.selectMany(this.draw.bind(this))
	    	.selectMany(this.clock.bind(this))
	    	.selectMany(this.main.bind(this))
	    	.selectMany(this.climax.bind(this))
	    	.selectMany(this.attack.bind(this))
	    	.selectMany(this.end.bind(this))
		.subscribe(
		    gs => {

			current_game_state = gs;
		    },
		    err => {
		    },
		    _ => {
			// need a check here to determine if the game was ended in one of the previous phases
					
		    })
	    
	},
	standup(game_state) {
	    // change the current state
	    let gs = game_state
		.set('phase', GamePhases.standup)
	    
//	    console.log(gs)
	    
	    let standall = function(stagepositions) {
		return stagepositions.map(o => {
		    
		    return o.set('status','stand')
		})
	    }
	    
		
	    
	    return dispatcher.dispatch(gs, { when:"begin" })
		.map(newgs => {
		    let center = newgs.getIn([currentplayer(newgs),'stage','center'])
		    let back = newgs.getIn([currentplayer(newgs),'stage','back'])
		    return newgs.setIn([currentplayer(newgs),'stage','center'], standall(center)).setIn([currentplayer(newgs),'stage','back'], standall(back))
		})
	    
	},
	draw() {
	    return create(obs => {
		obs.complete();
	    })
	},
	clock() {
	    return create(obs => {
		obs.complete();
	    })
	    
	},
	main() {
	    return create(obs => {
		obs.complete();
	    })

	},
	climax() {
	    return create(obs => {
		obs.complete();
	    })
	    
	},
	attack() {
	    return create(obs => {
		obs.complete();
	    })
	    
	},
	end() {
	    return create(obs => {
		obs.complete();
	    })
	},

	// util methods
	currentgamestate() {
	    return current_game_state;
	}
	
    }
}

const Controller = ControllerFactory(GameState, Dispatcher);

export { ControllerFactory, Controller as default }
