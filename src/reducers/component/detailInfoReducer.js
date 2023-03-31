const initialState = {
  data: [],
};

const detailInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_INFO":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default detailInfoReducer;
