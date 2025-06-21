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
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

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

type ChartItem = { status: string; count: number };
type PriorityItem = { priority: string; count: number };

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useUserContext();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const [pieChartData, setPieChartData] = useState<ChartItem[]>([]);
  const [barChartData, setBarChartData] = useState<PriorityItem[]>([]);

  // Prepare Chart Data
  const prepareChartData = (data: {
    taskDistribution?: Record<string, number>;
    taskPriorityLevels?: Record<string, number>;
  }) => {
    const { taskDistribution = {}, taskPriorityLevels = {} } = data || {};

    const statusKeys = ["Pending", "In Progress", "Completed"];
    const priorityKeys = ["Low", "Medium", "High"];

    const taskDistributionData = statusKeys.map((status) => ({
      status,
      count: taskDistribution[status] || 0,
    }));

    const priorityLevelData = priorityKeys.map((priority) => ({
      priority,
      count: taskPriorityLevels[priority] || 0,
    }));

    setPieChartData(taskDistributionData);
    setBarChartData(priorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
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
      {/* Welcome Card - Mobile Optimized */}
      <div className="card my-3 sm:my-5">
        <div className="card-header">
          <h2 className="card-title text-lg sm:text-xl md:text-2xl leading-tight">
            Good Morning! {user?.name}
          </h2>
          <p className="card-subtitle text-xs sm:text-sm mt-1 sm:mt-1.5">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>

        {/* Stats Grid - Mobile First Approach */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-1">
            <InfoCard
              icon={<LuClipboardList />}
              label="Total Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.All || 0
              )}
              color="bg-primary"
            />
          </div>

          <div className="col-span-1">
            <InfoCard
              icon={<LuClock />}
              label="Pending Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Pending || 0
              )}
              color="bg-yellow-500"
            />
          </div>

          <div className="col-span-1">
            <InfoCard
              icon={<LuPlay />}
              label="In Progress"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.InProgress || 0
              )}
              color="bg-cyan-500"
            />
          </div>

          <div className="col-span-1">
            <InfoCard
              icon={<LuCheckCheck />}
              label="Completed"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Compeleted || 0
              )}
              color="bg-lime-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Distribution</h5>
          </div>

          <CustomPieChart data={pieChartData} color={COLORS} />
        </div>
      </div>

      <div className="mb-5">
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Priority Levels</h5>
          </div>

          <CustomBarChart data={barChartData} />
        </div>
      </div>

      {/* Recent Tasks Section - Mobile Optimized */}
      <div className="card mb-3 sm:mb-5">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h5 className="card-title text-base sm:text-lg">Recent Tasks</h5>
            <button
              className="card-btn text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-1.5"
              onClick={onSeeMore}>
              <span className="hidden xs:inline">See All</span>
              <span className="xs:hidden">All</span>
              <LuArrowRight className="text-sm sm:text-base ml-1" />
            </button>
          </div>
        </div>

        {/* Mobile-optimized table container */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
