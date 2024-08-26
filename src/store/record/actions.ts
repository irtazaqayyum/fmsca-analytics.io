import * as types from "./actionTypes";

export const addRecords = (data: any) => {
    return {
      type: types.ADD_RECORDS,
      payload: data,
    };
  };

  export const getRecords = (data: any) => {
    return {
      type: types.GET_RECORDS,
      payload: data,
    };
  };