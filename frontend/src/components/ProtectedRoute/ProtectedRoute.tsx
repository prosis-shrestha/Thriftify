import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { ThriftContext } from "../../context/Context";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const context = useContext(ThriftContext);

  if (!context) {
    throw new Error("ProtectedRoute must be used within ThriftContextProvider");
  }

  const {
    state: { user },
  } = context;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
