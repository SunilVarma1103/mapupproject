import { useState } from "react";
import "./assets/css/Application.css";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const [dashboardMode, setDashboardMode] = useState(false);
  console.log("dashboardMode - - - - - ", dashboardMode);
  return (
    <>
      <Navbar
        dashboardMode={dashboardMode}
        setDashboardMode={setDashboardMode}
      />
      <DashboardPage
        dashboardMode={dashboardMode}
        setDashboardMode={setDashboardMode}
      />
    </>
  );
};

export default App;
