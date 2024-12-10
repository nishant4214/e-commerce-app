import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import getAllOrderCountByUserId from "../netlify/getAllOrderCountByUserId";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersSummary = ({ userId }) => {
  const [chartData, setChartData] = useState(null); // State to store chart data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllOrderCountByUserId(userId); // Fetch data
        if (result) {
          setChartData(result.chartData); // Update the chart data state
        }
      } catch (error) {
        console.error("Error fetching order counts:", error);
      }
    };

    fetchData(); // Fetch data when component mounts or userId changes
  }, [userId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw; // Access the raw value
            return `${tooltipItem.label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
      {chartData ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
      <h3>Orders</h3>

    </div>
  );
};

export default OrdersSummary;
