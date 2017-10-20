import  { GameStateFactory,  currentplayer, start, GamePhases } from '../src/game_state';
import { expect } from 'chai'


describe('game state test', function() {
    it('init', function() {
	
	let gs = GameStateFactory()
	expect(gs.getIn([currentplayer(gs),'memory']).toJS()).to.have.lengthOf(0);
	expect(gs.getIn([currentplayer(gs),'clock']).toJS()).to.have.lengthOf(0);
	
    })

    it('start', function() {
	let gs = start(GameStateFactory());
	expect(gs.getIn([currentplayer(gs),'memory']).toJS()).to.have.lengthOf(0);
	expect(gs.getIn([currentplayer(gs),'clock']).toJS()).to.have.lengthOf(0);
	
	expect(gs.get('phase')).to.equal(GamePhases.standup)
	expect(gs.get('turn')).to.equal(0)
	
    })
})
