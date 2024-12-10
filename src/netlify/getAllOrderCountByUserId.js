import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);
const getAllOrderCountByUserId = async (userId) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("status_code, order_status_codes(*)") // Fetch only the status codes
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching orders:", error.message);
      return { chartData: null };
    }

    // Count each order status
    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Dispatched: 0,
      Cancelled: 0,
      Delivered: 0,
    };

    orders.forEach((order) => {
      switch (order.order_status_codes.status_name) {
        case "Pending":
          statusCounts.Pending++;
          break;
        case "Confirmed":
          statusCounts.Confirmed++;
          break;
        case "Dispatched":
          statusCounts.Dispatched++;
          break;
        case "Cancelled":
          statusCounts.Cancelled++;
          break;
        case "Delivered":
          statusCounts.Delivered++;
          break;
        default:
          break;
      }
    });

    // Prepare the chart data
    const chartData = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Order Statuses",
          data: Object.values(statusCounts),
          backgroundColor: [
            "#FF6384", // Pending (Red)
            "#36A2EB", // Confirmed (Blue)
            "#FFCE56", // Dispatched (Yellow)
            "#FF9F40", // Cancelled (Orange)
            "#4BC0C0", // Delivered (Green)
          ],
          hoverOffset: 6,
        },
      ],
    };

    return { chartData };
    } catch (error) {
      console.error("Error in fetching orders:", error);
      return { chartData: null };
    }
  };
   

export default getAllOrderCountByUserId;
