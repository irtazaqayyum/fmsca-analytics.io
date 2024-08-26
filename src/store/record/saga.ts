import { call, put, select, takeLatest } from "redux-saga/effects";
import { ADD_RECORDS } from "./actionTypes";

function* loginRequest({ payload }: any): Generator<any, void, any> {
  const { setBtnloading } = payload;
  try {
    // const response = yield call(axiosConfig.post, "/auth/login", {
    //   email,
    //   password,
    // });
    const user = "heloo";

  } catch (error: any) {
    setBtnloading(false);
  }
}

export default function* authSaga() {
  yield takeLatest(ADD_RECORDS, loginRequest);
}
