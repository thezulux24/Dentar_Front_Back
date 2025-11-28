import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// store
import useAuthStore from "../../store/authStore";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <>{children}</> : <Navigate to="/autenticacion" />;
};

export default PrivateRoute;
