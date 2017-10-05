# Global State

One goal of a distributed ledger like Sawtooth, indeed the defining goal, is to distribute a ledger among participating nodes. 
*The ability to ensure a consistent copy of data amongst nodes in Byzantine consensus is one of the core strengths of blockchain technology.*

Sawtooth represents state for all transaction families in a single instance of a *Radix Merkle Tree* on each validator. The process of block validation on each validator ensures that the same transactions result in the same state transitions and that the resulting data is the same for all participants in the network.

The state is split into namespaces which allow flexibility for transaction family authors to define, share, and reuse global state data between transaction processors.