import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

const PrivateRouter = ({ children }) => {
  const user = useSelector(state => state.auth.isAuthenticated)
  const navigate = useNavigate()

  console.log("INFO: ", user)

  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user])

  return children
}

export default PrivateRouter
