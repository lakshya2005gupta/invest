const express = require('express');
const router = express.Router();
const bankDepositsData = require('../data/bankDepositsData');

// Get all bank deposits
router.get('/', (req, res) => {
  try {
    const deposits = bankDepositsData.getAllDeposits();
    res.json({
      success: true,
      data: deposits,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bank deposits',
      error: error.message
    });
  }
});

// Get Fixed Deposits
router.get('/fd', (req, res) => {
  try {
    const fds = bankDepositsData.getFDs();
    res.json({
      success: true,
      data: fds,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching Fixed Deposits',
      error: error.message
    });
  }
});

// Get Recurring Deposits
router.get('/rd', (req, res) => {
  try {
    const rds = bankDepositsData.getRDs();
    res.json({
      success: true,
      data: rds,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching Recurring Deposits',
      error: error.message
    });
  }
});

// Calculate FD maturity
router.post('/calculate/fd', (req, res) => {
  try {
    const { principal, rate, tenure } = req.body;
    
    if (!principal || !rate || !tenure) {
      return res.status(400).json({
        success: false,
        message: 'Principal, rate, and tenure are required'
      });
    }

    const maturityAmount = principal * Math.pow(1 + (rate / 100), tenure);
    const interest = maturityAmount - principal;

    res.json({
      success: true,
      data: {
        principal,
        rate,
        tenure,
        maturityAmount: Math.round(maturityAmount),
        interest: Math.round(interest)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating FD maturity',
      error: error.message
    });
  }
});

module.exports = router;