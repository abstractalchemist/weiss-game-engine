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
	dispatch(gamestate, evt) {
	    
	    let cards = activecards(gamestate);

	    if(cards.size > 0) {
//		console.log(`found ${cards.size}`)
		const dispatchImpl = (index,gs) => {

		    // dispatch to all cards
		    if(index < cards.size) {
			let card = cards.get(index);
 			if(card) {
			    return card.get('exec')(gs)
				.mergeMap(gs => {
				    return dispatchImpl(++index, gs)
				})
			}
		    }
		    // dispatch to all registered listeners
		    return from(listeners.toJS())
			.mergeMap(listener => {
			    listener.exec(evt,gs)
			})
		}
		
		return dispatchImpl(0, gamestate);
	    }
	    return of(gamestate)
	    
	    
	    
	},
	phaseChange(gamestate, when = 'start') {
	    return this.dispatch(gamestate, {when,evt:"phaseChange"})
	}
    }
}

const Dispatcher = DispatcherFactory();
export { DispatcherFactory, Dispatcher as default }
