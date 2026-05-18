const transactionService = require('../services/transaction.service');
const productService = require('../services/product.service');

const createTransaction = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const type = req.body.type;

    const product = await productService.getById(req.body.product_id);
    const transPrice = type == "IN" ? product.buy_price * req.body.qty : product.sell_price * req.body.qty;

    const data = {
      product_id: req.body.product_id,
      qty: req.body.qty,
      type: req.body.type,
      note: req.body.note,
      user_id: userId,
      trans_price : transPrice
    };

    const result = await transactionService.createTransaction(data);

    // return res.status(201).json(result);

    // Trigger kalkulasi tanpa mengganggu response utama transaksi
    try {
      await productService.updatePredictedStockout(data.product_id);
    } catch (calcError) {
      console.error("Gagal menghitung predicted stockout:", calcError.message);
    }

    return res.status(201).json(result);

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const transactions = await transactionService.getAllTransactions(
      req.user.store_id
    );

    return res.status(200).json(transactions);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getTransactionById = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const trx = await transactionService.getTransactionById(
      req.params.id,
      req.user.store_id
    );

    return res.status(200).json(trx);

  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

const fs = require('fs');
const path = require('path');

const generateExcelReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("Generating report for store_id:", req.user.store_id);

    const storeId = req.user.store_id;
    const { startDate, endDate } = req.query; // Assuming you pass these in the URL: ?startDate=2026-05-01&endDate=2026-05-31
    console.log(storeId, startDate, endDate);

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    // 1. Adjust the dates (just like in the dashboard)
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // 2. Fetch the transactions from the DB
    const transactions = await transactionService.getTransactionsForReport(storeId, start, end);

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found in this date range to generate a report." });
    }

    // 3. Send data to n8n Webhook to generate Excel
    const n8nWebhookUrl = process.env.N8N_EXCEL_WEBHOOK_URL; 
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        store_id: storeId,
        report_start: start.toISOString(),
        report_end: end.toISOString(),
        data: transactions // n8n will loop through this array to create rows
      })
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status: ${response.status}`);
    }

    // 4. Handle the binary response (the actual .xlsx file)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Setup the local file path
    // path.join(process.cwd(), 'reports') points to a 'reports' folder at the very root of your project (same level as 'src' or 'package.json')
    const reportsDir = path.join(process.cwd(), 'reports');

    // Create the 'reports' folder if it doesn't exist yet
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Create a unique filename based on the current timestamp
    const fileName = `transaction_report_${Date.now()}.xlsx`;
    const filePath = path.join(reportsDir, fileName);

    // 6. Save the file locally
    fs.writeFileSync(filePath, buffer);

    const downloadUrl = `${req.protocol}://${req.get('host')}/reports/${fileName}`;
    return res.status(200).json({
      success: true,
      message: "Report generated successfully",
      fileName: fileName,
      // Optional: If you want to let the frontend download it later, you could serve the static file and return a URL here
      downloadUrl: downloadUrl,
      downloadResponse: response
    });

  } catch (err) {
    console.error("Report Generation Error:", err);
    return res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  generateExcelReport
};