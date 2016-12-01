import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'logger';
import { Provider } from 'react-redux'
import App from './containers/App'
import reducer from './reducers'
import 'todomvc-app-css/index.css'

const logger = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(logger)
));

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

document.addEventListener("keydown", (e) => {
    if (e.key == 'ArrowDown') {
        store.dispatch({ type: '@@logger-connect' })
    }
}, false);
