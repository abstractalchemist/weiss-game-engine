import React from 'react'
import { Nav, Drawer, Body, Menu } from 'ui-utils';
import { GamePhases, activecards } from './game_state'
import { Observable } from 'rxjs/Rx'
import { field, fieldReverse } from './field'

class Main extends React.Component {
    constructor(props) {
	super(props)
	this.state = { game_state: props.game_state }
	this.controller = props.controller;
	this.dispatcher = props.dispatcher;
	this.controller.registerUI(gs => {
	    this.setState({game_state:gs})
	})
    }

    beginGame(evt) {
	let dialog = document.querySelector('#opts-start')
	dialog.close()
	setTimeout(this.runTurn.bind(this), 1000)
    }

    setNextTask(task) {
	this.continueTask = task;
    }

    
    
    runTurn() {
	this.controller.runPhases(this.controller.phases(),0)
    }
    
    initGame(evt) {
	let dialog = document.querySelector('#opts-start');
	if(!dialog.showModal)
	    dialogPolyfill.registerDialog(dialog)
	dialog.showModal();
    }

    componentDidMount() {
	componentHandler.upgradeDom()
    }

    randomPlayer1() {

    }

    randomPlayer2() {
    }
    
    render() {
	const title = "Game Simulator"
	return (<div className="mdl-layout mdl-js-layout">
		<Nav title={title} />
		<Drawer title={title} />
		<Body>
		<div className="mdl-grid">
		<div className="mdl-cell mdl-cell--1-col">
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.initGame.bind(this)}>
		Start
		</button>
		</div>
		<div className="mdl-cell mdl-cell--1-col">
		<span id="game-state" className="mdl-chip"><span className="mdl-chip__text">{this.state.game_state.get('phase')}</span></span>
		</div>
		<div className="mdl-cell mdl-cell--1-col">
		<span id="game-turn" className="mdl-chip"><span className="mdl-chip__text">{this.state.game_state.get('turn')}</span></span>
		</div>
		
		<div className="mdl-cell mdl-cell--9-col"/>
		{fieldReverse()}
		<div className="mdl-cell mdl-cell--12-col" style={{height:"20rem"}}/>
		{field()}
		
		</div>
		<dialog  className="mdl-dialog" id="opts-start">
		<h4 className="mdl-dialog__title">Select Decks to Use</h4>
		<div className="mdl-dialog__content">
		</div>
		<div className="mdl-dialog__actions">
		<button className="mdl-button mdl-js-button " onClick={this.beginGame.bind(this)}>
		Begin
		</button>
		<button className="mdl-button mdl-js-button " onClick={this.randomPlayer1.bind(this)}>
		Generate Random Player1 Deck
		</button>
		<button className="mdl-button mdl-js-button " onClick={this.randomPlayer2.bind(this)}>
		Generate Random Player2 Deck
		</button>
		
		<button className="mdl-button mdl-js-button close" onClick={
		    evt => {
			let dialog = document.querySelector('#opts-start')
			dialog.close()
		    }
		}>
		Cancel
		</button>
		</div>
		</dialog>

		<dialog className="mdl-dialog">
		<h4 className="mdl-dialog__title">End of Turn {this.state.game_state.get('turn')}</h4>
		<div className="mdl-dialog__actions">
		<button className="mdl-button mdl-js-button">
		Continue
		</button>
		</div>
		</dialog>
		
		</Body>
		</div>)
    }
  
}

export { Main as default }
