import { combineReducers, createStore, applyMiddleware } from 'redux';
import {
  authReducer,
  userPanelReducer,
  modalReducer,
  dataReducer,
} from 'src/redux/reducers';

// Simple thunk middleware for async actions
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

const rootReducer = combineReducers({
  auth: authReducer,
  userPanel: userPanelReducer,
  modal: modalReducer,
  data: dataReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
