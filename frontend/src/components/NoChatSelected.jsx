import React from 'react';

const NoChatSelected = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-linear-to-tr from-white to-blue-50 rounded-tr-3xl rounded-br-3xl select-none">
      <h2 className="text-3xl font-bold text-blue-800 mb-4">No Chat Selected</h2>
      <p className="text-blue-600 max-w-sm text-center px-4 leading-relaxed">
        Please select a chat from the left panel to start messaging your friends.
      </p>
    </div>
  );
};

export default NoChatSelected;
