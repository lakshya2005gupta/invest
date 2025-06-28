const express = require('express');
const router = express.Router();
const preIPOData = require('../data/preIPOData');

// Get all Pre-IPO companies
router.get('/', (req, res) => {
  try {
    const companies = preIPOData.getPreIPOCompanies();
    res.json({
      success: true,
      data: companies,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching Pre-IPO companies',
      error: error.message
    });
  }
});

// Get Pre-IPO company by ID
router.get('/:id', (req, res) => {
  try {
    const company = preIPOData.getPreIPOById(req.params.id);
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pre-IPO company not found' 
      });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching Pre-IPO company',
      error: error.message
    });
  }
});

// Invest in Pre-IPO company
router.post('/invest', (req, res) => {
  try {
    const { companyId, tokens, walletAddress } = req.body;
    
    if (!companyId || !tokens || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Company ID, tokens, and wallet address are required'
      });
    }

    const company = preIPOData.getPreIPOById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const totalAmount = tokens * company.tokenPrice;
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate blockchain transaction
    const investment = {
      transactionId,
      companyId: parseInt(companyId),
      companyName: company.name,
      tokens: parseInt(tokens),
      tokenPrice: company.tokenPrice,
      totalAmount,
      walletAddress,
      contractAddress: company.aptosContractAddress,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    res.json({
      success: true,
      data: investment,
      message: 'Investment successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing investment',
      error: error.message
    });
  }
});

// Get investments by wallet address
router.get('/investments/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // This would typically query a database
    // For now, return mock data
    const investments = [
      {
        transactionId: 'TXN_1234567890_abc123',
        companyId: 1,
        companyName: 'ByteDance',
        tokens: 100,
        tokenPrice: 50,
        totalAmount: 5000,
        walletAddress,
        status: 'COMPLETED',
        timestamp: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: investments,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching investments',
      error: error.message
    });
  }
});

module.exports = router;