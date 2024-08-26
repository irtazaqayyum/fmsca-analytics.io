import { combineReducers } from 'redux';
import CsvReducer from './record/reducer';

const rootReducer = combineReducers({
  Csv: CsvReducer,
  // Add other reducers here as needed
});

export type AuthState = ReturnType<typeof rootReducer>;

export default rootReducer;