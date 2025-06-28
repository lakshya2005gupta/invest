module pre_ipo::Tokenization {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::table;

    struct PreIPOToken has key, store {
        amount: u64,
    }

    struct PreIPOStorage has key {
        investments: table::Table<address, PreIPOToken>,
    }

    /// Initializes the contract and sets up storage for investments
    public entry fun init(admin: &signer) {
        move_to(admin, PreIPOStorage { investments: table::new<address, PreIPOToken>() });
    }

    /// Mints Pre-IPO tokens for an investor
    public entry fun mint_tokens(admin: &signer, investor: address, amount: u64) {
        assert!(signer::address_of(admin) == @0x1, 100); // Replace @0x1 with actual admin address
        
        let storage = borrow_global_mut<PreIPOStorage>(signer::address_of(admin));
        if (table::contains(&storage.investments, investor)) {
            let mut existing = table::borrow_mut(&storage.investments, investor);
            existing.amount = existing.amount + amount;
        } else {
            table::add(&mut storage.investments, investor, PreIPOToken { amount });
        }
    }

    /// Retrieves the total investment of a user
    public fun get_investment(owner: address): u64 acquires PreIPOStorage {
        let storage = borrow_global<PreIPOStorage>(@0x1); // Replace @0x1 with actual admin address
        if (table::contains(&storage.investments, owner)) {
            table::borrow(&storage.investments, owner).amount
        } else {
            0
        }
    }
}
