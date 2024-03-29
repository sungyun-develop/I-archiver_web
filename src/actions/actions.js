//archiver actions
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

export const updateCurravg = (data) => ({
  type: "UPDATE_CURR",
  payload: data,
});

export const updateBCM = (data) => ({
  type: "UPDATE_BCM",
  payload: data,
});

//alarm actions
export const setarcModalValue = (value) => ({
  type: "UPDATE_arcSTATE",
  payload: value,
});

export const updateAname = (data) => ({
  type: "UPDATE_Aname",
  payload: data,
});

export const updateAtime = (data) => ({
  type: "UPDATE_Atime",
  payload: data,
});

export const setModalstate = (value) => ({
  type: "UPDATE_MODAL",
  payload: value,
});

//chart component
export const updateAnnotContent = (data) => ({
  type: "UPDATE_AContent",
  payload: data,
});

export const updateTimestamp = (data) => ({
  type: "UPDATE_Timestamp",
  payload: data,
});

export const updatePVlist = (data) => ({
  type: "UPDATE_PVlist",
  payload: data,
});

export const updateipinfo = (data) => ({
  type: "UPDATE_IPINFO",
  payload: data,
});
