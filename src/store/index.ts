import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "./rootReducer";
import { rootSaga } from "./rootSaga";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["Csv"], // Make sure 'Csv' is the correct name of the slice in your reducer
  blacklist: [], // Optional: Add any slices you don't want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create the Redux store with the persisted reducer
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// Run the saga
sagaMiddleware.run(rootSaga);

// Create a persistor for the store
const persistor = persistStore(store);

export { store, persistor };
export default store;
