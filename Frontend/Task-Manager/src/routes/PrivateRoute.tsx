import { Outlet } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  return <Outlet />;
};

export default PrivateRoute;
