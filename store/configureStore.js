import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import countryListReducer from './reducers/countryList';
import tracksReducer from './reducers/tracks';
import authReducer from './reducers/auth';

const rootReducer = combineReducers({
  countryList: countryListReducer,
  tracks: tracksReducer,
  auth: authReducer
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;