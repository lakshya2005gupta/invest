const express = require('express');
const router = express.Router();

// FD Maturity Calculator
router.post('/fd-maturity', (req, res) => {
  try {
    const { principal, rate, tenure } = req.body;
    
    if (!principal || !rate || !tenure) {
      return res.status(400).json({
        success: false,
        message: 'Principal, rate, and tenure are required'
      });
    }

    // Compound interest calculation
    const maturityAmount = principal * Math.pow(1 + (rate / 100), tenure);
    const interest = maturityAmount - principal;

    res.json({
      success: true,
      data: {
        principal: parseFloat(principal),
        rate: parseFloat(rate),
        tenure: parseFloat(tenure),
        maturityAmount: Math.round(maturityAmount * 100) / 100,
        interest: Math.round(interest * 100) / 100
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

// RD Maturity Calculator
router.post('/rd-maturity', (req, res) => {
  try {
    const { monthlyDeposit, rate, tenure } = req.body;
    
    if (!monthlyDeposit || !rate || !tenure) {
      return res.status(400).json({
        success: false,
        message: 'Monthly deposit, rate, and tenure are required'
      });
    }

    const months = tenure * 12;
    const monthlyRate = rate / (12 * 100);
    
    // RD maturity calculation
    const maturityAmount = monthlyDeposit * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalDeposits = monthlyDeposit * months;
    const interest = maturityAmount - totalDeposits;

    res.json({
      success: true,
      data: {
        monthlyDeposit: parseFloat(monthlyDeposit),
        rate: parseFloat(rate),
        tenure: parseFloat(tenure),
        totalDeposits: Math.round(totalDeposits * 100) / 100,
        maturityAmount: Math.round(maturityAmount * 100) / 100,
        interest: Math.round(interest * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating RD maturity',
      error: error.message
    });
  }
});

// SIP Calculator
router.post('/sip', (req, res) => {
  try {
    const { monthlyInvestment, expectedReturn, tenure } = req.body;
    
    if (!monthlyInvestment || !expectedReturn || !tenure) {
      return res.status(400).json({
        success: false,
        message: 'Monthly investment, expected return, and tenure are required'
      });
    }

    const months = tenure * 12;
    const monthlyRate = expectedReturn / (12 * 100);
    
    // SIP future value calculation
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvestment;

    res.json({
      success: true,
      data: {
        monthlyInvestment: parseFloat(monthlyInvestment),
        expectedReturn: parseFloat(expectedReturn),
        tenure: parseFloat(tenure),
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        futureValue: Math.round(futureValue * 100) / 100,
        totalReturns: Math.round(totalReturns * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating SIP',
      error: error.message
    });
  }
});

module.exports = router;