# Transactions and Batches
Modifications to state are performed by creating and applying transactions. A client creates a transaction and submits it to the validator. The validator applies the transaction which causes a change to state.

Transactions are always wrapped inside of a batch. All transactions within a batch are committed to state together or not at all. Thus, batches are the atomic unit of state change.

## Structure

![Transaction Structure](http://kiro112.github.io/presentation/hyperledger/images/arch_batch_and_transaction.svg)


## Transaction Data Structure

Transactions are serialized using Protocol Buffers. They consists of two message types:

	message TransactionHeader {
	    // Public key for the client who added this transaction to a batch
	    string batcher_pubkey = 1;

	    // A list of transaction signatures that describe the transactions that
	    // must be processed before this transaction can be valid
	    repeated string dependencies = 2;

	    // The family name correlates to the transaction processor's family name
	    // that this transaction can be processed on, for example 'intkey'
	    string family_name = 3;

	    // The family version correlates to the transaction processor's family
	    // version that this transaction can be processed on, for example "1.0"
	    string family_version = 4;

	    // A list of addresses that are given to the context manager and control
	    // what addresses the transaction processor is allowed to read from.
	    repeated string inputs = 5;

	    // A random string that provides uniqueness for transactions with
	    // otherwise identical fields.
	    string nonce = 6;

	    // A list of addresses that are given to the context manager and control
	    // what addresses the transaction processor is allowed to write to.
	    repeated string outputs = 7;

	    // The payload encoding correlates to the transaction processor's payload
	    // encoding that this transaction can be processed on,
	    // for example ""application/cbor""
	    string payload_encoding = 8;

	    //The sha512 hash of the encoded payload
	    string payload_sha512 = 9;

	    // Public key for the client that signed the TransactionHeader
	    string signer_pubkey = 10;
	}

	message Transaction {
	    // The serialized version of the TransactionHeader
	    bytes header = 1;

	    // The signature derived from signing the header
	    string header_signature = 2;

	    // The payload is the encoded family specific information of the
	    // transaction. Example cbor({'Verb': verb, 'Name': name,'Value': value})
	    bytes payload = 3;
	}


## Batch Data Structure

Batches are also serialized using Protocol Buffers. They consist of two message types:

	message BatchHeader {
	    // Public key for the client that signed the BatchHeader
	    string signer_pubkey = 1;

	    // List of transaction.header_signatures that match the order of
	    // transactions required for the batch
	    repeated string transaction_ids = 2;
	}

	message Batch {
	    // The serialized version of the BlockHeader
	    bytes header = 1;

	    // The signature derived from signing the header
	    string header_signature = 2;

	    // A list of the transactions that match the list of
	    // transaction_ids listed in the batch header
	    repeated Transaction transactions = 3;
	}

## Why Batches ?

A batch is the atomic unit of change in the system. If a batch has been applied, all transactions will have been applied in the order contained within the batch. If a batch has not been applied (maybe because one of the transactions is invalid), then none of the transactions will be applied.

This greatly simplifies dependency management from a client perspective, since transactions within a batch do not need explicit dependencies to be declared between them. As a result, the usefulness of explicit dependencies (contained in the dependencies field on a Transaction) are constrained to dependencies where the transactions cannot be placed in the same batch.

Batches solve an important problem which cannot be solved with explicit dependencies. Suppose we have transactions A, B, and C and that the desired behavior is A, B, C be applied in that order, and if any of them are invalid, none of them should be applied. If we attempted to solve this using only dependencies, we might attempt a relationship between them such as: C depends on B, B depends on A, and A depends on C. However, the dependencies field cannot be used to represent this relationship, since dependencies enforce order and the above is cyclic (and thus cannot be ordered).

Transactions from multiple transaction families can also be batched together, which further encourages reuse of transaction families. For example, transactions for a configuration or identity transaction family could be batched with application-specific transactions.

Transactions and batches can also be signed by different keys. For example, a browser application can sign the transaction and a server-side component can add transactions and create the batch and sign the batch. This enables interesting application patterns, including aggregation of transactions from multiple transactors into an atomic operation (the batch).

There is an important restriction enforced between transactions and batches, which is that the transaction must contain the public key of the batch signer in the batcher_pubkey field. This is to prevent transactions from being reused separate from the intended batch. So, for example, unless you have the batcher’s private key, it is not possible to take transactions from a batch and repackage them into a new batch, omitting some of the transactions.