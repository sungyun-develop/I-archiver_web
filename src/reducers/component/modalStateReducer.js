const initialState = false;

const modalStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_STATE":
      return action.payload;
    default:
      return state;
  }
};

export default modalStateReducer;
