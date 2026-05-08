const dashboardService = require('../services/dashboard.service');

const getDashboardSummary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const storeId = req.user.store_id;

    // 1. & 4. Get simple counts (Products and Suppliers)
    const totalProducts = await dashboardService.getTotalProducts(storeId);
    const totalSuppliers = await dashboardService.getTotalSuppliers(storeId);

    // 2. & 3. Get Transactions for Today & Yesterday to calculate difference
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    const totalTransactionToday = await dashboardService.getTotalTransactions(storeId, todayStart, todayEnd);
    const totalTransactionYesterday = await dashboardService.getTotalTransactions(storeId, yesterdayStart, yesterdayEnd);
    const transactionDiff = totalTransactionToday - totalTransactionYesterday;

    // 5. Generate Chart Data (Dynamic to current day of the week)
    const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    // Initialize the chart structure with 0s
    const chartData = {};
    dayNames.forEach(day => {
      chartData[day] = { in: 0, out: 0 };
    });

    // Get current day index (0 = Sunday, 1 = Monday, etc.)
    const today = new Date();
    const currentDayOfWeek = today.getDay(); 
    
    // Adjust index so Monday is 0 and Sunday is 6
    const adjustedCurrentDayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    // Array to hold our concurrent database queries
    const chartPromises = [];

    // Loop from Monday (0) up to Today's index
    for (let i = 0; i <= adjustedCurrentDayIndex; i++) {
      const targetDate = new Date(today);
      // Subtract days to go backwards in the week
      targetDate.setDate(today.getDate() - (adjustedCurrentDayIndex - i));
      
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dayName = dayNames[i];

      // Push an async function into our promises array to run them concurrently
      chartPromises.push((async () => {
        const inRecords = await dashboardService.getInTransactions(storeId, startOfDay, endOfDay);
        const outRecords = await dashboardService.getOutTransactions(storeId, startOfDay, endOfDay);
        
        // Using the length of the returned array as the count of transactions.
        // (Note: If you want the sum of the product quantities instead, you would use: 
        // inRecords.reduce((sum, item) => sum + item.qty, 0) )
        chartData[dayName] = {
          in: inRecords.length,
          out: outRecords.length
        };
      })());
    }

    // Wait for all the chart data queries to finish
    await Promise.all(chartPromises);

    // Return the exactly formatted JSON response
    return res.status(200).json({
      totalProducts: totalProducts,
      totalTransaction: totalTransactionToday,
      transactionDiff: transactionDiff >= 0 ? `+${transactionDiff}` : `${transactionDiff}`,
      totalSuppliers: totalSuppliers,
      chartData: chartData
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardSummary
};