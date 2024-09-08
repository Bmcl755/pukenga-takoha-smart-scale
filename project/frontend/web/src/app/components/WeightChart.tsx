import React from "react";
import { Weighing } from "@/models/Children";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import converter from "@/services/date-utils/ConvertIsoStringToDateString";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Weighings history",
    },
  },
};

export function WeightChart({ weighings }: { weighings: Weighing[] }) {
  const labels = weighings.map((item) => {
    return converter(item.date).formattedDate;
  });

  const weights = weighings.map((item) => {
    return item.weight;
  });
  const data = {
    labels,
    datasets: [
      {
        label: "Child's weighings",
        data: weights,
        borderColor: "rgb(45 41 105)",
        backgroundColor: "rgb(90 79 156)",
      },
    ],
  };
  return (
    <Line
      options={{
        ...options,
        scales: { y: { beginAtZero: true } },
      }}
      data={data}
      height="75px"
    />
  );
}
