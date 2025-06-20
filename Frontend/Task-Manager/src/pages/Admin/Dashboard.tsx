import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useUserContext } from "../../hooks/useUserContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import {
  LuClipboardList,
  LuClock,
  LuPlay,
  LuArrowRight,
  LuCheckCheck,
} from "react-icons/lu";
import InfoCard from "../../components/ui/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import TaskListTable from "../../components/TaskListTable";

interface DashboardData {
  charts: {
    taskDistribution: {
      All: number;
      Pending: number;
      InProgress: number;
      Compeleted: number;
    };
  };
  recentTasks: {
    _id: string;
    title: string;
    status: string;
    priority: string;
    createdAt?: string;
  }[];
}

const Dashboard = () => {
  useUserAuth();

  const { user } = useUserContext();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetch users: ", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Welcome Card */}
      <div className="card my-5">
        <div className="card-header">
          <h2 className="card-title text-xl md:text-2xl">
            Good Morning! {user?.name}
          </h2>
          <p className="card-subtitle text-xs md:text-sm mt-1.5">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <InfoCard
            icon={<LuClipboardList />}
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuClock />}
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-yellow-500"
          />

          <InfoCard
            icon={<LuPlay />}
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            icon={<LuCheckCheck />}
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Compeleted || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h5 className="card-title">Recent Tasks</h5>
            <button className="card-btn" onClick={onSeeMore}>
              See All <LuArrowRight className="text-base" />
            </button>
          </div>
        </div>

        <TaskListTable tableData={dashboardData?.recentTasks || []} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
