let token = localStorage.getItem("token") ? localStorage.getItem("token") : "";
let loggedIn = localStorage.getItem("token").length > 10 ? true : false;


const initialState = {
  token: token,
  user: {},
  loggedIn: loggedIn,
};

const loginReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_TOKEN":
      return { token: payload.token, user: payload.user, loggedIn: payload.loggedIn };
    default:
      return state;
  }
};

export default loginReducer;

//Action
export const setToken = (userLog) => {
  return { type: "SET_TOKEN", payload: userLog };
};
