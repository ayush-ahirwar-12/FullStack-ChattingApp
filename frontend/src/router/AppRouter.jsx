  import React from 'react'
  import { createBrowserRouter, RouterProvider } from 'react-router'
  import AuthLayout from '../layout/AuthLayout'
  import Home from '../pages/Home'
  import Profile from '../pages/Profile'
  import UserChat from '../components/ChatContainer'
  import Login from '../components/authComponent/Login'
  import ProtectedRoute from '../components/ProtectedRoute'

  const AppRouter = () => {
      const approuter = createBrowserRouter([
          {
              path:"/",
              element:<AuthLayout/>
          },
          {
            path:"/login",
            element:<Login/>
          },
          {
            path:"/home",
            element:(
              <ProtectedRoute>
            <Home/>
            </ProtectedRoute>
          ),
            children:[
              {
                path:"chat/:id/:name",
                element:(
                  <ProtectedRoute>
                <UserChat/>
                </ProtectedRoute>)
              }
            ]
            
          },
          {
            path:"/profile",
            element:(
              <ProtectedRoute>
            <Profile/>
            </ProtectedRoute>)
          }
      ])
    return (
      <RouterProvider router={approuter} />
    )
  }

  export default AppRouter