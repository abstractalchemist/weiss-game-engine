import { expect } from 'chai'
import { ControllerFactory } from '../src/controller'
import { GameStateFactory, currentplayer  } from '../src/game_state'
import { DispatcherFactory } from '../src/event_dispatcher'
import { fromJS } from 'immutable'
import { Observable } from 'rxjs/Rx'
const { of } = Observable;

describe('controller', function() {
    it('standup', function(done) {
	let gs = GameStateFactory();
	let field = [currentplayer(gs),'stage','center'];
	let center = gs.getIn(field)
	let controller = ControllerFactory(gs.setIn(field,
						    center.push(fromJS(
							{
							    exec(gs) {
								return of(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec(gs) {
								return of(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec(gs) {
								return of(gs)
							    }
							}
						    ))),DispatcherFactory());
	controller.standup(controller.currentgamestate())
	    .subscribe(
		gs => {
		    center = gs.getIn(field);
		    expect(center.get(0).get('status')).to.equal('stand')
		    expect(center.get(1).get('status')).to.equal('stand')
		},
		err => {
		    done(err);
		},
		_ => {
		    done();
		})
    })
    it('draw', function(done) {

	let controller = ControllerFactory(GameStateFactory(), DispatcherFactory());
	
	controller.draw(controller.currentgamestate())
	    .subscribe(
		_ => {
		},
		err => {
		    done(err)
		},
		_ => {
		    done();
		})

    })
    it('start', function(done) {
	done()
    })
})
