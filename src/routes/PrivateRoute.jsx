import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (user) return children;
  return <Navigate to="/login" />;
}

export default PrivateRoute;
