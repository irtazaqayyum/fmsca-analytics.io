import { produce } from "immer";
import * as types from "./actionTypes";
import { CSVState } from "./types";



const INITIAL_STATE: CSVState = {
  records: [],
};

const CsvReducer = produce((state: any, action: any) => {
  switch (action.type) {
    case types.ADD_RECORDS:
      console.log("add records")
      //const compressedData = LZString.compress(JSON.stringify(action.payload));
      //localStorage.setItem('compressedCsvData', compressedData);
      return {
        ...state,
        records: action.payload,
      };
    case types.GET_RECORDS:
      return state;
  }
}, INITIAL_STATE);

export default CsvReducer;
