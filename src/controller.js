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
		.mergeMap(this.standup.bind(this))
	    	.mergeMap(this.draw.bind(this))
	    	.mergeMap(this.clock.bind(this))
	    	.mergeMap(this.main.bind(this))
	    	.mergeMap(this.climax.bind(this))
	    	.mergeMap(this.attack.bind(this))
	    	.mergeMap(this.end.bind(this))
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
	    
	    return dispatcher.phaseChange(gs,"begin")
		.map(newgs => {
		    let center = newgs.getIn([currentplayer(newgs),'stage','center'])
		    let back = newgs.getIn([currentplayer(newgs),'stage','back'])
		    return newgs.setIn([currentplayer(newgs),'stage','center'], standall(center)).setIn([currentplayer(newgs),'stage','back'], standall(back))
		})
		.mergeMap(gs => {
		    return dispatcher.phaseChange(gs, "end")
		})
	    
	},
	draw(game_state) {
	    let gs = game_state.set('phase', 'draw');
	    return dispatcher.phaseChange(gs, "begin")
		.map(gs => {

		    let deckpos = [currentplayer(gs),'deck'];
		    let handpos = [currentplayer(gs),'hand'];
		    console.log(gs.getIn(deckpos))
		    let card;
		    gs = gs.updateIn(deckpos, list => {
			card = list.get(0);
			return list.shift();
		    })
		    return gs.updateIn(handpos, list => {
			return list.push(card)
		    })
		})
		.mergeMap(gs => {
		    return dispatcher.phaseChange(gs, "end")
		})
	    
	},
	clock(game_state) {
	    
	    let gs = game_state.set('phase','clock');
	    return dispatcher.phaseChange(gs, "begin")
		.mergeMap(gs => {

		    // the event should be listened for to clock a card from hand
		    return dispatcher.dispatch(gs, {evt:"clock"})
		})
		.mergeMap(gs => {
		    return dispatcher.phaseChange(gs, "end")
		})
	},
	main() {
	    return dispatcher.phaseChange(gs, "begin")
		.mergeMap(gs => {
		    return dispatcher.phaseChange(gs, "end")
		})

	},
	climax() {
	    return dispatcher.phaseChange(gs, "begin")

	    // the event should be listened for to play a climax card
		.mergeMap(gs => {
		    return dispatcher.dispatch(gs, {evt:'climax'})
		})
		.mergeMap(gs => {
		    return dispatcher.phaseChange(gs, "end")
		})
	    
	},
	attack() {
	    return dispatcher.phaseChange(gs, "begin")
		.mergeMap(gs => {
		    return dispatcher.phaseChange(gs, "end")
		})


	    
	},
	end() {
	    return dispatcher.phaseChange(gs, "begin")
		.mergeMap(gs => {
		    return dispatcher.phaseChange(gs, "end")
		})


	},

	// util methods
	currentgamestate() {
	    return current_game_state;
	}
	
    }
}

const Controller = ControllerFactory(GameState, Dispatcher);

// function which alters the gamestate;  finds the given selected card from hand, and places it into the clock

function movecard(id, gs, from, to) {
    let pos1 = [currentplayer(gs),'clock']
    let pos2 = [currentplayer(gs),'hand'];
    let card;
    
    return gs.updateIn(pos1, pos1list => {
	let index;
	card = pos1list.find((c,i) => {
	    if(c.get('id') === id) {
		index = i;
		return true;
	    }
	    return false;
	})
	return pos1list.delete(index)
	
    }).updateIn(pos2, pos2list => {
	return pos2list.push(card)
    })
    
}

function clock(id, gs) {
    return movecard(id,gs,'hand','clock')
}

function climax(id,gs) {
    return movecard(id,gs,'hand','climax')
}


export { ControllerFactory, clock, climax, Controller as default }
