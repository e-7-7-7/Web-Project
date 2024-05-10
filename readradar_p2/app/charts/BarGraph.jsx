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
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <>
      <div style={{ height: "70vh", width: "100vw", margin: "auto" }}>
        <Bar options={options} data={LineChartData} />
      </div>
    </>
  );
}
