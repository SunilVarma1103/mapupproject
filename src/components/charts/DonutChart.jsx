import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DonutChart = ({
  data,
  innerSize = "50%",
  title,
  semicircle = false,
  legendPosition = "right",
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
          align: "left",
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
      type: "pie",
      backgroundColor: "transparent",
      height: height,
    },
    title: {
      text: title,
      align: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: function () {
        return `${this.point.name}: <b>${this.point.percentage.toFixed(
          1
        )}%</b>`;
      },
    },
    accessibility: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        colorByPoint: true,
        innerSize: innerSize,
        ...(semicircle && { startAngle: -90, endAngle: 90 }),
        dataLabels: [
          {
            enabled: false,
            distance: 20,
            format: "{point.name}: <b>{y}</b>",
            connectorWidth: 1,
          },
          {
            enabled: true,
            distance: -20,
            format: "{point.percentage:.1f}%",
            style: {
              fontSize: "9px",
              textOutline: "none",
              opacity: 0.7,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 3, // min-percent value to show
            },
          },
        ],
        showInLegend: true,
      },
    },
    legend: {
      enabled: true,
      ...getLegendConfig(legendPosition),
      labelFormat: "{name}: <b>{y}</b>",
      itemStyle: {
        fontSize: "9px",
      },
    },
    series: [
      {
        emphasis: {
          label: {
            show: true,
            fontSize: 30,
            fontWeight: "bold",
          },
        },
        name: "total",
        data: data,
      },
    ],
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
                    fontSize: "9px",
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

export default DonutChart;
