const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const storeRoutes = require('./src/routes/store.routes');
const userRoutes = require('./src/routes/user.routes');
const categoryRoutes = require('./src/routes/category.routes');
const productRoutes = require('./src/routes/product.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const supplierRoutes = require("./src/routes/supplier.routes");
const notificationRoutes = require("./src/routes/notification.routes");
const stockRuleRoutes = require("./src/routes/stockRule.routes");
const dashboardRoutes = require('./src/routes/dashboard.routes');
const {protect, adminOnly} = require('./src/middlewares/auth.middleware');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(
  '/reports', 
  protect, 
  adminOnly, 
  express.static(path.join(process.cwd(), 'reports'))
);

// --- Routes ---
app.use('/api/store', storeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/notif", notificationRoutes);
app.use("/api/rule", stockRuleRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Health Check
app.get('/ping', (req, res) => {
  res.status(200).json({ 
    message: 'pong',
    timestamp: new Date().toISOString() 
  });
});

// Sample API Route
app.post('/api/data', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required, boss.' });
  }
  
  res.status(201).json({
    message: `Data received for ${name}`,
    received: true
  });
});


// Error handling for 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});