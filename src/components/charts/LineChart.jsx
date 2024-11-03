import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const LineChart = ({
  data,
  title,
  XAxis,
  YAxisText,

  legendEnable,
  legendPosition = "right",
  XAxisText,

  height = "220px",
}) => {
  const getLegendConfig = (position) => {
    switch (position) {
      case "bottom":
        return {
          align: "center",
          verticalAlign: "bottom",
          layout: "horizontal",
        };
      case "right-top":
        return {
          align: "right",
          verticalAlign: "top",
          layout: "vertical",
        };
      case "top":
        return {
          align: "center",
          verticalAlign: "top",
          layout: "horizontal",
        };
      case "left":
        return {
          align: "left",
          verticalAlign: "middle",
          layout: "vertical",
        };
      case "right":
      default:
        return {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical",
        };
    }
  };

  const options = {
    chart: {
      //   type: line,
      backgroundColor: "transparent",
      height: height,
    },
    accessibility: {
      enabled: false,
    },
    title: {
      text: title,
      align: "center",
    },

    xAxis: {
      categories: XAxis,
      title: {
        text: XAxisText,
      },
      labels: {
        step: 1,
        style: {
          fontSize: "10px",
        },
      },
    },

    yAxis: {
      min: 0,
      title: {
        text: YAxisText,
        size: "5px",
      },
      labels: {
        style: {
          fontSize: "10px",
        },
      },
    },

    tooltip: {
      crosshairs: true,
      shared: true,
    },

    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: "#666666",
          lineWidth: 1,
        },
      },
    },

    series: data,
    legend: {
      enabled: legendEnable,
      ...getLegendConfig(legendPosition),

      itemStyle: {
        fontSize: "8px",
      },
    },

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: getLegendConfig(legendPosition),
            plotOptions: {
              series: {
                dataLabels: {
                  style: {
                    fontSize: "10px",
                  },
                },
              },
            },
          },
        },
      ],
    },
  };

  return (
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChart;
