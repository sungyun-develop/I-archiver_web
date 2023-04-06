const initialState = false;

const arcmodalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_arcSTATE":
      return action.payload;
    default:
      return state;
  }
};

export default arcmodalReducer;
