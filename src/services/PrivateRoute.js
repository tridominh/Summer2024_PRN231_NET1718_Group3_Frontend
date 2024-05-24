// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import parseJwt from './parseJwt';
import useToken from './useToken';

const PrivateRoute = ({role, children}) => {
  const {token} = useToken();
  if(!token) return <Navigate to="/login"/>;
  const userRole = parseJwt(token).role;
  
  if(userRole==role){
    return children;
  }
  return <Navigate to="/login"/>;
};

export default PrivateRoute;
