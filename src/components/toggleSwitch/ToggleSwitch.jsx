import "./Toggle.css";

const ToggleSwitch = (props) => {
  const handleToggle = (e) => {
    props?.setDashboardMode(e.target.checked);
  };

  return (
    <>
      <div className="toggle-container">
        <input
          className="toggle-input"
          type="checkbox"
          onChange={handleToggle}
          value={props?.dashboardMode}
        />
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle">
            <div className="toggle-handle-knob"></div>
            <div className="toggle-handle-bar-wrapper">
              <div className="toggle-handle-bar"></div>
            </div>
          </div>
        </div>
        <div className="toggle-base">
          <div className="toggle-base-inside"></div>
        </div>
      </div>
    </>
  );
};

export default ToggleSwitch;
