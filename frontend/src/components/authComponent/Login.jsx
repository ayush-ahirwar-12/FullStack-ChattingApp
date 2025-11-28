import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { UserLoginApi } from "../../actions/AuthAction";
import { MessageCircle, Mail, Lock, Eye, EyeOff, Send } from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/axios";
import { addUser, clearAuth } from "../../reducers/authSlice";

const Login = ({ settoggle }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      let res = await dispatch(UserLoginApi(data));
      if (res) {
                console.log(res.token);

        localStorage.setItem("token", res.token);
        toast.success("User loggedIn Successfully")
      }
    } catch (error) {
      console.log("error in user Login", error);
    }
  };

    const fetchUserFromGoogleAuth = async () => {
    try {
      let response = await axiosInstance.get("/auth/profile",{withCredentials:true});
      console.log(response);
      
      if (response.data?.user) {
        
        localStorage.setItem("token",response.data.token);
        dispatch(addUser(response?.data?.user))

        toast.success("google login success");
        window.location.href="/"
        console.log("comes from google authentication", response);
      }
    } catch (error) {
      console.log("error in google auth",error);
    }
  };




  const GoogleAuthHandler=async()=>{
    window.location.href="http://localhost:5000/api/auth/google"
          

  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('google')==="success"){
      fetchUserFromGoogleAuth();
      window.history.replaceState({},document.title,window.location.pathname)
    }

  },[])

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
      dispatch(clearAuth());
    }
  },[])


  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all duration-300 hover:scale-[1.02]">
          
          {/* Logo and Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-white/20 to-white/5 rounded-full mb-4 backdrop-blur-sm border border-white/30 shadow-lg transform transition-transform hover:rotate-12 duration-300">
              <MessageCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-white/70 text-sm">
              Sign in to continue chatting with friends
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Input Field */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.email ? 'border-red-400' : 'border-white/30'
                  } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  placeholder="Enter your email"
                />
                {focusedField === 'email' && (
                  <div className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none animate-pulse"></div>
                )}
              </div>
              {/* Error message styling */}
              {errors.email && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1 animate-bounce">
                  <span className="inline-block w-1 h-1 bg-red-300 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
                    errors.password ? 'border-red-400' : 'border-white/30'
                  } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200 transform hover:scale-110"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {focusedField === 'password' && (
                  <div className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none animate-pulse"></div>
                )}
              </div>
              {/* Error message styling */}
              {errors.password && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1 animate-bounce">
                  <span className="inline-block w-1 h-1 bg-red-300 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-white/70 hover:text-white text-sm transition-colors duration-200 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-white/90 to-white/70 text-purple-600 font-semibold py-3 px-6 rounded-xl hover:from-white hover:to-white/90 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                  Logging In...
                </>
              ) : (
                <>
                  Login
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Don't Have an Account?{" "}
              <button
                onClick={() => settoggle(false)}
                className="text-white font-semibold hover:underline transition-all duration-200 hover:text-white/90"
              >
                Register Now
              </button>
            </p>
            <button
        onClick={GoogleAuthHandler}
          className="w-full flex items-center justify-center gap-2 text-blue-500 font-semibold mb-2"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#2563eb" />
            <path
              d="M13.5 12H12v5H10v-5H9v-2h1v-1c0-1.104.896-2 2-2h1v2h-1c-.552 0-1 .447-1 1v1h2l-.5 2z"
              fill="#fff"
            />
          </svg>
          Log in with Google
        </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-pink-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-white/50 text-xs">
            <div className="w-12 h-px bg-white/30"></div>
            <span>Secure Login</span>
            <div className="w-12 h-px bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;