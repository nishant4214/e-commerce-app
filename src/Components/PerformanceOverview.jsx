import React,{useEffect, useState} from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
import getMonthlyRevenueData from "../netlify/getMonthlyRevenueData";
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
const PerformanceOverview = () => {
    const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { labels, transactions, revenue } = await getMonthlyRevenueData();

      // Prepare the chart data
      const data = {
        labels,
        datasets: [
          {
            label: "Total Transactions",
            data: transactions,
            backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
          },
          {
            label: "Total Revenue",
            data: revenue,
            backgroundColor: "rgba(153, 102, 255, 0.6)", // Purple
          },
        ],
      };

      setChartData(data); // Set the chart data
    };

    fetchData();
  }, []); // Runs once on mount

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `${tooltipItem.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      <h3>Sales Overview</h3>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default PerformanceOverview;
