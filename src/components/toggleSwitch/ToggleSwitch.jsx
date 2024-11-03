import "./Toggle.css";

const ToggleSwitch = (props) => {
  const handleToggle = (e) => {
    props?.setDashboardMode(e.target.checked);
  };

  console.log("dashboardMode", props?.dashboardMode);

  return (
    <>
      <div class="toggle-container">
        <input
          class="toggle-input"
          type="checkbox"
          onChange={handleToggle}
          value={props?.dashboardMode}
        />
        <div class="toggle-handle-wrapper">
          <div class="toggle-handle">
            <div class="toggle-handle-knob"></div>
            <div class="toggle-handle-bar-wrapper">
              <div class="toggle-handle-bar"></div>
            </div>
          </div>
        </div>
        <div class="toggle-base">
          <div class="toggle-base-inside"></div>
        </div>
      </div>
    </>
  );
};

export default ToggleSwitch;
