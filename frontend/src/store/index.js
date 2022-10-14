import { legacy_createStore as createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
// createStore is depreciate. Use configure Store instead

import thunkMiddleware from 'redux-thunk';

import { authReducer } from './reducers/authReducer';
import { messengerReducer } from './reducers/messengerReducer';
import { offerReducer } from './reducers/offerReducer';

const rootReducer = combineReducers({
    // add here all reducers
    auth: authReducer,
    messenger: messengerReducer,
    offer: offerReducer
})

const middleware = [thunkMiddleware]

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

export default store;