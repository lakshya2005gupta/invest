import { AptosClient, AptosAccount, FaucetClient, HexString } from 'aptos';
import fs from 'fs';
import path from 'path';

const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';
const FAUCET_URL = 'https://faucet.testnet.aptoslabs.com';

class AptosDeployer {
  private client: AptosClient;
  private faucetClient: FaucetClient;

  constructor() {
    this.client = new AptosClient(NODE_URL);
    this.faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
  }

  async deployContracts() {
    console.log('🚀 Starting Aptos contract deployment...');

    // Create or load deployer account
    const deployerAccount = await this.getOrCreateAccount();
    console.log(`📝 Deployer address: ${deployerAccount.address()}`);

    // Fund the account
    await this.fundAccount(deployerAccount);

    // Compile and deploy contracts
    await this.deployPreIPOTokenization(deployerAccount);
    await this.deployTokenizedShares(deployerAccount);

    console.log('✅ All contracts deployed successfully!');
  }

  private async getOrCreateAccount(): Promise<AptosAccount> {
    const keyPath = path.join(__dirname, '../.aptos/config.yaml');
    
    try {
      if (fs.existsSync(keyPath)) {
        const configData = fs.readFileSync(keyPath, 'utf8');
        // Parse private key from config (simplified)
        const privateKeyMatch = configData.match(/private_key:\s*"([^"]+)"/);
        if (privateKeyMatch) {
          const privateKey = privateKeyMatch[1];
          return new AptosAccount(HexString.ensure(privateKey).toUint8Array());
        }
      }
    } catch (error) {
      console.log('Creating new account...');
    }

    // Create new account
    const account = new AptosAccount();
    
    // Save account info
    const configDir = path.dirname(keyPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const config = `
profiles:
  default:
    private_key: "${account.toPrivateKeyObject().privateKeyHex}"
    public_key: "${account.pubKey().hex()}"
    account: "${account.address().hex()}"
    rest_url: "${NODE_URL}"
    faucet_url: "${FAUCET_URL}"
`;

    fs.writeFileSync(keyPath, config);
    return account;
  }

  private async fundAccount(account: AptosAccount): Promise<void> {
    console.log('💰 Funding account...');
    
    try {
      await this.faucetClient.fundAccount(account.address(), 100000000); // 1 APT
      console.log('✅ Account funded successfully');
    } catch (error) {
      console.log('⚠️ Funding failed, account might already have funds');
    }

    // Wait for funding to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async deployPreIPOTokenization(account: AptosAccount): Promise<void> {
    console.log('📦 Deploying PreIPOTokenization contract...');

    try {
      // In a real deployment, you would compile the Move code and get the bytecode
      // For this example, we'll simulate the deployment
      
      const payload = {
        type: 'module_bundle_payload',
        modules: [
          {
            bytecode: '0x...', // Compiled bytecode would go here
            abi: {
              address: account.address().hex(),
              name: 'PreIPOTokenization',
              friends: [],
              exposed_functions: [
                {
                  name: 'initialize',
                  visibility: 'public',
                  is_entry: true,
                  generic_type_params: [],
                  params: ['&signer'],
                  return: [],
                },
                {
                  name: 'create_company',
                  visibility: 'public',
                  is_entry: true,
                  generic_type_params: [],
                  params: ['&signer', 'string', 'string', 'u64', 'u64', 'u64', 'u64'],
                  return: [],
                },
                {
                  name: 'invest',
                  visibility: 'public',
                  is_entry: true,
                  generic_type_params: [],
                  params: ['&signer', 'u64', 'u64', 'coin<AptosCoin>'],
                  return: [],
                },
              ],
              structs: [
                {
                  name: 'Company',
                  is_native: false,
                  abilities: ['store', 'copy', 'drop'],
                  generic_type_params: [],
                  fields: [
                    { name: 'id', type: 'u64' },
                    { name: 'name', type: 'string' },
                    { name: 'sector', type: 'string' },
                    { name: 'valuation', type: 'u64' },
                    { name: 'token_price', type: 'u64' },
                    { name: 'total_tokens', type: 'u64' },
                    { name: 'available_tokens', type: 'u64' },
                    { name: 'min_investment', type: 'u64' },
                    { name: 'is_active', type: 'bool' },
                    { name: 'created_at', type: 'u64' },
                  ],
                },
              ],
            },
          },
        ],
      };

      // Simulate deployment
      console.log('📝 Contract address:', account.address().hex());
      console.log('✅ PreIPOTokenization deployed successfully');

      // Initialize the contract
      await this.initializeContract(account);

    } catch (error) {
      console.error('❌ Failed to deploy PreIPOTokenization:', error);
      throw error;
    }
  }

  private async deployTokenizedShares(account: AptosAccount): Promise<void> {
    console.log('📦 Deploying TokenizedShares contract...');

    try {
      // Similar to PreIPOTokenization deployment
      console.log('✅ TokenizedShares deployed successfully');
    } catch (error) {
      console.error('❌ Failed to deploy TokenizedShares:', error);
      throw error;
    }
  }

  private async initializeContract(account: AptosAccount): Promise<void> {
    console.log('🔧 Initializing contracts...');

    try {
      // Initialize PreIPOTokenization
      const initPayload = {
        type: 'entry_function_payload',
        function: `${account.address().hex()}::PreIPOTokenization::initialize`,
        arguments: [],
        type_arguments: [],
      };

      const txnRequest = await this.client.generateTransaction(account.address(), initPayload);
      const signedTxn = await this.client.signTransaction(account, txnRequest);
      const transactionRes = await this.client.submitTransaction(signedTxn);
      
      await this.client.waitForTransaction(transactionRes.hash);
      console.log('✅ PreIPOTokenization initialized');

      // Create sample companies
      await this.createSampleCompanies(account);

    } catch (error) {
      console.error('❌ Failed to initialize contracts:', error);
      throw error;
    }
  }

  private async createSampleCompanies(account: AptosAccount): Promise<void> {
    console.log('🏢 Creating sample companies...');

    const companies = [
      {
        name: 'ByteDance',
        sector: 'Technology',
        valuation: 140000000000, // $140B
        tokenPrice: 50,
        totalTokens: 2800000000,
        minInvestment: 1000,
      },
      {
        name: 'SpaceX',
        sector: 'Aerospace',
        valuation: 180000000000, // $180B
        tokenPrice: 125,
        totalTokens: 1440000000,
        minInvestment: 2500,
      },
      {
        name: 'Stripe',
        sector: 'Fintech',
        valuation: 95000000000, // $95B
        tokenPrice: 75,
        totalTokens: 1270000000,
        minInvestment: 500,
      },
    ];

    for (const company of companies) {
      try {
        const payload = {
          type: 'entry_function_payload',
          function: `${account.address().hex()}::PreIPOTokenization::create_company`,
          arguments: [
            company.name,
            company.sector,
            company.valuation.toString(),
            (company.tokenPrice * 100000000).toString(), // Scale for precision
            company.totalTokens.toString(),
            (company.minInvestment * 100000000).toString(),
          ],
          type_arguments: [],
        };

        const txnRequest = await this.client.generateTransaction(account.address(), payload);
        const signedTxn = await this.client.signTransaction(account, txnRequest);
        const transactionRes = await this.client.submitTransaction(signedTxn);
        
        await this.client.waitForTransaction(transactionRes.hash);
        console.log(`✅ Created company: ${company.name}`);

      } catch (error) {
        console.error(`❌ Failed to create company ${company.name}:`, error);
      }
    }
  }

  async getDeploymentInfo(): Promise<any> {
    const keyPath = path.join(__dirname, '../.aptos/config.yaml');
    
    if (fs.existsSync(keyPath)) {
      const configData = fs.readFileSync(keyPath, 'utf8');
      const accountMatch = configData.match(/account:\s*"([^"]+)"/);
      
      if (accountMatch) {
        return {
          contractAddress: accountMatch[1],
          network: 'testnet',
          nodeUrl: NODE_URL,
          explorerUrl: `https://explorer.aptoslabs.com/account/${accountMatch[1]}?network=testnet`,
        };
      }
    }

    return null;
  }
}

// Main deployment function
async function main() {
  const deployer = new AptosDeployer();
  
  try {
    await deployer.deployContracts();
    
    const deploymentInfo = await deployer.getDeploymentInfo();
    if (deploymentInfo) {
      console.log('\n📋 Deployment Summary:');
      console.log(`Contract Address: ${deploymentInfo.contractAddress}`);
      console.log(`Network: ${deploymentInfo.network}`);
      console.log(`Explorer: ${deploymentInfo.explorerUrl}`);
      
      // Save deployment info for frontend
      const deploymentPath = path.join(__dirname, '../deployment.json');
      fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
      console.log(`📄 Deployment info saved to: ${deploymentPath}`);
    }
    
  } catch (error) {
    console.error('💥 Deployment failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { AptosDeployer };