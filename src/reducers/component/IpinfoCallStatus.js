const initialState = {
  data: 0,
};

const ipinfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_IPINFO":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default ipinfoReducer;
