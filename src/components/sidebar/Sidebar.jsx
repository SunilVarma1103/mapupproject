import React from "react";
import {
  FaHome,
  FaChartLine,
  FaTags,
  FaShoppingCart,
  FaBox,
  FaComments,
  FaCogs,
} from "react-icons/fa";
import "./Sidebar.css"; // import CSS file

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Consist</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item active">
          <FaHome className="icon" />
          <span>Overview</span>
        </li>
        <li className="menu-item">
          <FaChartLine className="icon" />
          <span>Performance</span>
        </li>
        <li className="menu-item">
          <FaTags className="icon" />
          <span>Campaigns</span>
        </li>
        <li className="menu-item">
          <FaShoppingCart className="icon" />
          <span>Orders</span>
        </li>
        <li className="menu-item">
          <FaBox className="icon" />
          <span>Products</span>
        </li>
        <li className="menu-item">
          <FaComments className="icon" />
          <span>Messages</span>
        </li>
        <li className="menu-item">
          <FaCogs className="icon" />
          <span>Sales Platform</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <div className="upgrade-box">
          <p>Get detailed analytics for help you, upgrade pro</p>
          <button className="upgrade-btn">Upgrade Now</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
