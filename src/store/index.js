import { legacy_createStore as createStore, compose, combineReducers, applyMiddleware } from 'redux';

// createStore is depreciate. Use configure Store instead

import thunkMiddleware from 'redux-thunk';

const rootReducer = combineReducers({
    // add here all reducers

})

const middleware =  [thunkMiddleware] 

const store = createStore(rootReducer, compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

export default store;