import { all, fork } from "redux-saga/effects";
import authSaga from "./record/saga";

export function* rootSaga() {
  yield all([
    fork(authSaga),
  ]);
}
