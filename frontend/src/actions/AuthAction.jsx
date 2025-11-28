import axios from "axios";
import { axiosInstance } from "../axios/axios";
import { addUser, removeUser, setOnlineUsers, setSelectedUser } from "../reducers/AuthSlice";
import { persistor } from "../store/Store";
import { clearLogoutTimer, setLogoutTimer } from "../utils/AuthTimer";
import { setMessage } from "../reducers/UserchatSlice";
import { jwtDecode } from "jwt-decode";

export const UserRegisterApi = (data) => async (dispatch) => {
  try {
    let res = await axiosInstance.post("/auth/register", data);
    if (res) {
      dispatch(addUser(res.data.user));
    }
  } catch (error) {
    console.log("error in register userApi", error);
  }
};

export const UserLoginApi = (data) => async (dispatch) => {
  try {
    let res = await axiosInstance.post("/auth/login", data);
    console.log(res);
    dispatch(loginSuccess(res.data.token, res.data.user));

    if (res) {
      await dispatch(addUser(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.log("error in login userApi", error);
  }
};

export const UserLogoutApi = () => async (dispatch) => {
  try {
    let res = await axiosInstance.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (res) {
      dispatch(removeUser());
      dispatch(setOnlineUsers(null))
      dispatch(setMessage(null))
      persistor.purge();
      console.log("user logout");
    }
  } catch (error) {
    console.log("error in user logout", error);
  }
};

export const setSelectedUserforSideBar = (data) => async (dispatch) => {
  try {
    let res = dispatch(setSelectedUser(data));
    console.log(res);
  } catch (error) {
    console.log("error in setting the user");
  }
};

export const removeSelectedUserforSideBar = () => async (dispatch) => {
  try {
    dispatch(setSelectedUser(null));
  } catch (error) {
    console.log("error in removing the user");
  }
};

export const UpdateProfileInfo = (data) => async (dispatch) => {
  try {
    let res = await axiosInstance.put("/auth/updateprofile", data);
    if (res) {
      console.log("profile info updated");
    }
  } catch (error) {
    console.log("error in profile updation", error);
  }
};

export const loginSuccess = (token, user) => (dispatch) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // if (api && api.defaults) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  dispatch(addUser(user));

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 > Date.now()) {  // Check if actually expired
      setLogoutTimer(dispatch, decoded.exp);
    }
  } catch (error) {
    dispatch(logout());
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  clearLogoutTimer();
  console.log("out");

  dispatch(removeUser());
};
