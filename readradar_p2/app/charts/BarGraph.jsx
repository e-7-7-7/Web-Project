"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

export default function BarGraph({ lable, dataset }) {
  const LineChartData = {
    labels: lable,
    datasets: [
      {
        label: "Steps",
        data: dataset,
        borderColor: "rgb(144,238,144)",
        backgroundColor: "rgba(144,238,144, 0.3)",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "X-Axis Label",
        },
      },
      y: {
        title: {
          display: true,
          text: "Y-Axis Label",
        },
      },
    },
  };

  return (
    <>
      <div style={{ height: "30vh", width: "50vw", margin: "auto" }}>
        <Bar options={options} data={LineChartData} />
      </div>
    </>
  );
}
