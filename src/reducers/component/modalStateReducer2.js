const initialState = false;

const modalStateReducer2 = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_MODAL":
      return action.payload;
    default:
      return state;
  }
};

export default modalStateReducer2;
