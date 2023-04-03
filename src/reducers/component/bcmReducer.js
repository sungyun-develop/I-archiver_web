const initialState = {
  data: [],
};

const currReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_BCM":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default currReducer;
