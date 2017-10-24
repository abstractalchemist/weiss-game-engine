import { Observable } from 'rxjs/Rx'
import Dispatcher from './event_dispatcher'
import GameState, { GamePhases, currentplayer, getfieldposition } from './game_state'

const { create } = Observable;

const ControllerFactory = function(game_state, dispatcher) {

    let current_game_state = game_state;
    let ui = undefined;
    let after = undefined;
    let next = undefined;
    return {
	hasNext() {
	    return next !== undefined;
	},
	setNextAction(f) {
	    next = f;
	},
	setAfterAction(f) {
	    after = f;
	},
	registerUI(u) {
	    ui = u;
	},
	runInter() {
	    if(next) {
		let fun = next
		next = undefined
		fun(current_game_state).subscribe(
		    gs => {
			if(ui)
			    current_game_state = gs
			    ui(gs)
		    },
		    error => {
			alert(error)
		    },
		    _ => {
			if(next) {
			    this.runInter()
			}
			else
			    setTimeout(_ => {
				let funs = after;
				console.log(`running after phase ${after !== undefined}`)
				after = undefined
				
				funs()
				
			    }, 1000)
		    })
		
	    }
	    
	},
	
	runPhases(funs,  index, afterPhase, afterTurn) {
	    if(index < funs.length) {

		funs[index](current_game_state)
		    .subscribe(
			gs => {
			    current_game_state = gs
			    ui(gs)
			},
			error => {

			},
			_ => {
			    if(next) {
				
				setTimeout(_ => {
				    
				    this.setAfterAction(_ => {
					console.log(`after phase as after action?: ${afterPhase !== undefined}`);
					if(afterPhase) 
					    afterPhase(current_game_state)
					
					this.runPhases(funs, ++index, afterPhase, afterTurn)
				    })
				    this.runInter()
				}, 1000)
			    }
			    else {
				setTimeout(_ => {
				    console.log(`after phase?: ${afterPhase !== undefined}`)
				    if(afterPhase)
					afterPhase(current_game_state)
				    this.runPhases(funs, ++index, afterPhase, afterTurn)
				}, 1000)
			    }
			})
	    }
	    else
		setTimeout(_ => {
		    if(afterTurn)
			afterTurn()
		}, 1000)
	},

	phases() {
	    return [this.standup.bind(this),
		    this.draw.bind(this)]
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
	    
	    return dispatcher.phaseChange(gs, "start", newgs => {
		console.log("standing all cards")
		let center = newgs.getIn([currentplayer(newgs),'stage','center'])
		let back = newgs.getIn([currentplayer(newgs),'stage','back'])
		let newgs2 = newgs.setIn([currentplayer(newgs),'stage','center'], standall(center)).setIn([currentplayer(newgs),'stage','back'], standall(back))
		return dispatcher.phaseChange(newgs2, "end")
	    })
	    
	},
	draw(game_state) {
	    let gs = game_state.set('phase', 'draw');
	    return dispatcher.phaseChange(gs,"start",
					  gs => {
					      let deckpos = [currentplayer(gs),'deck'];
					      let handpos = [currentplayer(gs),'hand'];
					      console.log("drawing card from deck")
					      let card;
					      gs = gs.updateIn(deckpos, list => {
						  card = list.get(0);
						  return list.shift();
					      })
					      
					      return dispatcher.phaseChange(gs.updateIn(handpos, list => {
						  return list.push(card)
					      }), "end")
					  })
	    
	    
	},
	clock(game_state) {
	    
	    let gs = game_state.set('phase','clock');
	    return dispatcher.phaseChange(gs,"start",
					  gs => {
					      console.log('dispatching clock event')
					      // the event should be listened for to clock a card from hand;
					      return dispatcher.dispatch(gs, {evt:"clock"},
									 _ => {
									     return dispatcher.phaseChange(gs, "end")
									 })
					  })
	    
	    
	},
	main(game_state) {
	    let gs = game_state;
	    return dispatcher.phaseChange(gs, "start", gs => {
		return dispatcher.phaseChange(gs, "end")
	    })

	},
	climax(game_state) {
	    return dispatcher.phaseChange(gs,"start", gs => {
		// the event should be listened for to play a climax card
		return dispatcher.dispatch(gs, {evt:'climax'},
					   gs => {
					       return dispatcher.phaseChange(gs, "end")
					   })
	    })
	},
	attack(game_state) {
	    return dispatcher.phaseChange(gs, "start", gs => {
		return dispatcher.phaseChange(gs, "end")
	    })


	    
	},
	end(game_state) {
	    return dispatcher.phaseChange(gs, "start", gs => {
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

// function which alters the gamestate;  finds the given selected card from the given locations, and places it into another location

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
