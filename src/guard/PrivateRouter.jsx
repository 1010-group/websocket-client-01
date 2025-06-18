import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRouter = ({ children }) => {
  const user = useSelector(state => state.auth.isAuthenticated)
  console.log("INFO: " , user)
  useEffect(() => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
  }, [user])

  return children
}

export default PrivateRouter
