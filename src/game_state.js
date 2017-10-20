// implements the data structure for the entire game state
// the state object itself is considered ( opaque ).  access to properties should be done through provided functions
import { Map, List, fromJS } from 'immutable'


const GamePhases = {
    standup: "standup",
    draw: "draw",
    clock: "clock",
    main: "main",
    climax: "climax",
    attack: "attack",
    end: "end"
}

// creates the viewable to all players section of the field
function createstage() {
    return {
	center: [],
	back: []
    }
}

function createfield() {
    return {
	stage : createstage(),
	memory : [],
	waiting_room : [],
	clock: [],
	level: [],
	climax: [],
	deck: [],
	stock: [],
	hand: [],
	reset() {
	}
    }
}

const GameStateFactory = function() {
    return fromJS({
	phase: null, // the current phase, string symbol
	turn: 0,  // the current turn num ( even turns are player1 turn, odd turn are player2 )
	player1: createfield(),  // player1 current stage
	player2: createfield()   // player2 current stage	
    })
}

function start(gamestate) {
    
    return gamestate.set('phase', GamePhases.standup).set('turn',0);
}

function currentplayer(gamestate) {
    return 'player' + ((gamestate.get('turn') % 2) + 1);
}

function activecards(gamestate,player) {
    player = player || currentplayer(gamestate)
    return gamestate.getIn([player,'clock'])
	.concat(gamestate.getIn([player,'stage','center']))
	.concat(gamestate.getIn([player,'stage','back']))
	.concat(gamestate.getIn([player,'level']))
	.concat(gamestate.getIn([player,'memory']))
}

const GameState = GameStateFactory()

export { GameStateFactory, currentplayer, GamePhases, start, activecards, GameState as default };
