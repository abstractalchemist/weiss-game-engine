import  GameState, {  memory, turn, phase } from '../src/game_state';
import { expect } from 'chai'

describe('game state test', function() {
    it('init', function() {
	expect(GameState).to.not.be.null;
	expect(memory({gamestate:GameState})).to.have.lengthOf(0);
	let currentmemory = memory({gamestate:GameState});
	currentmemory.push({});
	memory({gamestate:GameState,newval:currentmemory})
	expect(memory({gamestate:GameState})).to.have.lengthOf(1);
    })

    it('start', function() {
	GameState.start();
	expect(phase(GameState)).to.equal("draw");
	expect(turn(GameState)).to.equal(0);
    })
})
