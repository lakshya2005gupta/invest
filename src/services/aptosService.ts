import { AptosClient, AptosAccount, FaucetClient, HexString, TxnBuilderTypes, BCS } from 'aptos';

interface PreIPOInvestment {
  companyId: number;
  companyName: string;
  tokens: number;
  tokenPrice: number;
  totalAmount: number;
  transactionHash: string;
  timestamp: string;
  contractAddress: string;
}

interface TokenBalance {
  companyId: number;
  companyName: string;
  tokens: number;
  currentValue: number;
  contractAddress: string;
  shareClass?: string;
  votingRights?: boolean;
  dividendRights?: boolean;
}

interface ShareToken {
  tokenId: string;
  companyId: number;
  companyName: string;
  shares: number;
  shareClass: string;
  votingRights: boolean;
  dividendRights: boolean;
  createdAt: string;
  lastTransfer: string;
}

interface DividendDistribution {
  companyId: number;
  totalAmount: number;
  perShareAmount: number;
  recordDate: string;
  paymentDate: string;
  isPaid: boolean;
}

class AptosService {
  private client: AptosClient;
  private faucetClient: FaucetClient;
  private readonly moduleAddress = '0x1'; // Replace with actual deployed address
  private readonly nodeUrl = 'https://fullnode.testnet.aptoslabs.com/v1';
  private readonly faucetUrl = 'https://faucet.testnet.aptoslabs.com';

  constructor() {
    this.client = new AptosClient(this.nodeUrl);
    this.faucetClient = new FaucetClient(this.nodeUrl, this.faucetUrl);
  }

  // Initialize platform (admin only)
  async initializePlatform(adminAccount: AptosAccount): Promise<string> {
    try {
      const payload = {
        type: 'entry_function_payload',
        function: `${this.moduleAddress}::PreIPOTokenization::initialize`,
        arguments: [],
        type_arguments: [],
      };

      const txnRequest = await this.client.generateTransaction(adminAccount.address(), payload);
      const signedTxn = await this.client.signTransaction(adminAccount, txnRequest);
      const transactionRes = await this.client.submitTransaction(signedTxn);
      
      await this.client.waitForTransaction(transactionRes.hash);
      return transactionRes.hash;
    } catch (error) {
      console.error('Error initializing platform:', error);
      throw error;
    }
  }

  // Create a new Pre-IPO company
  async createCompany(
    adminAccount: AptosAccount,
    name: string,
    sector: string,
    valuation: number,
    tokenPrice: number,
    totalTokens: number,
    minInvestment: number
  ): Promise<string> {
    try {
      const payload = {
        type: 'entry_function_payload',
        function: `${this.moduleAddress}::PreIPOTokenization::create_company`,
        arguments: [
          name,
          sector,
          valuation.toString(),
          (tokenPrice * 100000000).toString(), // Scale up for precision
          totalTokens.toString(),
          (minInvestment * 100000000).toString(),
        ],
        type_arguments: [],
      };

      const txnRequest = await this.client.generateTransaction(adminAccount.address(), payload);
      const signedTxn = await this.client.signTransaction(adminAccount, txnRequest);
      const transactionRes = await this.client.submitTransaction(signedTxn);
      
      await this.client.waitForTransaction(transactionRes.hash);
      return transactionRes.hash;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  // Invest in Pre-IPO company
  async investInPreIPO(
    walletAddress: string,
    companyId: number,
    companyName: string,
    tokens: number,
    tokenPrice: number,
    contractAddress: string
  ): Promise<PreIPOInvestment> {
    try {
      // In a real implementation, this would interact with the connected wallet
      // For now, we'll simulate the transaction
      
      const totalAmount = tokens * tokenPrice;
      
      // Simulate wallet interaction
      if (typeof window !== 'undefined' && (window as any).aptos) {
        const payload = {
          type: 'entry_function_payload',
          function: `${this.moduleAddress}::PreIPOTokenization::invest`,
          arguments: [
            companyId.toString(),
            tokens.toString(),
            (totalAmount * 100000000).toString(), // Convert to smallest unit
          ],
          type_arguments: ['0x1::aptos_coin::AptosCoin'],
        };

        const response = await (window as any).aptos.signAndSubmitTransaction(payload);
        
        const investment: PreIPOInvestment = {
          companyId,
          companyName,
          tokens,
          tokenPrice,
          totalAmount,
          transactionHash: response.hash,
          timestamp: new Date().toISOString(),
          contractAddress,
        };

        // Store investment locally for demo purposes
        this.storeInvestment(walletAddress, investment);
        return investment;
      } else {
        // Fallback simulation
        const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        const investment: PreIPOInvestment = {
          companyId,
          companyName,
          tokens,
          tokenPrice,
          totalAmount,
          transactionHash,
          timestamp: new Date().toISOString(),
          contractAddress,
        };

        this.storeInvestment(walletAddress, investment);
        return investment;
      }
    } catch (error) {
      console.error('Error investing in Pre-IPO:', error);
      throw error;
    }
  }

  // Get company information from blockchain
  async getCompanyInfo(companyId: number): Promise<any> {
    try {
      const resource = await this.client.getAccountResource(
        this.moduleAddress,
        `${this.moduleAddress}::PreIPOTokenization::PlatformStorage`
      );

      // In a real implementation, you'd parse the resource data
      // This is simplified for demonstration
      return {
        id: companyId,
        name: 'Sample Company',
        sector: 'Technology',
        valuation: 1000000000,
        tokenPrice: 50,
        totalTokens: 20000000,
        availableTokens: 15000000,
        minInvestment: 1000,
        isActive: true,
      };
    } catch (error) {
      console.error('Error fetching company info:', error);
      return null;
    }
  }

  // Get user's token balances
  async getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
    try {
      // Try to get data from blockchain first
      try {
        const resource = await this.client.getAccountResource(
          walletAddress,
          `${this.moduleAddress}::PreIPOTokenization::InvestorPortfolio`
        );
        
        // Parse blockchain data (simplified)
        // In real implementation, you'd properly decode the resource data
      } catch (resourceError) {
        // Fallback to local storage for demo
      }

      const investments = this.getStoredInvestments(walletAddress);
      
      // Group by company and calculate current values
      const balanceMap = new Map<number, TokenBalance>();
      
      investments.forEach(investment => {
        if (balanceMap.has(investment.companyId)) {
          const existing = balanceMap.get(investment.companyId)!;
          existing.tokens += investment.tokens;
          existing.currentValue += investment.totalAmount * this.getGrowthMultiplier(investment.companyId);
        } else {
          balanceMap.set(investment.companyId, {
            companyId: investment.companyId,
            companyName: investment.companyName,
            tokens: investment.tokens,
            currentValue: investment.totalAmount * this.getGrowthMultiplier(investment.companyId),
            contractAddress: investment.contractAddress,
            shareClass: 'Common',
            votingRights: true,
            dividendRights: true,
          });
        }
      });

      return Array.from(balanceMap.values());
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  }

  // Get share tokens for an investor
  async getShareTokens(walletAddress: string): Promise<ShareToken[]> {
    try {
      // In real implementation, query blockchain for share tokens
      const investments = this.getStoredInvestments(walletAddress);
      
      return investments.map((investment, index) => ({
        tokenId: `TOKEN_${investment.companyId}_${index}`,
        companyId: investment.companyId,
        companyName: investment.companyName,
        shares: investment.tokens,
        shareClass: 'Common',
        votingRights: true,
        dividendRights: true,
        createdAt: investment.timestamp,
        lastTransfer: investment.timestamp,
      }));
    } catch (error) {
      console.error('Error fetching share tokens:', error);
      return [];
    }
  }

  // Transfer tokens between wallets
  async transferTokens(
    fromWallet: string,
    toWallet: string,
    tokenId: string,
    shares: number
  ): Promise<string> {
    try {
      if (typeof window !== 'undefined' && (window as any).aptos) {
        const payload = {
          type: 'entry_function_payload',
          function: `${this.moduleAddress}::TokenizedShares::transfer_shares`,
          arguments: [
            toWallet,
            tokenId,
            shares.toString(),
          ],
          type_arguments: [],
        };

        const response = await (window as any).aptos.signAndSubmitTransaction(payload);
        return response.hash;
      } else {
        // Simulate transfer
        return `0x${Math.random().toString(16).substr(2, 64)}`;
      }
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  // Get dividend distributions
  async getDividendDistributions(companyId: number): Promise<DividendDistribution[]> {
    try {
      // In real implementation, query blockchain for dividend history
      return [
        {
          companyId,
          totalAmount: 100000,
          perShareAmount: 5,
          recordDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          isPaid: true,
        },
        {
          companyId,
          totalAmount: 150000,
          perShareAmount: 7.5,
          recordDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          paymentDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
          isPaid: true,
        },
      ];
    } catch (error) {
      console.error('Error fetching dividend distributions:', error);
      return [];
    }
  }

  // Get platform statistics
  async getPlatformStats(): Promise<{ totalCompanies: number; totalVolume: number; totalInvestors: number }> {
    try {
      const resource = await this.client.getAccountResource(
        this.moduleAddress,
        `${this.moduleAddress}::PreIPOTokenization::PlatformStorage`
      );

      // Parse resource data (simplified)
      return {
        totalCompanies: 6,
        totalVolume: 5000000,
        totalInvestors: 1250,
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        totalCompanies: 0,
        totalVolume: 0,
        totalInvestors: 0,
      };
    }
  }

  // Verify transaction on blockchain
  async verifyTransaction(transactionHash: string): Promise<boolean> {
    try {
      const transaction = await this.client.getTransactionByHash(transactionHash);
      return transaction.success;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }

  // Get account balance
  async getAccountBalance(address: string): Promise<number> {
    try {
      const resources = await this.client.getAccountResources(address);
      const coinResource = resources.find(
        (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );
      
      if (coinResource) {
        const balance = (coinResource.data as any).coin.value;
        return parseInt(balance) / 100000000; // Convert from smallest unit to APT
      }
      
      return 0;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return 0;
    }
  }

  // Fund account from faucet (testnet only)
  async fundAccount(address: string): Promise<void> {
    try {
      await this.faucetClient.fundAccount(address, 100000000); // 1 APT
    } catch (error) {
      console.error('Error funding account:', error);
      throw error;
    }
  }

  // Private helper methods
  private getGrowthMultiplier(companyId: number): number {
    // Simulate different growth rates for different companies
    const growthRates = [1.15, 1.25, 1.08, 1.32, 1.18, 1.22];
    return growthRates[companyId % growthRates.length] || 1.15;
  }

  private storeInvestment(walletAddress: string, investment: PreIPOInvestment): void {
    const key = `preipo_investments_${walletAddress}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(investment);
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private getStoredInvestments(walletAddress: string): PreIPOInvestment[] {
    const key = `preipo_investments_${walletAddress}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // Get investment history
  async getInvestmentHistory(walletAddress: string): Promise<PreIPOInvestment[]> {
    return this.getStoredInvestments(walletAddress);
  }

  // Get token metadata
  async getTokenMetadata(contractAddress: string): Promise<any> {
    try {
      // In real implementation, query blockchain for token metadata
      return {
        name: 'Pre-IPO Share Token',
        symbol: 'PREIPO',
        decimals: 8,
        totalSupply: '1000000000',
        contractAddress,
        description: 'Tokenized Pre-IPO shares on Aptos blockchain',
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }
  }
}

export const aptosService = new AptosService();
export default aptosService;