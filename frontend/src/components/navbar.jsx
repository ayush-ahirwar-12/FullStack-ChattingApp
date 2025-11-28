import React from 'react'
import { Settings,House ,User, LogOut } from 'lucide-react'
import { useDispatch } from "react-redux";
import { UserLogoutApi } from '../actions/AuthAction';
import { useNavigate } from 'react-router';


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const logoutHandler = ()=>{
        try {
            let res = dispatch(UserLogoutApi())
            navigate("/")

            
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
    <nav className="bg-gray-900 w-full h-[70px] border-b border-gray-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Heading */}
          <div className="">
            <h1 className="bg-clip-text text-white from-purple-400 to-blue-400 text-3xl font-bold tracking-tight hover:scale-105 transition-transform cursor-pointer">
              Chatty
            </h1>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Settings Button */}
            <button
            onClick={()=>navigate("/")}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
              aria-label="Settings"
            >
              <House className="w-5 h-5" />
            </button>

            {/* Profile Button */}
            <button
              onClick={()=>navigate("/profile")}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Logout Button */}
            <button
            onClick={logoutHandler}
              className="p-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-300 hover:text-white transition-all duration-200 hover:scale-110"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar