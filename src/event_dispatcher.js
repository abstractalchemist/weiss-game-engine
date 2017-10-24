import { Observable } from 'rxjs/Rx'
const { create,from,of } = Observable
import { activecards } from './game_state'
import { fromJS } from 'immutable';

const DispatcherFactory = function() {

    let listeners = fromJS([])
    
    return {
	register(listener) {
	    listeners = listeners.push(listener)
	},
	dispatch(gamestate, evt, after) {
 	    let cards = activecards(gamestate);

	    //		console.log(`found ${cards.size}`)
	    const dispatchImpl = (index,gs) => {

		// dispatch to all cards
		if(index < cards.size) {
		    let card = cards.get(index);
 		    if(card) {
			return card.get('exec')({gs,evt}, gs => {
			    return dispatchImpl(++index,gs)
			})
		    }
		}
		else {
//		    console.log(after)
		    if(after) {
			return after(gs, _ => {
			    // dispatch to all registered listeners
			    return from(listeners.toJS())
				.mergeMap(listener => {
				    listener.exec(evt,gs)
				})
			})
		    }
		    return of(gs)
		}
	    }
	    
 	    return dispatchImpl(0, gamestate);
	    
	    
	    
	},
	phaseChange(gamestate, when, after) {
	    console.log(`dispatching phaseChange ${gamestate.get('phase')}`)
	    return this.dispatch(gamestate, {when,evt:"phaseChange"}, after)
	}
    }
}

const Dispatcher = DispatcherFactory();
export { DispatcherFactory, Dispatcher as default }
