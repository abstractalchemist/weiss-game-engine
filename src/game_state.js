// implements the data structure for the entire game state
// the state object itself is considered ( opaque ).  access to properties should be done through provided functions


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
	get deck() {
	},
	set deck(param) {
	},
	get stock() {
	},
	set stock(param) {
	},
	get hand() {
	},
	set hand(param) {
	}
	
    }
}

const GameStateFactory = function() {
    return {
	phase: null, // the current phase, string symbol
	turn: 0,  // the current turn num ( even turns are player1 turn, odd turn are player2 )
	player1: createfield(),  // player1 current stage
	player2: createfield(),   // player2 current stage
	
	reset() {
	    this.phase = null;
	    this.turn = null;
	    this.player1 = createfield();
	    this.player2 = createfield();
	},
	start() {
	    this.phase = "draw";
	    this.turn = 0;
	},
	field(player) {
	    if(player === 0)
		return this.player1
	    else if(player === 1)
		return this.player2
	}
    }
}

function currentplayer(gamestate) {
    return gamestate.turn % 2;
}

function getfieldposition(gamestate, player, position) {
    return gamestate.field(player)[position];
}

function updatefieldposition(gamestate, player, position, newval) {
    gamestate.field(player)[position] = newval
}

// gets the memory, if player provided, get the memory of that player, if new val provided, set to the new val
function memory({gamestate,player,newval}) {
    player = player || currentplayer(gamestate)
    if(newval)
	updatefieldposition(gamestate, player, 'memory', newval)
    return getfieldposition(gamestate, player, 'memory')
	
}

function turn({turn}) {
    return turn;
}

function phase({phase}) {
    return phase
}

const GamePhases = {
    standup: "standup",
    draw: "draw",
    clock: "clock",
    main: "main",
    climax: "climax",
    attack: "attack",
    end: "end"
}

function updatephase(gamestate, phase) {
    if(GamePhases[phase])
	gamestate.phase = phase;
    throw `Unknown phase: ${phase}`
}

const GameState = GameStateFactory()

export { GameStateFactory, GamePhases, memory, turn, phase, GameState as default };
