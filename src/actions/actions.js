export const addData = (data) => ({
  type: "ADD_DATA",
  payload: data,
});

export const updateData = (data) => ({
  type: "UPDATE_DATA",
  payload: data,
});

export const setBoolValue = (value) => ({
  type: "UPDATE_STATE",
  payload: value,
});

export const updateInfo = (data) => ({
  type: "UPDATE_INFO",
  payload: data,
});
