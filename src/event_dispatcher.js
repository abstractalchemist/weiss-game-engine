import { Observable } from 'rxjs/Rx'
const { create,from,of } = Observable
import { activecards } from './game_state'

const DispatcherFactory = function() {

    
    return {
	dispatch(gamestate, evt) {
	    
	    let gs = gamestate;
	    let cards = activecards(gamestate);

	    if(cards.size > 0) {
		console.log(`found ${cards.size}`)
		const dispatchImpl = (index,gs) => {
		    if(index < cards.size) {
			let card = cards.get(index);
 			if(card) {
			    return card.get('exec')(gs)
				.mergeMap(gs => {
				    return dispatchImpl(++index, gs)
				})
			}
		    }
		    return create(observer => {
			observer.complete();
		    })
		    
		}
		
		return dispatchImpl(0, gs);
		// return from(cards.toJS()).
		//     mergeMap(card => {
			
		// 	return card.exec(gs);
		//     }).
		//     last();
	    }
	    return of(gamestate)
	    
	    
	    
	},
	phaseChange(gamestate, when) {
	    return this.dispatch(gamestate, {when,evt:"phaseChange"})
	}
    }
}

const Dispatcher = DispatcherFactory();
export { DispatcherFactory, Dispatcher as default }
