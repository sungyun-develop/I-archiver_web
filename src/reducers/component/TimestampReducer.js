const initialState = {
  data: [],
};

const TimestampReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_Timestamp":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default TimestampReducer;
