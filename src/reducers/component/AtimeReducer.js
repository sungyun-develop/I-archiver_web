const initialState = {
  data: " ",
};

const AtimeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_Atime":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default AtimeReducer;
