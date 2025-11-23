import { combineReducers, createStore, applyMiddleware } from 'redux';
import {
  authReducer,
  userPanelReducer,
  devicePanelReducer,
  modalReducer,
  onboardingReducer,
  dataReducer,
  mapReducer,
} from 'src/redux/reducers';

const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

const rootReducer = combineReducers({
  auth: authReducer,
  userPanel: userPanelReducer,
  devicePanel: devicePanelReducer,
  modal: modalReducer,
  onboarding: onboardingReducer,
  data: dataReducer,
  map: mapReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
