import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeSelectedUserforSideBar } from '../actions/AuthAction';

const ChatHeader = () => {
  const dispatch = useDispatch();
  const { SelectedUser } = useSelector((state) => state.auth);

  return (
    <div className="p-4 border-b border-blue-200 bg-linear-to-r from-blue-100 to-white rounded-tr-3xl shadow-md flex items-center justify-between select-none">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-300 shadow-sm">
          <img
            src={SelectedUser?.profilepic || "https://imgs.search.brave.com/5LcPZHHABtFumbI-buPjW-U0buNcqE-R2eKKeh6vWgQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjE3/MTM4MjYzMy92ZWN0/b3IvdXNlci1wcm9m/aWxlLWljb24tYW5v/bnltb3VzLXBlcnNv/bi1zeW1ib2wtYmxh/bmstYXZhdGFyLWdy/YXBoaWMtdmVjdG9y/LWlsbHVzdHJhdGlv/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9WndPRjZOZk9S/MHpoWUM0NHhPWDA2/cnlJUEFVaER2QWFq/clBzYVo2djEtdz0"}
            alt={SelectedUser?.fullname || "User Avatar"}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div>
          <h3 className="text-blue-800 font-semibold text-lg">{SelectedUser?.fullname || "Unknown User"}</h3>
          <p className="text-sm text-blue-600 opacity-70">
            {/* Online status can go here */}
          </p>
        </div>
      </div>
      <button
        onClick={() => dispatch(removeSelectedUserforSideBar())}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow-sm transition-colors duration-200"
        aria-label="Close chat"
      >
        Close
      </button>
    </div>
  );
};

export default ChatHeader;
