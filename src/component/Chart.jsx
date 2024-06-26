import React, { useState } from "react";
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
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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
  const [startDate, setStartDate] = useState(moment().subtract(1, "weeks").startOf("day"));
  const [endDate, setEndDate] = useState(moment().add(4, "weeks"));

  const aggregatedData = transactions.reduce((acc, transaction) => {
    const date = moment(transaction.createdDate).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = 0;
    }
    if(transaction.type == "POST")
       acc[date] += transaction.amount;
    else{
      acc[date] += ((transaction.amount)*0.2);
    }
    return acc;
  }, {});

  const chartData = [];
  let currentDate = moment(startDate);

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

  const handlePrevious = () => {
    setStartDate(startDate.clone().subtract(1, "weeks"));
    setEndDate(endDate.clone().subtract(1, "weeks"));
  };

  const handleNext = () => {
    setStartDate(startDate.clone().add(1, "weeks"));
    setEndDate(endDate.clone().add(1, "weeks"));
  };

  return (
    <React.Fragment>
      <Title>Recent Transfers</Title>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Button variant="contained" onClick={handlePrevious}>{"<"}</Button>
        <div style={{ width: "90%", flexGrow: 1 }}>
          <Line data={data} options={options} />
        </div>
        <Button variant="contained" onClick={handleNext}>{">"}</Button>
      </Box>
    </React.Fragment>
  );
}
