import { Observable } from 'rxjs/Rx'
const { create } = Observable

const DispatcherFactory = function() {
    return {
	dispatch(gamestate, evt) {
	    return create(obs => {
//		console.log(gamestate)
		obs.next(gamestate);
		obs.complete()
	    })
	}
    }
}

const Dispatcher = DispatcherFactory();
export { DispatcherFactory, Dispatcher as default }
