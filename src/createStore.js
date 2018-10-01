import {applyMiddleware, createStore,} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import promiseMiddleware from 'redux-promise';
import rootReducer from './state';

export default (initialState) => {

  const appliedMiddleware = applyMiddleware(promiseMiddleware);
  const enhancer = composeWithDevTools(appliedMiddleware);

  return createStore(rootReducer, initialState, enhancer);
}