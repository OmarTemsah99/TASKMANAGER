import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useUserContext } from "../../hooks/useUserContext";

const Dashboard = () => {
  useUserAuth();

  const { user } = useUserContext();

  return <DashboardLayout activeMenu="Dashboard">Dashboard</DashboardLayout>;
};

export default Dashboard;
