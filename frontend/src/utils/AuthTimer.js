import { toast } from "react-toastify";
import { removeUser } from "../reducers/AuthSlice";

let logoutTimer = null;
export const setLogoutTimer = (dispatch, expinSeconds) => {
  clearLogoutTimer();
  const msRemaining = expinSeconds * 1000 - Date.now();
  if (msRemaining <= 0) {
    dispatch(removeUser());
    toast.success("Token expired");

    return;
  }
  logoutTimer = setTimeout(() => {
    dispatch(removeUser());
  }, msRemaining);
};

export const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};
