import Rx from 'rxjs/Rx'

const DispatcherFactory = function() {
    return {
	dispatch(gamestate, evt) {
	}
    }
}

const Dispatcher = DispatcherFactory();
export { DispatcherFactory, Dispatcher as default }
