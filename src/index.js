import ReactDOM from 'react-dom'
import React from 'react'
import Main from './main'
import { GameStateFactory } from './game_state'
import { ControllerFactory } from './controller'
import { DispatcherFactory } from './event_dispatcher'

document.addEventListener('DOMContentLoaded', _ => {
    const game_state = GameStateFactory();
    const dispatcher = DispatcherFactory();
    const controller = ControllerFactory(game_state, dispatcher)
    ReactDOM.render( <Main game_state={game_state} dispatcher={dispatcher} controller={controller}/>, document.querySelector('#content'));
})
