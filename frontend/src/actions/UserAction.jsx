import { axiosInstance } from "../axios/axios";
import {
  getUsers,
  setisuserloading,
  addMessage,
  setMessage,
} from "../reducers/UserchatSlice";

export const ProfilepicUploader = (data) => async (dispatch) => {
  try {
    let res = await axiosInstance.put("/auth/profilepic", data);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("error in userprofilepicuploader", error);
  }
};

export const getuserforbar = (data) => async (dispatch) => {
  try {
    let res = await axiosInstance.get("/message/getuser");

    dispatch(getUsers(res.data.AllUsers));

    if (res) {
      return res.data.AllUsers;
    }
  } catch (error) {
    console.log("error in getuser", error);
  } finally {
    dispatch(setisuserloading());
  }
};



export const sendMessage = (data) => async (dispatch) => {
  try {
    
    dispatch(addMessage(data));
  } catch (error) {
    console.log("error in send message", error);
  }
};

export const fetchMessage = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/message/getmessage/${id}`);
    console.log(res);
    
    dispatch(setMessage(res.data.messages));
  } catch (error) {
    console.log("Fetch messages error ➜ ", error);
  }
};
