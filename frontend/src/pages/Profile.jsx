import React, { useState } from "react";
import { Camera, User, Mail, ArrowLeft, Edit2, Save, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { UpdateProfileInfo } from "../actions/AuthAction";
import { useNavigate } from "react-router";
import { addUser } from "../reducers/authSlice";
import Navbar from '../components/navbar.jsx';

const Profile = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { handleSubmit, register } = useForm();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formdata = new FormData();
    formdata.append("image", file);
    try {
      const res = await fetch("http://localhost:5000/api/auth/profilepic", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Upload failed:", data.message || res.statusText);
        return;
      }
      if (data.user?.profilepic) {
        toast.success("Profile Picture Updated");
        setProfileImage(data.user.profilepic);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    try {
      dispatch(UpdateProfileInfo(data));
      setIsEditing(false);
      toast.success("Profile Info Updated");
      dispatch(addUser({ ...user, fullname: data.fullname, email: data.email }));
      navigate("/home");
    } catch (error) {
      console.log("error in profile page->", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Restored */}
      <Navbar />

      <div className="w-full pt-0 pb-12 px-4 ">
        {/* Main Card Container */}
        <div className="max-w-2xl mx-auto  bg-white rounded-3xl shadow-2xl overflow-hidden relative mt-10">
          
          {/* Back Button - Now inside the card */}
          <button
            onClick={() => navigate("/home")}
            className="absolute top-4 left-4 z-20 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 transition-colors duration-200"
            title="Back to Home"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Decorative Header Background inside card */}
          <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-blue-600 to-indigo-700 z-0"></div>

          {/* Profile Image Section */}
          <div className="relative pt-16 pb-8 px-8 text-center z-10">
            <div className="relative inline-block group">
              <div className="w-40 h-40 rounded-full p-1 bg-white ring-4 ring-blue-50 shadow-xl mx-auto overflow-hidden">
                <img
                  src={
                    user?.profilepic ||
                    profileImage ||
                    "https://imgs.search.brave.com/v_rGoxkQW-SnfF0bGa0FnZExj4S8KlcRcnVyVdqQGpw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1DbGlw/YXJ0LnBuZw"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>

              {/* Camera Upload Button */}
              <label
                htmlFor="image-upload"
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all duration-200 group-hover:shadow-blue-500/30"
              >
                <Camera size={20} />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {user?.fullname || "User Profile"}
            </h2>
            <p className="text-gray-500 font-medium">{user?.email || "No email provided"}</p>
          </div>

          {/* Form Section */}
          <div className="p-8 bg-gray-50/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 ${isEditing ? "text-blue-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="text"
                    {...register("fullname")}
                    defaultValue={user?.fullname}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl transition-all duration-200 outline-none
                      ${isEditing 
                        ? "border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-800" 
                        : "border-transparent bg-transparent text-gray-600 font-medium cursor-default"
                      }`}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 ${isEditing ? "text-blue-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    defaultValue={user?.email}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl transition-all duration-200 outline-none
                      ${isEditing 
                        ? "border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-800" 
                        : "border-transparent bg-transparent text-gray-600 font-medium cursor-default"
                      }`}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                {isEditing ? (
                  <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 shadow-sm hover:shadow-md group"
                  >
                    <Edit2 size={18} className="group-hover:scale-110 transition-transform" />
                    Edit Profile
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;