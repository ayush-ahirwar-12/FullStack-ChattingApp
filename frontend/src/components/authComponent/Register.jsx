import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { UserRegisterApi } from "../../actions/AuthAction";
import { MessageCircle, Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";
import { toast } from "react-toastify";

const Register = ({ settoggle }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      let res = dispatch(UserRegisterApi(data));
      if (res) {
        toast.success("User Registered Successfully")
      }
    } catch (error) {
      console.log("error in user register", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all duration-300 hover:scale-[1.02]">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-white/20 to-white/5 rounded-full mb-4 backdrop-blur-sm border border-white/30 shadow-lg transform transition-transform hover:rotate-12 duration-300">
              <MessageCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Join Us
            </h1>
            <p className="text-white/70 text-sm">
              Create an account to start chatting
            </p>
          </div>

          <div onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'fullname' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type="text"
                  {...register("fullname", {
                    required: "Full Name is required",
                    minLength: {
                      value: 3,
                      message: "Full Name must be at least 3 characters",
                    },
                  })}
                  onFocus={() => setFocusedField('fullname')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.fullname ? 'border-red-400' : 'border-white/30'
                  } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  placeholder="Enter your full name"
                />
                {focusedField === 'fullname' && (
                  <div className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none animate-pulse"></div>
                )}
              </div>
              {errors.fullname && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1 animate-bounce">
                  <span className="inline-block w-1 h-1 bg-red-300 rounded-full"></span>
                  {errors.fullname.message}
                </p>
              )}
            </div>

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
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
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
              {errors.email && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1 animate-bounce">
                  <span className="inline-block w-1 h-1 bg-red-300 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

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
                      value: 8,
                      message: "Password must be at least 8 characters",
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
              {errors.password && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1 animate-bounce">
                  <span className="inline-block w-1 h-1 bg-red-300 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "The passwords do not match",
                  })}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
                    errors.confirmPassword ? 'border-red-400' : 'border-white/30'
                  } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200 transform hover:scale-110"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {focusedField === 'confirmPassword' && (
                  <div className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none animate-pulse"></div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-300 text-xs mt-1 flex items-center gap-1 animate-bounce">
                  <span className="inline-block w-1 h-1 bg-red-300 rounded-full"></span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-linear-to-r from-white/90 to-white/70 text-purple-600 font-semibold py-3 px-6 rounded-xl hover:from-white hover:to-white/90 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                  Registering...
                </>
              ) : (
                <>
                  Register
                  <UserPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Already Have an Account?{" "}
              <button
                onClick={() => settoggle(true)}
                className="text-white font-semibold hover:underline transition-all duration-200 hover:text-white/90"
              >
                Login Now
              </button>
            </p>
          </div>

          <div className="absolute -top-2 -right-2 w-20 h-20 bg-pink-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl"></div>
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-white/50 text-xs">
            <div className="w-12 h-px bg-white/30"></div>
            <span>Secure Registration</span>
            <div className="w-12 h-px bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register