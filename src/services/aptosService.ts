import { Aptos, AptosConfig, Network } from 'aptos';

// Aptos configuration
const aptosConfig = new AptosConfig({ 
  network: Network.TESTNET // Change to MAINNET for production
});
const aptos = new Aptos(aptosConfig);

// Contract addresses (replace with actual deployed contract addresses)
const CONTRACT_ADDRESS = "0x1"; // Replace with your deployed contract address
const MODULE_NAME = "pre_ipo::Tokenization";

export interface PreIPOInvestment {
  companyId: number;
  companyName: string;
  tokens: number;
  tokenPrice: number;
  totalAmount: number;
  walletAddress: string;
  contractAddress: string;
  transactionHash?: string;
  timestamp: string;
}

export interface TokenBalance {
  companyId: number;
  companyName: string;
  tokens: number;
  currentValue: number;
}

class AptosService {
  // Get account balance
  async getAccountBalance(address: string): Promise<number> {
    try {
      const resources = await aptos.getAccountResources({ accountAddress: address });
      const coinResource = resources.find(
        (resource) => resource.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );
      
      if (coinResource) {
        return parseInt((coinResource.data as any).coin.value) / 100000000; // Convert from octas to APT
      }
      return 0;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return 0;
    }
  }

  // Get Pre-IPO token balance for a user
  async getPreIPOBalance(walletAddress: string): Promise<TokenBalance[]> {
    try {
      // This would call the smart contract to get user's token balances
      // For now, returning mock data
      const mockBalances: TokenBalance[] = [
        {
          companyId: 1,
          companyName: 'ByteDance',
          tokens: 100,
          currentValue: 5500
        },
        {
          companyId: 2,
          companyName: 'SpaceX',
          tokens: 25,
          currentValue: 3250
        }
      ];
      
      return mockBalances;
    } catch (error) {
      console.error('Error fetching Pre-IPO balance:', error);
      return [];
    }
  }

  // Invest in Pre-IPO tokens
  async investInPreIPO(
    walletAddress: string,
    companyId: number,
    companyName: string,
    tokens: number,
    tokenPrice: number,
    signAndSubmitTransaction: any
  ): Promise<PreIPOInvestment> {
    try {
      const totalAmount = tokens * tokenPrice;
      
      // Prepare transaction payload
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::mint_tokens`,
        arguments: [walletAddress, tokens.toString()],
        type_arguments: [],
      };

      // Submit transaction
      const response = await signAndSubmitTransaction(payload);
      
      // Wait for transaction confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });

      const investment: PreIPOInvestment = {
        companyId,
        companyName,
        tokens,
        tokenPrice,
        totalAmount,
        walletAddress,
        contractAddress: CONTRACT_ADDRESS,
        transactionHash: response.hash,
        timestamp: new Date().toISOString()
      };

      return investment;
    } catch (error) {
      console.error('Error investing in Pre-IPO:', error);
      throw new Error('Failed to process Pre-IPO investment');
    }
  }

  // Get investment history
  async getInvestmentHistory(walletAddress: string): Promise<PreIPOInvestment[]> {
    try {
      // This would fetch from blockchain or local storage
      // For now, returning mock data
      const mockHistory: PreIPOInvestment[] = [
        {
          companyId: 1,
          companyName: 'ByteDance',
          tokens: 100,
          tokenPrice: 50,
          totalAmount: 5000,
          walletAddress,
          contractAddress: CONTRACT_ADDRESS,
          transactionHash: '0x123...abc',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      return mockHistory;
    } catch (error) {
      console.error('Error fetching investment history:', error);
      return [];
    }
  }

  // Transfer tokens between wallets
  async transferTokens(
    fromAddress: string,
    toAddress: string,
    companyId: number,
    tokens: number,
    signAndSubmitTransaction: any
  ): Promise<string> {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::transfer_tokens`,
        arguments: [toAddress, companyId.toString(), tokens.toString()],
        type_arguments: [],
      };

      const response = await signAndSubmitTransaction(payload);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      return response.hash;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw new Error('Failed to transfer tokens');
    }
  }

  // Get transaction details
  async getTransactionDetails(transactionHash: string) {
    try {
      const transaction = await aptos.getTransactionByHash({ transactionHash });
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      return null;
    }
  }

  // Estimate transaction fee
  async estimateTransactionFee(payload: any): Promise<number> {
    try {
      // This would estimate the gas fee for the transaction
      // For now, returning a fixed estimate
      return 0.001; // 0.001 APT
    } catch (error) {
      console.error('Error estimating transaction fee:', error);
      return 0.001;
    }
  }
}

export const aptosService = new AptosService();
export default aptosService;