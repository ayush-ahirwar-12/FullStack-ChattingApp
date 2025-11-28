import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setSelectedUser } from "../reducers/AuthSlice";

const SideUser = ({ elem }) => {
  const navigate = useNavigate();
  const { OnlineUsers } = useSelector((state) => state.auth);
  const isOnline = OnlineUsers.some((u) => u.userId === elem._id);
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        navigate(`/home/chat/${elem._id}/${elem.fullname}`);
        dispatch(setSelectedUser(elem));
      }}
      className="w-full relative flex px-6 py-4 items-center gap-5 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors duration-200 rounded-r-3xl select-none"
    >
      <div className="relative">
        <div className={`absolute left-[70%] top-[75%] w-4 h-4 rounded-full ${isOnline?"bg-green-500":"bg-zinc-500"}`}></div>

        <img
          className="w-16 h-16 rounded-full object-cover object-top border-2 border-blue-300"
          src={
            elem.profilepic ||
            "https://imgs.search.brave.com/5LcPZHHABtFumbI-buPjW-U0buNcqE-R2eKKeh6vWgQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjE3/MTM4MjYzMy92ZWN0/b3IvdXNlci1wcm9m/aWxlLWljb24tYW5v/bnltb3VzLXBlcnNv/bi1zeW1ib2wtYmxh/bmstYXZhdGFyLWdy/YXBoaWMtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9WndPRjZOZk9S/MHpoWUM0NHhPWDA2/cnlJUEFVaER2QWFq/clBzYVo2djEtdz0"
          }
          alt={`${elem.fullname} profile`}
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-blue-800 font-semibold text-lg">{elem.fullname}</h1>
        <span className="text-blue-500 text-sm">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default SideUser;
