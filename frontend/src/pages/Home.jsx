import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import SideUser from '../components/SideUser';
import { Outlet } from 'react-router';
import { getuserforbar } from '../actions/UserAction';
import NoChatSelected from '../components/NoChatSelected';

const Home = () => {
  const { SelectedUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [alluser, setalluser] = useState([]);
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const getuserforleftbar = async () => {
    let res = await dispatch(getuserforbar());
    if (res) {
      setalluser(res);
    }
  };

  // Handle responsive behavior with resize listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On desktop, always show left panel
      if (!mobile) {
        setIsLeftPanelVisible(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mobile chat selection behavior
  useEffect(() => {
    if (isMobile) {
      // On mobile: hide left panel when chat selected, show when no chat
      setIsLeftPanelVisible(!SelectedUser);
    } else {
      // On desktop: always show left panel
      setIsLeftPanelVisible(true);
    }
  }, [SelectedUser, isMobile]);

  useEffect(() => {
    getuserforleftbar();
  }, []);

  // Function to handle back button on mobile
  const handleBackToChats = () => {
    if (isMobile) {
      setIsLeftPanelVisible(true);
    }
  };

  return (
    <div className='w-screen h-screen bg-[#F0F2F5]'> 
      <Navbar /> 
      
      <div className='w-full h-[calc(100vh-70px)] flex justify-center items-center py-2 sm:py-5 px-0 sm:px-4 md:px-10 lg:px-20'>
        <div className='w-full max-w-[1400px] h-full bg-white shadow-xl flex overflow-hidden rounded-none sm:rounded-lg'>
          
          {/* Contacts/Chats List Panel */}
          <div 
            className={`
              h-full border-r border-gray-200 flex-col 
              transition-all duration-300 ease-in-out
              ${isLeftPanelVisible ? 'flex w-full md:w-[35%] lg:w-[30%]' : 'hidden md:flex md:w-[35%] lg:w-[30%]'}
            `}
          >
            <div className='p-4 bg-gray-100 text-lg font-semibold text-gray-700 border-b border-gray-200'>
              Chats
            </div>
            
            <div className='flex-1 overflow-y-auto'>
              {alluser?.map((elem, i) => (
                <SideUser elem={elem} key={i} />
              ))}
            </div>
          </div>
          
          {/* Chat View Panel */}
          <div 
            className={`
              h-full flex flex-col
              transition-all duration-300 ease-in-out
              ${!isLeftPanelVisible ? 'flex w-full md:w-[65%] lg:w-[70%]' : 'hidden md:flex md:w-[65%] lg:w-[70%]'}
            `}
          >
            <div className='flex-1 overflow-hidden'>
              {SelectedUser ? <Outlet context={{ isMobile, handleBackToChats }} /> : <NoChatSelected />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;