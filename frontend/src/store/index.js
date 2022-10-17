import { legacy_createStore as createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';

import thunkMiddleware from 'redux-thunk';

import { authReducer } from './reducers/authReducer';
import { messengerReducer } from './reducers/messengerReducer';
import { offerReducer } from './reducers/offerReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    messenger: messengerReducer,
    offer: offerReducer
})

const middleware = [thunkMiddleware]

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;