import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const BarChart = ({
  data,
  type = "column",
  title,
  XAxis,
  YAxisText,
  stacked = false,
  percentChart,
  legendEnable,
  legendPosition = "right",
  rotateLegend = false,
  XAxisText,
  percentLabelEnabled = true,
  treeMapType = false,
  height = "220px",
  tooltipData,
  tooltipHeader,
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
      type: type,
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

      // tickInterval: 10,
    },

    tooltip: {
      headerFormat:
        tooltipHeader ||
        '<span style="font-size: 10px; font-weight: 600">{point.key}</span><br/>',
      pointFormat:
        tooltipData ||
        '<span style="font-size: 10px">{series.name}: {point.y}<br/>Total: {point.stackTotal} </span>',

      valueSuffix: "",
    },

    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
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

export default BarChart;
