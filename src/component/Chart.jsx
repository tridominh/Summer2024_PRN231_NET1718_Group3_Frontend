import React from "react";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import Title from "./Title";
import moment from "moment";
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  ChartTitle,
  Tooltip,
  Legend
);

function createData(date, amount) {
  return { date, amount };
}

export default function Chart({ transactions }) {
  const theme = useTheme();

  const aggregatedData = transactions.reduce((acc, transaction) => {
    const date = moment(transaction.createdDate).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += transaction.amount;
    return acc;
  }, {});

  const chartData = [];
  let currentDate = moment().startOf("day");
  const endDate = moment("2024-12-31");

  while (currentDate.isBefore(endDate)) {
    const dateStr = currentDate.format("YYYY-MM-DD");
    chartData.push({
      date: dateStr,
      amount: aggregatedData[dateStr] || 0,
    });
    currentDate = currentDate.add(1, "day");
  }

  const data = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Total Amount",
        data: chartData.map((d) => d.amount),
        borderColor: theme.palette.primary.main,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "DD MMM YYYY",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount (VNĐ)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <React.Fragment>
      <Title>Recent Transfers</Title>
      <div style={{ width: "90%", flexGrow: 1 }}>
        <Line data={data} options={options} />
      </div>
    </React.Fragment>
  );
}
