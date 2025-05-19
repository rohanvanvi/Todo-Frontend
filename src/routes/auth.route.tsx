import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  const _isAuthRoute = isAuthRoute(location.pathname);

  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />;

  // Handle root path redirect
  if (user && location.pathname === '/') {
    // If user has a current workspace, redirect to it
    if (user.currentWorkspace) {
      return <Navigate to={`/workspace/${user.currentWorkspace}`} replace />;
    }
    // Otherwise redirect to /workspace
    return <Navigate to="/workspace" replace />;
  }

  // Handle /workspace path without ID
  if (user && location.pathname === '/workspace') {
    // If user has a current workspace, redirect to it
    if (user.currentWorkspace) {
      return <Navigate to={`/workspace/${user.currentWorkspace}`} replace />;
    }
    // Otherwise show workspace selection UI
    return <Outlet />;
  }

  return <Outlet />;
};

export default AuthRoute;