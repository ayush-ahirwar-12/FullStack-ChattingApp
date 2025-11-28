import { fetchMessage } from "../actions/userAction"; 
import React, { useEffect, useRef } from "react"; 
import { useParams } from "react-router"; 
import { useDispatch, useSelector } from "react-redux"; 
 
const MessagePage = () => { 
  const { id } = useParams(); 
  const dispatch = useDispatch(); 
  const { messages } = useSelector((state) => state.chat); 
  const { user, SelectedUser } = useSelector((state) => state.auth); 
  const messagesEndRef = useRef(null); 
 
  useEffect(() => { 
    dispatch(fetchMessage(id)); 
  }, [id]); 
 
  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]); 
   
 
  return ( 
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-linear-to-tr from-white to-blue-50 rounded-tr-3xl rounded-br-3xl shadow-inner scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100"> 
      {messages?.map((msg, index) => { 
        const isMe = msg.SenderId === user?._id; 
        const hasText = msg.text && msg.text.trim() !== "";
        const hasImage = msg.image;
 
        return ( 
          <div 
            key={index} 
            className={`flex items-end gap-4 ${ 
              isMe ? "justify-end" : "justify-start" 
            }`} 
          > 
            {!isMe && ( 
              <img 
                src={SelectedUser?.profilepic || "https://imgs.search.brave.com/5LcPZHHABtFumbI-buPjW-U0buNcqE-R2eKKeh6vWgQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjE3/MTM4MjYzMy92ZWN0/b3IvdXNlci1wcm9m/aWxlLWljb24tYW5v/bnltb3VzLXBlcnNv/bi1zeW1ib2wtYmxh/bmstYXZhdGFyLWdy/YXBoaWMtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9WndPRjZOZk9S/MHpoWUM0NHhPWDA2/cnlJUEFVaER2QWFq/clBzYVo2djEtdz0"} 
                alt={`${SelectedUser?.fullname} profile`} 
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-blue-300 shadow-sm" 
              /> 
            )} 
            <div className={`max-w-[70%] flex flex-col  ${isMe?"items-end":"items-start"}`}> 
              {hasImage && ( 
                <img 
                  src={msg.image} 
                  alt="img" 
                  className={`rounded-lg shadow-lg ${
                    hasText ? "mb-2 max-w-[50%]" : "max-w-[70%]"
                  }`}
                /> 
              )} 
              {hasText && (
                <div 
                  className={`px-5 py-3 rounded-3xl shadow-md text-sm font-medium ${ 
                    isMe 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white text-gray-900 rounded-bl-none" 
                  }`} 
                > 
                  {msg.text} 
                </div> 
              )}
              <div className="text-[10px] text-gray-500 mt-1 text-right select-none"> 
                {new Date(msg.createdAt).toLocaleTimeString([], { 
                  hour: "2-digit", 
                  minute: "2-digit", 
                })} 
              </div> 
            </div> 
            {isMe && ( 
              <img 
                src={user?.profilepic} 
                alt={`${user?.fullname} profile`} 
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 shadow-sm" 
              /> 
            )} 
          </div> 
        ); 
      })} 
      <div ref={messagesEndRef}></div> 
    </div> 
  ); 
}; 
 
export default MessagePage;