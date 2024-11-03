import { useEffect, useState } from "react";
import moment from "moment";
import mapupLogo from "../../assets/images/mapup-logo.png";
import { FaUserCircle } from "react-icons/fa";
import ToggleSwitch from "../toggleSwitch/ToggleSwitch";

const Navbar = (props) => {
  const [currentTime, setCurrentTime] = useState(
    moment().format("dddd, D MMM | h:mm:ss A")
  );

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(moment().format("dddd, D MMM | h:mm:ss A"));
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  return (
    <>
      <div className="nav main_navabr">
        <div className="col-lg-4">
          <img src={mapupLogo} className="main_logo" />
        </div>
        <div className="col-lg-4" style={{ height: "100%" }}>
          <div className="toggle_container_nav">
            <label
              className={`${!props?.dashboardMode ? "selected_mode" : ""}`}
            >
              Dashboard
            </label>
            <div style={{ marginTop: "10px" }}>
              <ToggleSwitch
                dashboardMode={props?.dashboardMode}
                setDashboardMode={props?.setDashboardMode}
              />
            </div>
            <label className={`${props?.dashboardMode ? "selected_mode" : ""}`}>
              Detailed
            </label>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="navbar_user_box">
            <FaUserCircle size={25} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
