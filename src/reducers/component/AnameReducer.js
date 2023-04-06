const initialState = {
  data: " ",
};

const AnameReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_Aname":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export default AnameReducer;
