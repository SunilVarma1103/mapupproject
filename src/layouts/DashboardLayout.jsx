import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import DonutChart from "../components/charts/DonutChart";
import MapChart from "../components/charts/MapChart";
import TeslaImg from "../assets/images/teslaImg.png";
import Map from "../components/maps/Map";
import { FaCar, FaBolt, FaBatteryFull, FaPlug } from "react-icons/fa";
import LatLongMap from "../components/maps/LatLongMap";

const DashboardLayout = (props) => {
  const [dashboardMode, setDashboardMode] = useState(props.dashboardMode);

  console.log("dashboardMode - -", dashboardMode);

  useEffect(() => {
    setDashboardMode(props.dashboardMode);
  }, [props.dashboardMode]);

  const transition = { duration: 0.5 };

  const [selectedMake, selectedModelYear] = props?.selectedVehicle
    .split(",")
    .map((value) => value.trim());

  const LineData = [
    {
      name: "Total Vehicle",
      marker: {
        symbol: "circle",
      },
      data: Object.values(props?.vehicleCountsByYear),
    },
  ];

  const BarData = [
    {
      name: "Make",
      colorByPoint: true,
      groupPadding: 0,

      data: Object.entries(props?.vehicleCountsByMake || [])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key, value]) => [key, value]),
    },
  ];

  const ElectricRangeComp = [
    {
      name: "Range",
      type: "column",
      data: [
        {
          y: props?.currentElectricRange,
          color:
            props?.currentElectricRange > props?.averageRange
              ? "#00ff40"
              : "#ff0000",
        },
        {
          y: props?.averageRange,
          color:
            props?.currentElectricRange > props?.averageRange
              ? "#ff0000"
              : "#00ff40",
        },
      ],
    },
  ];

  const BaseMSRPComp = [
    {
      name: "MSRP",
      type: "column",
      data: [
        {
          y: props?.currentMsrp,
          color:
            props?.currentMsrp > props?.averageMsrp ? "#ff0000" : "#00ff40",
        },
        {
          y: props?.averageMsrp,
          color:
            props?.currentMsrp < props?.averageMsrp ? "#ff0000" : "#00ff40",
        },
      ],
    },
  ];

  const DonutChartData = Object.entries(props?.cafvEligibilityCounts || {}).map(
    ([key, value]) => ({
      name: key,
      y: value,
    })
  );

  const VehicleTypePieChart = [
    {
      name: "BEV",
      y: props?.vehicleCountsByType?.["Battery Electric Vehicle (BEV)"],
      color: "#10B981",
    },
    {
      name: "PHEV",
      y: props?.vehicleCountsByType?.["Plug-in Hybrid Electric Vehicle (PHEV)"],
      color: "#0071B3",
    },
  ];

  console.log(DonutChartData);

  const MapData = [
    { lat: 34.0522, lon: -118.2437, value: 100 },
    { lat: 40.7128, lon: -74.006, value: 200 },
  ];

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate boxes with random colors
  const boxes = props?.counties.map((county, index) => ({
    id: index,
    color: getRandomColor(),
    text: county,
  }));

  const cityNames = Object.keys(props?.cityCounts || {});
  const counts = Object.values(props?.cityCounts || {});

  return (
    <>
      <section className="dashboard-container">
        <AnimatePresence mode="wait">
          {dashboardMode ? (
            <motion.div
              key="detailedView"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={transition}
              className="detail_dash_container"
            >
              <div className="row">
                <div className="col-lg-6">
                  <div className="card_dash">
                    <div>
                      <select
                        id="city-select"
                        className={`vehicle_selection ${
                          props?.selectedVehicle === "" ? "blinking" : ""
                        }`}
                        value={props?.selectedVehicle}
                        onChange={(e) =>
                          props?.setSelectedVehicle(e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select a vehicle
                        </option>
                        {props?.makeAndModelYearArray?.map((vehicle) => (
                          <option value={vehicle} key={vehicle}>
                            {vehicle}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="tesla_img_container">
                      <img src={TeslaImg} className="tesla_img" />
                    </div>
                    <div className="img_detail_info">
                      <h3>{selectedModelYear}</h3>
                      <h3>{selectedMake}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card_dash">
                    <label>Vehicle Locations</label>
                    <LatLongMap locations={props?.selectedVehicleLocations} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <div className="card_dash_bottom">
                    <div className="county_label">
                      <label>County of vehicles</label>
                    </div>
                    <div className="grid-container">
                      {boxes.map((box) => (
                        <div
                          key={box.id}
                          className="box"
                          style={{ backgroundColor: box.color }}
                        >
                          {box.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="card_dash_bottom">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="card_dash1">
                              <label>Electric Range</label>
                              <BarChart
                                data={ElectricRangeComp}
                                stacked={false}
                                XAxis={["Curr", "Avg"]}
                                height="240px"
                                type="column"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="card_dash1">
                              <div className="inner_card">
                                <h3>{props?.maxRange}</h3>
                                <label>Max Electric Range</label>
                              </div>
                              <div className="inner_card">
                                <h3>{props?.minRange}</h3>
                                <label>Min Electric Range</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card_dash_bottom">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="card_dash1">
                              <label>Base MSRP Range</label>
                              <BarChart
                                data={BaseMSRPComp}
                                stacked={false}
                                XAxis={["Curr", "Avg"]}
                                height="240px"
                                type="column"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="card_dash1">
                              <div className="inner_card">
                                <h3>{props?.maxMsrp} $</h3>
                                <label>Max Base MSRP</label>
                              </div>
                              <div className="inner_card">
                                <h3>{props?.minMsrp} $</h3>
                                <label>Min Base MSRP</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                key="summaryView"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={transition}
                className="summary_dash_container"
              >
                <div className="row">
                  <div className="col-lg-2 col-md-3 col-sm-12 summary-panel">
                    <div className="summary-card">
                      <div className="card-content">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <p className="title">Total Vehicles</p>
                          <FaCar className="card-icon" />
                        </div>
                        <p className="stat">{props?.totalVehicles}</p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="card-content">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <p className="title">Avg Electric Range</p>
                          <FaBolt className="card-icon" />
                        </div>
                        <p className="stat">
                          {props?.averageRange?.toFixed(2)} mi
                        </p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="card-content">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <p className="title">BEV Vehicles</p>
                          <FaBatteryFull className="card-icon" />
                        </div>
                        <p className="stat">
                          {
                            props?.vehicleCountsByType?.[
                              "Battery Electric Vehicle (BEV)"
                            ]
                          }
                        </p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="card-content">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <p className="title">PHEV Vehicles</p>
                          <FaPlug className="card-icon" />
                        </div>
                        <p className="stat">
                          {
                            props?.vehicleCountsByType?.[
                              "Plug-in Hybrid Electric Vehicle (PHEV)"
                            ]
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-10 col-md-9 col-sm-12 main-dashboard">
                    {/* <div className="filter-panel">
                      <div className="filter-title">Filter Panel</div>

                      <div className="label_drop_content">
                        <label className="filter-label" htmlFor="city-select">
                          City
                        </label>
                        <select id="city-select" className="filter-dropdown">
                          <option value="">Select City</option>
                          {props?.uniqueCities?.map((city) => (
                            <option value={city} key={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="label_drop_content">
                        <label
                          className="filter-label"
                          htmlFor="utility-select"
                        >
                          Electric Utility
                        </label>
                        <select id="utility-select" className="filter-dropdown">
                          <option value="">Select Utility</option>
                          {props?.uniqueElectricUtilities?.map((utility) => (
                            <option value={utility} key={utility}>
                              {utility}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="label_drop_content">
                        <label
                          className="filter-label"
                          htmlFor="vehicle-type-select"
                        >
                          Electric Vehicle Type
                        </label>
                        <select
                          id="vehicle-type-select"
                          className="filter-dropdown"
                        >
                          <option value="">Select Vehicle Type</option>
                          {props?.vehicleCountsByType &&
                            Object.keys(props.vehicleCountsByType).map(
                              (type) => (
                                <option value={type} key={type}>
                                  {type}
                                </option>
                              )
                            )}
                        </select>
                      </div>
                    </div> */}

                    <div className="chart_container">
                      <div className="row chartnmap-section gx-0">
                        {/* Top Row Charts */}
                        <div className="col-md-6 col-sm-12 chart">
                          <div className="chart-card">
                            <label>Total Vehicles by Model Year</label>
                            <LineChart
                              data={LineData}
                              XAxis={Object.keys(props?.vehicleCountsByYear)}
                              height="250px"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12 chart">
                          <div className="chart-card">
                            <label>Total Vehicles by City</label>
                            <Map cityNames={cityNames} counts={counts} />
                          </div>
                        </div>
                      </div>
                      <div className="row charts-section gx-0">
                        {/* Bottom Row Charts */}

                        <div className="col-md-4 col-sm-12 chart">
                          <div className="chart-card">
                            <label>Top 10 Make</label>
                            <BarChart
                              data={BarData}
                              stacked={false}
                              XAxis={Object.keys(props?.vehicleCountsByMake)}
                              height={"240px"}
                              type="bar"
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 chart">
                          <div className="chart-card">
                            <label>Total Vehicles by (CAFV) Eligibility</label>
                            <DonutChart
                              data={DonutChartData}
                              legendPosition={"top"}
                              height={"240px"}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 chart">
                          <div className="chart-card">
                            <label>Vehicle Type Distribution</label>
                            <DonutChart
                              data={VehicleTypePieChart}
                              legendPosition={"top"}
                              height={"240px"}
                              innerSize="0%"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default DashboardLayout;
