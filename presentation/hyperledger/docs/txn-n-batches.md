# Transactions and Batches
Modifications to state are performed by creating and applying transactions. A client creates a transaction and submits it to the validator. The validator applies the transaction which causes a change to state.

Transactions are always wrapped inside of a batch. All transactions within a batch are committed to state together or not at all. Thus, batches are the atomic unit of state change.

![Transaction Structure](http://kiro112.github.io/presentation/hyperledger/images/arch_batch_and_transaction.svg)
