import React, { useEffect, useMemo } from "react";
import AppRouter from "./router/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "./axios/axios";
import { logout } from "./actions/AuthAction";
import { addUser, clearAuth, setOnlineUsers } from "./reducers/AuthSlice";
import { setLogoutTimer } from "./utils/AuthTimer";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";


const App = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth)
  const socket = useMemo(
    () => io("http://localhost:5000", { autoConnect: true }),
    []
  );
  // useEffect(() => {
  //   (async()=>{
  //     let res = await axiosInstance.get("/auth/check",{withCredentials:true});
  //     if(res){
  //       dispatch(res?.data?.user)
  //     }
  //   })
  // },[dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.get('/auth/check');
          if (response?.data?.user) dispatch(addUser(response.data.user));
        } catch (error) {
          localStorage.removeItem('token');
          dispatch(clearAuth());
        }
      }
    };
    checkAuth();
}, []);

  useEffect(()=>{
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user");
    if(token && user){
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now()/1000;
        if(decoded.exp<currentTime){
          dispatch(logout());
        }
        else{
          dispatch(addUser(JSON.parse(user)));
          setLogoutTimer(dispatch,decoded.exp)
        }

      } catch (error) {
        dispatch(logout());
      }
    }
  },[dispatch]);

  useEffect(()=>{
    if(!user?._id)return;
    socket.emit("user-online",user._id)
  },[socket,user])

  useEffect(()=>{
    socket.on("online-users",(ActiveUsers)=>{
      dispatch(setOnlineUsers(ActiveUsers));
    });
     return () => socket.off("online-users");
  },[dispatch])

  return (
    <div className="w-screen h-screen">
      <AppRouter />
    </div>
  );
};

export default App;
