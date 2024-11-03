import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsMap from "highcharts/modules/map";

HighchartsMore(Highcharts);
HighchartsMap(Highcharts);

const MapChart = ({
  data,
  title,
  legendEnable,
  legendPosition = "right",
  height = "220px",
}) => {
  const [topology, setTopology] = useState(null);

  const getLegendConfig = (position) => {
    switch (position) {
      case "bottom":
        return {
          align: "center",
          verticalAlign: "bottom",
          layout: "horizontal",
        };
      case "right-top":
        return { align: "right", verticalAlign: "top", layout: "vertical" };
      case "top":
        return { align: "center", verticalAlign: "top", layout: "horizontal" };
      case "left":
        return { align: "left", verticalAlign: "middle", layout: "vertical" };
      case "right":
      default:
        return { align: "right", verticalAlign: "middle", layout: "vertical" };
    }
  };

  useEffect(() => {
    fetch("https://code.highcharts.com/mapdata/countries/us/us-all.topo.json")
      .then((response) => response.json())
      .then((data) => {
        setTopology(data);
      })
      .catch((error) => console.error("Error loading topology data:", error));
  }, []);

  const options = topology
    ? {
        chart: {
          map: topology,
          backgroundColor: "transparent",
          height: height,
        },
        title: {
          text: title,
        },
        exporting: {
          sourceWidth: 600,
          sourceHeight: 500,
        },
        legend: {
          enabled: legendEnable,
          ...getLegendConfig(legendPosition),
        },
        mapNavigation: {
          enabled: true,
        },
        colorAxis: {
          min: 1,
          type: "logarithmic",
          minColor: "#EEEEFF",
          maxColor: "#000022",
          stops: [
            [0, "#EFEFFF"],
            [0.67, "#4444FF"],
            [1, "#000022"],
          ],
        },
        series: [
          {
            type: "map",
            mapData: topology,
            name: "USA",
            states: {
              hover: {
                color: "#BADA55",
              },
            },
            dataLabels: {
              enabled: false,
            },
            borderColor: "#FFFFFF",
            borderWidth: 1,
            showInLegend: false,
          },
          {
            type: "mapbubble",
            data: data.map((point) => ({
              z: point.value,
              lat: point.lat,
              lon: point.lon,
            })),
            minSize: 4,
            maxSize: 30,
            tooltip: {
              pointFormat: "{point.lat}, {point.lon}: {point.z}",
            },
          },
        ],
      }
    : {};

  return (
    <div className="chart-container" style={{ height: height }}>
      {topology ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapChart;
