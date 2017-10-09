# Transaction Family Specification

## Settings Transaction Family Specification

The settings transaction family provides a methodology for storing on-chain configuration settings.

The settings stored in state as a result of this transaction family play a critical role in the operation of a validator. For example, the consensus module uses these settings; in the case of PoET, one cross-network setting is target wait time (which must be the same across validators), and this setting is stored as sawtooth.poet.target_wait_time. Other parts of the system use these settings similarly; for example, the list of enabled transaction families is used by the transaction processing platform.

This design supports two authorization options: 

1. a single authorized key which can make changes, and 
2. multiple authorized keys. In the case of multiple keys, a percentage of votes signed by the keys is required to make a change.

## IntegerKey Transaction Family Specification

The IntegerKey transaction family allows users to set, increment, and decrement the value of entries stored in a state dictionary.

An IntegerKey family transaction request is defined by the following values:

- A __verb__ which describes what action the transaction takes
- A __name__ of the entry that is to be set or changed
- A __value__ by which the entry will be set or changed

## XO Transaction Family Specification

The XO transaction family allows users to play a simple board game known variously as tic-tac-toe, noughts and crosses, and XO.

## Sawtooth Burrow-EVM Transaction Family Specification

The Sawtooth Burrow-EVM transaction family enables the creation and execution of smart contracts within the Hyperledger Sawtooth framework. It integrates the Hyperledger Burrow implementation of the Ethereum Virtual Machine (EVM) into the Hyperledger Sawtooth framework using the Sawtooth Go SDK.

The primary problems to solve in order to integrate the Burrow EVM into Sawtooth are:

1. Define and implement an efficient mapping between EVM World State addresses and Sawtooth Global State addresses.
2. Define and implement an efficient method for maintaining accounts and account storage in Sawtooth Global State.
3. Define and implement an “EVM-Wrapper” at the Transaction Processor level for handling additional “Ethereum-like” and “Burrow-like” features not implemented by the EVM, including:
 - Handling account creation transactions and storing the resulting code in global state.
 - Managing and enforcing account permissions.
 - Maintaining account balances and transferring funds between accounts.
 - Checking transaction nonces against account nonces and deriving new contract account addresses.
4. Define and implement an efficient API for:
 - Submitting transactions to the network that load and execute EVM byte code in a way that is compatible with existing tools.
 - Querying state using smart contracts without requiring that state be modified.
5. Define and implement an event subscription system for monitoring the EVM namespace that can be used with solidity events.

> Note:
> This is a proof of concept implementation that attempts to solve problems 1, 2, and part of 3. Later versions of the spec will include solutions to the remaining problems including optimizations, handling permissions, event subscription, and incentives.