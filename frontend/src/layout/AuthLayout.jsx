import React, { useEffect } from 'react'
import Register from '../components/authComponent/Register'
import Login from '../components/authComponent/Login'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const AuthLayout = () => {
  const navigate = useNavigate();
    const [toggle, settoggle] = useState(true)
    const {user,isLoggedIn} = useSelector((state)=>state.auth)

    useEffect(()=>{
      if(isLoggedIn&&user){
        navigate("/home");
      }

      
    },[user,isLoggedIn,navigate])


  return (
    <div className='w-screen h-screen'>
        {toggle?(<Login settoggle={settoggle}/>):(<Register settoggle={settoggle}/>)}
    </div>
  )

}

export default AuthLayout