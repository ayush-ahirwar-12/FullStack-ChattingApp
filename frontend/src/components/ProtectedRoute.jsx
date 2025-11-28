import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function ProtectedRoute({children}){
    const {isLoggedIn,user}=useSelector((state)=>state.auth);
    if(!isLoggedIn || !user){
        return <Navigate to="/" replace/>
    }
    return children
};