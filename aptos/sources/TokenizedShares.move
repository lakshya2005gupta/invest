module pre_ipo_platform::TokenizedShares {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;
    use std::vector;

    // Share token structure
    struct ShareToken has key, store {
        company_id: u64,
        token_id: String,
        owner: address,
        shares: u64,
        share_class: String, // Common, Preferred, etc.
        voting_rights: bool,
        dividend_rights: bool,
        created_at: u64,
        last_transfer: u64,
    }

    // Share registry for a company
    struct ShareRegistry has key, store {
        company_id: u64,
        total_shares: u64,
        issued_shares: u64,
        share_classes: Table<String, ShareClass>,
        shareholders: Table<address, u64>, // address -> total shares
        share_tokens: Table<String, ShareToken>,
        transfer_restrictions: TransferRestrictions,
    }

    // Share class definition
    struct ShareClass has store, copy, drop {
        class_name: String,
        total_authorized: u64,
        issued: u64,
        par_value: u64,
        voting_rights: bool,
        dividend_preference: u64, // 0 = no preference, higher = higher preference
        liquidation_preference: u64,
    }

    // Transfer restrictions
    struct TransferRestrictions has store, copy, drop {
        lock_period: u64, // seconds
        whitelist_only: bool,
        max_shareholders: u64,
        min_holding_period: u64,
    }

    // Dividend distribution
    struct DividendDistribution has store, copy, drop {
        company_id: u64,
        total_amount: u64,
        per_share_amount: u64,
        record_date: u64,
        payment_date: u64,
        is_paid: bool,
    }

    // Platform storage for share management
    struct SharePlatformStorage has key {
        admin: address,
        registries: Table<u64, ShareRegistry>,
        whitelisted_investors: Table<address, bool>,
        dividend_distributions: Table<u64, vector<DividendDistribution>>,
        
        // Events
        share_issued_events: EventHandle<ShareIssuedEvent>,
        share_transfer_events: EventHandle<ShareTransferEvent>,
        dividend_events: EventHandle<DividendEvent>,
    }

    // Events
    struct ShareIssuedEvent has drop, store {
        company_id: u64,
        recipient: address,
        shares: u64,
        share_class: String,
        timestamp: u64,
    }

    struct ShareTransferEvent has drop, store {
        company_id: u64,
        from: address,
        to: address,
        shares: u64,
        token_id: String,
        timestamp: u64,
    }

    struct DividendEvent has drop, store {
        company_id: u64,
        recipient: address,
        amount: u64,
        timestamp: u64,
    }

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_REGISTRY_NOT_FOUND: u64 = 2;
    const E_INSUFFICIENT_SHARES: u64 = 3;
    const E_TRANSFER_RESTRICTED: u64 = 4;
    const E_NOT_WHITELISTED: u64 = 5;
    const E_LOCK_PERIOD_ACTIVE: u64 = 6;
    const E_INVALID_SHARE_CLASS: u64 = 7;

    // Initialize share platform
    public entry fun initialize_share_platform(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, SharePlatformStorage {
            admin: admin_addr,
            registries: table::new(),
            whitelisted_investors: table::new(),
            dividend_distributions: table::new(),
            
            share_issued_events: account::new_event_handle<ShareIssuedEvent>(admin),
            share_transfer_events: account::new_event_handle<ShareTransferEvent>(admin),
            dividend_events: account::new_event_handle<DividendEvent>(admin),
        });
    }

    // Create share registry for a company
    public entry fun create_share_registry(
        admin: &signer,
        company_id: u64,
        total_shares: u64,
        lock_period: u64,
        whitelist_only: bool,
        max_shareholders: u64,
    ) acquires SharePlatformStorage {
        let admin_addr = signer::address_of(admin);
        let storage = borrow_global_mut<SharePlatformStorage>(@pre_ipo_platform);
        
        assert!(storage.admin == admin_addr, E_NOT_AUTHORIZED);

        let registry = ShareRegistry {
            company_id,
            total_shares,
            issued_shares: 0,
            share_classes: table::new(),
            shareholders: table::new(),
            share_tokens: table::new(),
            transfer_restrictions: TransferRestrictions {
                lock_period,
                whitelist_only,
                max_shareholders,
                min_holding_period: 86400, // 1 day default
            },
        };

        table::add(&mut storage.registries, company_id, registry);
    }

    // Add share class
    public entry fun add_share_class(
        admin: &signer,
        company_id: u64,
        class_name: String,
        total_authorized: u64,
        par_value: u64,
        voting_rights: bool,
        dividend_preference: u64,
        liquidation_preference: u64,
    ) acquires SharePlatformStorage {
        let admin_addr = signer::address_of(admin);
        let storage = borrow_global_mut<SharePlatformStorage>(@pre_ipo_platform);
        
        assert!(storage.admin == admin_addr, E_NOT_AUTHORIZED);
        assert!(table::contains(&storage.registries, company_id), E_REGISTRY_NOT_FOUND);

        let registry = table::borrow_mut(&mut storage.registries, company_id);
        let share_class = ShareClass {
            class_name,
            total_authorized,
            issued: 0,
            par_value,
            voting_rights,
            dividend_preference,
            liquidation_preference,
        };

        table::add(&mut registry.share_classes, class_name, share_class);
    }

    // Issue shares to investor
    public entry fun issue_shares(
        admin: &signer,
        company_id: u64,
        recipient: address,
        shares: u64,
        share_class: String,
    ) acquires SharePlatformStorage {
        let admin_addr = signer::address_of(admin);
        let storage = borrow_global_mut<SharePlatformStorage>(@pre_ipo_platform);
        
        assert!(storage.admin == admin_addr, E_NOT_AUTHORIZED);
        assert!(table::contains(&storage.registries, company_id), E_REGISTRY_NOT_FOUND);

        let registry = table::borrow_mut(&mut storage.registries, company_id);
        
        // Check if whitelist restriction applies
        if (registry.transfer_restrictions.whitelist_only) {
            assert!(table::contains(&storage.whitelisted_investors, recipient), E_NOT_WHITELISTED);
        };

        assert!(table::contains(&registry.share_classes, share_class), E_INVALID_SHARE_CLASS);
        
        let class_info = table::borrow_mut(&mut registry.share_classes, share_class);
        assert!(class_info.issued + shares <= class_info.total_authorized, E_INSUFFICIENT_SHARES);

        // Update share class
        class_info.issued = class_info.issued + shares;
        registry.issued_shares = registry.issued_shares + shares;

        // Update shareholder record
        if (table::contains(&registry.shareholders, recipient)) {
            let existing_shares = table::borrow_mut(&mut registry.shareholders, recipient);
            *existing_shares = *existing_shares + shares;
        } else {
            table::add(&mut registry.shareholders, recipient, shares);
        };

        // Create share token
        let token_id = generate_token_id(company_id, recipient, shares);
        let share_token = ShareToken {
            company_id,
            token_id,
            owner: recipient,
            shares,
            share_class,
            voting_rights: class_info.voting_rights,
            dividend_rights: true,
            created_at: timestamp::now_seconds(),
            last_transfer: timestamp::now_seconds(),
        };

        table::add(&mut registry.share_tokens, token_id, share_token);

        // Emit event
        event::emit_event(&mut storage.share_issued_events, ShareIssuedEvent {
            company_id,
            recipient,
            shares,
            share_class,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Transfer shares between investors
    public entry fun transfer_shares(
        from: &signer,
        to: address,
        token_id: String,
        shares: u64,
    ) acquires SharePlatformStorage {
        let from_addr = signer::address_of(from);
        let storage = borrow_global_mut<SharePlatformStorage>(@pre_ipo_platform);
        
        // Find the token and registry
        let company_id = 0;
        let found = false;
        
        // In a real implementation, you'd have a more efficient way to find this
        // This is simplified for demonstration
        
        assert!(found, E_REGISTRY_NOT_FOUND);
        
        let registry = table::borrow_mut(&mut storage.registries, company_id);
        assert!(table::contains(&registry.share_tokens, token_id), E_REGISTRY_NOT_FOUND);
        
        let share_token = table::borrow_mut(&mut registry.share_tokens, token_id);
        assert!(share_token.owner == from_addr, E_NOT_AUTHORIZED);
        assert!(share_token.shares >= shares, E_INSUFFICIENT_SHARES);

        // Check transfer restrictions
        let current_time = timestamp::now_seconds();
        assert!(
            current_time >= share_token.created_at + registry.transfer_restrictions.lock_period,
            E_LOCK_PERIOD_ACTIVE
        );

        if (registry.transfer_restrictions.whitelist_only) {
            assert!(table::contains(&storage.whitelisted_investors, to), E_NOT_WHITELISTED);
        };

        // Update token ownership
        share_token.owner = to;
        share_token.last_transfer = current_time;

        // Update shareholder records
        let from_shares = table::borrow_mut(&mut registry.shareholders, from_addr);
        *from_shares = *from_shares - shares;

        if (table::contains(&registry.shareholders, to)) {
            let to_shares = table::borrow_mut(&mut registry.shareholders, to);
            *to_shares = *to_shares + shares;
        } else {
            table::add(&mut registry.shareholders, to, shares);
        };

        // Emit event
        event::emit_event(&mut storage.share_transfer_events, ShareTransferEvent {
            company_id,
            from: from_addr,
            to,
            shares,
            token_id,
            timestamp: current_time,
        });
    }

    // Distribute dividends
    public entry fun distribute_dividends(
        admin: &signer,
        company_id: u64,
        total_amount: u64
    ) acquires SharePlatformStorage {
        let admin_addr = signer::address_of(admin);
        let storage = borrow_global_mut<SharePlatformStorage>(@pre_ipo_platform);
        
        assert!(storage.admin == admin_addr, E_NOT_AUTHORIZED);
        assert!(table::contains(&storage.registries, company_id), E_REGISTRY_NOT_FOUND);

        let registry = table::borrow(&storage.registries, company_id);
        let per_share_amount = total_amount / registry.issued_shares;

        let distribution = DividendDistribution {
            company_id,
            total_amount,
            per_share_amount,
            record_date: timestamp::now_seconds(),
            payment_date: timestamp::now_seconds(),
            is_paid: true,
        };

        // Add to dividend history
        if (!table::contains(&storage.dividend_distributions, company_id)) {
            table::add(&mut storage.dividend_distributions, company_id, vector::empty());
        };
        
        let distributions = table::borrow_mut(&mut storage.dividend_distributions, company_id);
        vector::push_back(distributions, distribution);

        // In a real implementation, you would iterate through shareholders and distribute
        // This is simplified for demonstration
        // coin::deposit(@pre_ipo_platform, payment); // REMOVED
    }

    // Helper function to generate token ID
    fun generate_token_id(_company_id: u64, _recipient: address, _shares: u64): String {
        // Simplified token ID generation
        string::utf8(b"TOKEN_ID_PLACEHOLDER")
    }

    // View functions
    #[view]
    public fun get_shareholder_info(company_id: u64, shareholder: address): u64 acquires SharePlatformStorage {
        let storage = borrow_global<SharePlatformStorage>(@pre_ipo_platform);
        
        if (!table::contains(&storage.registries, company_id)) {
            return 0
        };

        let registry = table::borrow(&storage.registries, company_id);
        if (!table::contains(&registry.shareholders, shareholder)) {
            return 0
        };

        *table::borrow(&registry.shareholders, shareholder)
    }

    #[view]
    public fun get_share_registry_info(company_id: u64): (u64, u64) acquires SharePlatformStorage {
        let storage = borrow_global<SharePlatformStorage>(@pre_ipo_platform);
        
        if (!table::contains(&storage.registries, company_id)) {
            return (0, 0)
        };

        let registry = table::borrow(&storage.registries, company_id);
        (registry.total_shares, registry.issued_shares)
    }
}