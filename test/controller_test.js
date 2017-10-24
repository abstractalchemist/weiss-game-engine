import { expect } from 'chai'
import { ControllerFactory } from '../src/controller'
import { GameStateFactory, currentplayer  } from '../src/game_state'
import { DispatcherFactory } from '../src/event_dispatcher'
import { fromJS } from 'immutable'
import { Observable } from 'rxjs/Rx'
const { of } = Observable;

describe('controller', function() {
    it('test runphase and runinter', function(done) {
	this.timeout(5000)
	let gs = GameStateFactory();
	let field = [currentplayer(gs),'stage','center'];
	let center = gs.getIn(field)
	let checked = false;
	let receivedStart = false;
	let receivedEnd = false;
	let i = 0;
	let controller = ControllerFactory(gs.setIn(field,
						    center.push(fromJS(
							{
							    exec({gs,evt:{when,evt}}, then) {
								controller.setNextAction(then);
								return of(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec({gs,evt:{when}}, then) {
								if(when === 'start') receivedStart = true;
								if(when === 'end') receivedEnd = true
								
								return then(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec({gs,evt}, then) {
								return then(gs)
							    }
							}
						    ))),DispatcherFactory());
	controller.registerUI( _ => {
	    console.log("ui invoked")
	})
	controller.runPhases(controller.phases(),0,
			     gs => {
				 i += 1
				 console.log(`i = ${i}`)
			     },
			     end => {
				 console.log("!!!!!!!!!!!!!!!!!!")
				 expect(i).to.equal(2);
				 done();

			     });
	while(controller.hasNext())
	    controller.runInter();
	
	
	
    })
    
    xit('standup with card requires input', function(done) {
	let gs = GameStateFactory();
	let field = [currentplayer(gs),'stage','center'];
	let center = gs.getIn(field)
	let checked = false;
	let receivedStart = false;
	let receivedEnd = false;
	let runLater = undefined
	
	let controller = ControllerFactory(gs.setIn(field,
						    center.push(fromJS(
							{
							    exec({gs,evt:{when,evt}}, then) {
								runLater = then;
								return of(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec({gs,evt}, then) {
								if(when === 'start') receivedStart = true;
								if(when === 'end') receivedEnd = true
								
								return then(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec({gs,evt}, then) {
								return then(gs)
							    }
							}
						    ))),DispatcherFactory());
	controller.standup(controller.currentgamestate())
	    .subscribe(
		gsIn => {
		    center = gsIn.getIn(field);
		    expect(center.get(0).get('status')).to.undefined;
		    expect(center.get(1).get('status')).to.undefined;
		    checked = true;
		    gs = gsIn;
		},
		err => {
		    done(err);
		},
		_ => {
		    expect(checked).to.equal(true)
		    
//		    expect(receivedStart).to.equal(true)
//		    expect(receivedEnd).to.equal(true)
		    done();
		})

	then(gs).subscribe(
	    gs => {
		let center = gs.getIn(field);
		expect(center.get(0).get('status')).to.equal('stand')
		expect(center.get(1).get('status')).to.equal('stand')

	    },
	    error => {
	    },
	    _ => {
		expect(receivedStart).to.equal(true)
		expect(receivedEnd).to.equal(true)
		
	    })

    })
    xit('standup', function(done) {
	let gs = GameStateFactory();
	let field = [currentplayer(gs),'stage','center'];
	let center = gs.getIn(field)
	let checked = false;
	let receivedStart = false;
	let receivedEnd = false;
	let controller = ControllerFactory(gs.setIn(field,
						    center.push(fromJS(
							{
							    exec({gs,evt:{when,evt}}, then) {
								if(when === 'start') receivedStart = true;
								if(when === 'end') receivedEnd = true
								return then(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec({gs,evt}, then) {
								return then(gs)
							    }
							}
						    )).push(fromJS(
							{
							    exec({gs,evt}, then) {
								return then(gs)
							    }
							}
						    ))),DispatcherFactory());
	controller.standup(controller.currentgamestate())
	    .subscribe(
		gs => {
		    center = gs.getIn(field);
		    expect(center.get(0).get('status')).to.equal('stand')
		    expect(center.get(1).get('status')).to.equal('stand')
		    checked = true;
		},
		err => {
		    done(err);
		},
		_ => {
		    expect(checked).to.equal(true)
		    expect(receivedStart).to.equal(true)
		    expect(receivedEnd).to.equal(true)
		    done();
		})
    })
    xit('draw', function(done) {

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
