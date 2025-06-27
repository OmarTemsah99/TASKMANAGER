import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useUserContext } from "../../hooks/useUserContext";
import { useCallback, useEffect, useState } from "react";
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
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

interface DashboardData {
  charts: {
    taskDistribution: {
      All: number;
      Pending: number;
      InProgress: number;
      Completed: number;
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

type ChartItem = { status: string; count: number };
type PriorityItem = { priority: string; count: number };

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const UserDashboard = () => {
  useUserAuth();

  const { user } = useUserContext();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [pieChartData, setPieChartData] = useState<ChartItem[]>([]);
  const [barChartData, setBarChartData] = useState<PriorityItem[]>([]);

  const prepareChartData = (data: {
    taskDistribution?: Record<string, number>;
    taskPriorityLevels?: Record<string, number>;
  }) => {
    const { taskDistribution = {}, taskPriorityLevels = {} } = data;

    const taskDistributionData = ["Pending", "In Progress", "Completed"].map(
      (status) => ({
        status,
        count: taskDistribution[status] || 0,
      })
    );

    const priorityLevelData = ["Low", "Medium", "High"].map((priority) => ({
      priority,
      count: taskPriorityLevels[priority] || 0,
    }));

    setPieChartData(taskDistributionData);
    setBarChartData(priorityLevelData);
  };

  const onSeeMore = () => navigate("/user/tasks");

  const getDashboardData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.error("Error fetching dashboard data: ", error);
    }
  }, []);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Welcome Section */}
      <div className="card my-5">
        <div className="card-header">
          <h2 className="card-title text-xl md:text-2xl">
            Welcome Back, {user?.name}
          </h2>
          <p className="card-subtitle mt-1.5 text-sm">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>

        {/* Info Cards */}
        <div className="mobile-dashboard-grid">
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
            label="In Progress"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            icon={<LuCheckCheck />}
            label="Completed"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col lg:flex-row gap-5 mb-5">
        <div className="card w-full lg:w-1/2">
          <div className="card-header">
            <h5 className="card-title">Task Distribution</h5>
          </div>
          <CustomPieChart data={pieChartData} color={COLORS} />
        </div>
        <div className="card w-full lg:w-1/2">
          <div className="card-header">
            <h5 className="card-title">Task Priority Levels</h5>
          </div>
          <CustomBarChart data={barChartData} />
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h5 className="card-title text-lg">Recent Tasks</h5>
          <button className="card-btn" onClick={onSeeMore}>
            <span className="hidden xs:inline">See All</span>
            <span className="xs:hidden">All</span>
            <LuArrowRight className="ml-2" />
          </button>
        </div>

        <div className="table-mobile-scroll">
          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
