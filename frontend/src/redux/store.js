import { combineReducers, createStore } from 'redux';
import {
  authReducer,
  userPanelReducer,
  modalReducer,
} from 'src/redux/reducers';

const rootReducer = combineReducers({
  auth: authReducer,
  userPanel: userPanelReducer,
  modal: modalReducer,
});

export const store = createStore(rootReducer);
