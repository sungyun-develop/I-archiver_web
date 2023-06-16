const initialState = {
  data: [],
};

const PVlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_PVlist":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default PVlistReducer;
