import { createClient } from '@supabase/supabase-js';
// import GenerateToken from './jwt';

const supabaseUrl = 'https://wplynhlsjjzczsgembup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbHluaGxzamp6Y3pzZ2VtYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTUwNzM5MSwiZXhwIjoyMDQ1MDgzMzkxfQ.UOg9HpjHXLIP7s__uKsNI6XJ0_seUQBGK7UhD8nzgZk';

const supabase = createClient(supabaseUrl, supabaseKey);


const getMonthlyRevenueData = async () => {
    try {
      const { data, error } = await supabase
        .from('billing')
        .select('total_amount, created_at');
        console.log(data)
      if (error) {
        console.error('Error fetching monthly sales data:', error.message);
        return [];
      }
  
      // Aggregate sales data by month
      const monthlySales = data.reduce((acc, bill) => {
        const date = new Date(bill.created_at);
        const month = date.toLocaleString('default', { month: 'short' }); // Get short month name
  
        if (!acc[month]) {
          acc[month] = { transactions: 0, revenue: 0 };
        }
  
        acc[month].transactions += 1;
        acc[month].revenue += bill.total_amount;
        return acc;
      }, {});
  
      // Convert the aggregated data into an array with consistent order
      const labels = ["Jan","Feb", "Mar", "Apr", "May","Jun", "Jul","Aug", "Sep","Oct", "Nov","Dec"];
      const transactions = [];
      const revenue = [];
  
      labels.forEach((month) => {
        transactions.push(monthlySales[month]?.transactions || 0);
        revenue.push(monthlySales[month]?.revenue.toFixed(2) || 0);
      });
      const chartData = { labels, transactions, revenue };
      return chartData;
    } catch (error) {
      console.error("Error in fetching monthly sales data:", error);
      const chartData = { labels: [], transactions: [], revenue: [] };
      return chartData;
    }
  };
  
  export default getMonthlyRevenueData;
  