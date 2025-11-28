import { createSlice } from "@reduxjs/toolkit";

const UserchatSlice = createSlice({
    name:"chat",
    initialState:{
        messages:[],
        users:[],
        selectedUser:null,
        isUserLoading:false,
        isMessagesLoading:false,

    },
    reducers:{
        getUsers:(state,action)=>{
            state.users=action.payload
            state.isUserLoading=true;
        },
        setisuserloading:(state,action)=>{
            state.isUserLoading=false;
        },
        addMessage:(state,action)=>{
             if (!action.payload.text) return;
            state.messages.push(action.payload);
        },
        setMessage:(state,action)=>{
            state.messages=action.payload;
        }
        

    }
})


export const {getUsers,setisuserloading,addMessage,setMessage} = UserchatSlice.actions;
export default UserchatSlice.reducer;