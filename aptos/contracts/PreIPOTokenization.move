module pre_ipo_platform::PreIPOTokenization {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use std::option::{Self, Option};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_COMPANY_NOT_FOUND: u64 = 2;
    const E_INSUFFICIENT_TOKENS: u64 = 3;
    const E_INVALID_AMOUNT: u64 = 4;
    const E_COMPANY_ALREADY_EXISTS: u64 = 5;
    const E_INVESTMENT_CLOSED: u64 = 6;
    const E_MINIMUM_INVESTMENT_NOT_MET: u64 = 7;

    // Company information structure
    struct Company has store, copy, drop {
        id: u64,
        name: String,
        sector: String,
        valuation: u64,
        token_price: u64, // Price in APT (scaled by 10^8)
        total_tokens: u64,
        available_tokens: u64,
        min_investment: u64,
        is_active: bool,
        created_at: u64,
        ipo_date: Option<u64>,
    }

    // Investment record
    struct Investment has store, copy, drop {
        investor: address,
        company_id: u64,
        tokens: u64,
        amount_paid: u64,
        timestamp: u64,
        transaction_hash: String,
    }

    // Investor portfolio
    struct InvestorPortfolio has store {
        total_investments: u64,
        companies: Table<u64, u64>, // company_id -> token_amount
        investment_history: vector<Investment>,
    }

    // Platform storage
    struct PlatformStorage has key {
        admin: address,
        companies: Table<u64, Company>,
        company_count: u64,
        investors: Table<address, InvestorPortfolio>,
        total_volume: u64,
        platform_fee: u64, // Fee percentage (scaled by 100)
        
        // Events
        company_created_events: EventHandle<CompanyCreatedEvent>,
        investment_events: EventHandle<InvestmentEvent>,
        token_transfer_events: EventHandle<TokenTransferEvent>,
    }

    // Event structures
    struct CompanyCreatedEvent has drop, store {
        company_id: u64,
        name: String,
        creator: address,
        timestamp: u64,
    }

    struct InvestmentEvent has drop, store {
        investor: address,
        company_id: u64,
        tokens: u64,
        amount: u64,
        timestamp: u64,
    }

    struct TokenTransferEvent has drop, store {
        from: address,
        to: address,
        company_id: u64,
        tokens: u64,
        timestamp: u64,
    }

    // Initialize the platform
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, PlatformStorage {
            admin: admin_addr,
            companies: table::new(),
            company_count: 0,
            investors: table::new(),
            total_volume: 0,
            platform_fee: 250, // 2.5%
            
            company_created_events: account::new_event_handle<CompanyCreatedEvent>(admin),
            investment_events: account::new_event_handle<InvestmentEvent>(admin),
            token_transfer_events: account::new_event_handle<TokenTransferEvent>(admin),
        });
    }

    // Create a new Pre-IPO company
    public entry fun create_company(
        admin: &signer,
        name: String,
        sector: String,
        valuation: u64,
        token_price: u64,
        total_tokens: u64,
        min_investment: u64,
    ) acquires PlatformStorage {
        let admin_addr = signer::address_of(admin);
        let storage = borrow_global_mut<PlatformStorage>(@pre_ipo_platform);
        
        assert!(storage.admin == admin_addr, E_NOT_AUTHORIZED);
        assert!(token_price > 0, E_INVALID_AMOUNT);
        assert!(total_tokens > 0, E_INVALID_AMOUNT);

        let company_id = storage.company_count + 1;
        let company = Company {
            id: company_id,
            name,
            sector,
            valuation,
            token_price,
            total_tokens,
            available_tokens: total_tokens,
            min_investment,
            is_active: true,
            created_at: timestamp::now_seconds(),
            ipo_date: option::none(),
        };

        table::add(&mut storage.companies, company_id, company);
        storage.company_count = company_id;

        // Emit event
        event::emit_event(&mut storage.company_created_events, CompanyCreatedEvent {
            company_id,
            name,
            creator: admin_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Invest in a Pre-IPO company
    public entry fun invest(
        investor: &signer,
        company_id: u64,
        tokens: u64,
        payment: Coin<AptosCoin>,
    ) acquires PlatformStorage {
        let investor_addr = signer::address_of(investor);
        let storage = borrow_global_mut<PlatformStorage>(@pre_ipo_platform);
        
        assert!(table::contains(&storage.companies, company_id), E_COMPANY_NOT_FOUND);
        
        let company = table::borrow_mut(&mut storage.companies, company_id);
        assert!(company.is_active, E_INVESTMENT_CLOSED);
        assert!(tokens <= company.available_tokens, E_INSUFFICIENT_TOKENS);
        
        let required_amount = (tokens * company.token_price) / 100000000; // Scale down
        let min_tokens = (company.min_investment * 100000000) / company.token_price; // Scale up
        
        assert!(tokens >= min_tokens, E_MINIMUM_INVESTMENT_NOT_MET);
        assert!(coin::value(&payment) >= required_amount, E_INVALID_AMOUNT);

        // Calculate platform fee
        let fee_amount = (required_amount * storage.platform_fee) / 10000;
        let net_amount = required_amount - fee_amount;

        // Update company tokens
        company.available_tokens = company.available_tokens - tokens;

        // Update investor portfolio
        if (!table::contains(&storage.investors, investor_addr)) {
            table::add(&mut storage.investors, investor_addr, InvestorPortfolio {
                total_investments: 0,
                companies: table::new(),
                investment_history: vector::empty(),
            });
        };

        let portfolio = table::borrow_mut(&mut storage.investors, investor_addr);
        portfolio.total_investments = portfolio.total_investments + net_amount;

        if (table::contains(&portfolio.companies, company_id)) {
            let existing_tokens = table::borrow_mut(&mut portfolio.companies, company_id);
            *existing_tokens = *existing_tokens + tokens;
        } else {
            table::add(&mut portfolio.companies, company_id, tokens);
        };

        // Create investment record
        let investment = Investment {
            investor: investor_addr,
            company_id,
            tokens,
            amount_paid: net_amount,
            timestamp: timestamp::now_seconds(),
            transaction_hash: string::utf8(b""), // Will be filled by frontend
        };

        vector::push_back(&mut portfolio.investment_history, investment);
        storage.total_volume = storage.total_volume + net_amount;

        // Transfer payment to platform (simplified - in production, split between platform and company)
        coin::deposit(@pre_ipo_platform, payment);

        // Emit event
        event::emit_event(&mut storage.investment_events, InvestmentEvent {
            investor: investor_addr,
            company_id,
            tokens,
            amount: net_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Transfer tokens between investors
    public entry fun transfer_tokens(
        from: &signer,
        to: address,
        company_id: u64,
        tokens: u64,
    ) acquires PlatformStorage {
        let from_addr = signer::address_of(from);
        let storage = borrow_global_mut<PlatformStorage>(@pre_ipo_platform);
        
        assert!(table::contains(&storage.investors, from_addr), E_NOT_AUTHORIZED);
        
        let from_portfolio = table::borrow_mut(&mut storage.investors, from_addr);
        assert!(table::contains(&from_portfolio.companies, company_id), E_COMPANY_NOT_FOUND);
        
        let from_tokens = table::borrow_mut(&mut from_portfolio.companies, company_id);
        assert!(*from_tokens >= tokens, E_INSUFFICIENT_TOKENS);
        
        *from_tokens = *from_tokens - tokens;

        // Update recipient portfolio
        if (!table::contains(&storage.investors, to)) {
            table::add(&mut storage.investors, to, InvestorPortfolio {
                total_investments: 0,
                companies: table::new(),
                investment_history: vector::empty(),
            });
        };

        let to_portfolio = table::borrow_mut(&mut storage.investors, to);
        if (table::contains(&to_portfolio.companies, company_id)) {
            let to_tokens = table::borrow_mut(&mut to_portfolio.companies, company_id);
            *to_tokens = *to_tokens + tokens;
        } else {
            table::add(&mut to_portfolio.companies, company_id, tokens);
        };

        // Emit event
        event::emit_event(&mut storage.token_transfer_events, TokenTransferEvent {
            from: from_addr,
            to,
            company_id,
            tokens,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Get company information
    #[view]
    public fun get_company(company_id: u64): Company acquires PlatformStorage {
        let storage = borrow_global<PlatformStorage>(@pre_ipo_platform);
        assert!(table::contains(&storage.companies, company_id), E_COMPANY_NOT_FOUND);
        *table::borrow(&storage.companies, company_id)
    }

    // Get investor portfolio
    #[view]
    public fun get_investor_portfolio(investor: address): (u64, vector<u64>, vector<u64>) acquires PlatformStorage {
        let storage = borrow_global<PlatformStorage>(@pre_ipo_platform);
        
        if (!table::contains(&storage.investors, investor)) {
            return (0, vector::empty(), vector::empty())
        };

        let portfolio = table::borrow(&storage.investors, investor);
        let company_ids = vector::empty<u64>();
        let token_amounts = vector::empty<u64>();

        // Note: In a real implementation, you'd iterate through the table
        // This is a simplified version for demonstration
        
        (portfolio.total_investments, company_ids, token_amounts)
    }

    // Get investor tokens for a specific company
    #[view]
    public fun get_investor_tokens(investor: address, company_id: u64): u64 acquires PlatformStorage {
        let storage = borrow_global<PlatformStorage>(@pre_ipo_platform);
        
        if (!table::contains(&storage.investors, investor)) {
            return 0
        };

        let portfolio = table::borrow(&storage.investors, investor);
        if (!table::contains(&portfolio.companies, company_id)) {
            return 0
        };

        *table::borrow(&portfolio.companies, company_id)
    }

    // Get platform statistics
    #[view]
    public fun get_platform_stats(): (u64, u64, u64) acquires PlatformStorage {
        let storage = borrow_global<PlatformStorage>(@pre_ipo_platform);
        (storage.company_count, storage.total_volume, storage.platform_fee)
    }

    // Admin functions
    public entry fun update_company_status(
        admin: &signer,
        company_id: u64,
        is_active: bool,
    ) acquires PlatformStorage {
        let admin_addr = signer::address_of(admin);
        let storage = borrow_global_mut<PlatformStorage>(@pre_ipo_platform);
        
        assert!(storage.admin == admin_addr, E_NOT_AUTHORIZED);
        assert!(table::contains(&storage.companies, company_id), E_COMPANY_NOT_FOUND);
        
        let company = table::borrow_mut(&mut storage.companies, company_id);
        company.is_active = is_active;
    }

    public entry fun set_ipo_date(
        admin: &signer,
        company_id: u64,
        ipo_date: u64,
    ) acquires PlatformStorage {
        let admin_addr = signer::address_of(admin);
        let storage = borrow_global_mut<PlatformStorage>(@pre_ipo_platform);
        
        assert!(storage.admin == admin_addr, E_NOT_AUTHORIZED);
        assert!(table::contains(&storage.companies, company_id), E_COMPANY_NOT_FOUND);
        
        let company = table::borrow_mut(&mut storage.companies, company_id);
        company.ipo_date = option::some(ipo_date);
    }
}