import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import toast from 'react-hot-toast';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isConnected = useSelector((state: RootState) => state.wallet.isConnected);

  if (!isConnected) {
    toast.error("You must connect your MetaMask wallet to access this page.");
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

export default PrivateRoute;
