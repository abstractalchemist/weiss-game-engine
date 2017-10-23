import React from 'react'
import { Nav, Drawer, Body } from 'ui-utils';
import { GameStoreFactory } from './game_state'

function spacerSlot(id, width) {
    return <div key={id} id={id}  className={"mdl-cell mdl-cell--" + width + "-col spacer"} /> 
}

function cardSlot(id) {
    return <div key={id} id={id} className="mdl-cell mdl-cell--2-col card" />
}

function fieldReverse() {
    let center= [ spacerSlot('spacer-1', 2),  // spacer
		  cardSlot('left-center-player2'),  // left center
		  cardSlot('middle-center-player2'),  // middle center
		  cardSlot('right-center-player2'),  // right center
		  spacerSlot('spacer-2',2),  // spacer
		  cardSlot('memory-player2')]  // memory
    
    let back = [ cardSlot('climax-player2'), // climax
		 spacerSlot('spacer-3',1), //spacer
		 cardSlot('back-left-player2'), // back left
		 cardSlot('back-right-player2'), // back right
		 spacerSlot('spacer-4',3),  // spacer
		 cardSlot('deck-player2') ] // deck
    
    let behind = [cardSlot('stock-player2'),
		  spacerSlot('spacer-5',1),
		  cardSlot('clock-player2'),
		  cardSlot('level-player2'),
		  spacerSlot('spacer-12',3),
		  cardSlot('waiting-player2')]
    return [].concat(behind.reverse(),back.reverse(),center.reverse())
    
}

function field() {
    let center= [ spacerSlot('spacer-6',2),  // spacer
		  cardSlot('left-center-player1'),  // left center
		  cardSlot('middle-center-player1'),  // middle center
		  cardSlot('right-center-player1'),  // right center
		  spacerSlot('spacer-7',2),  // spacer
		  cardSlot('memory-player1')]  // memory
    
    let back = [ cardSlot('climax-player1'), // climax
		 spacerSlot('spacer-8',1), //spacer
		 cardSlot('back-left-player1'), // back left
		 cardSlot('back-right-player1'), // back right
		 spacerSlot('spacer-9', 3),  // spacer
		 cardSlot('deck-player1') ] // deck
    
    let behind = [cardSlot('stock-player1'),
		  spacerSlot('spacer-10', 1),
		  cardSlot('clock-player1'),
		  cardSlot('level-player1'),
		  spacerSlot('spacer-11',3),
		  cardSlot('waiting-player1')]
    return [].concat(center,back,behind)
}

class Main extends React.Component {
    constructor(props) {
	super(props)
    }

    render() {
	const title = "Game Simulator"
	return (<div className="mdl-layout mdl-js-layout">
		<Nav title={title} />
		<Drawer title={title} />
		<Body>
		<div className="mdl-grid">
		{fieldReverse()}
		<div className="mdl-cell mdl-cell--12-col" style={{height:"20rem"}}/>
		{field()}
		
		</div>
		</Body>
		</div>)
    }
  
}

export { Main as default }
