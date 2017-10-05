# Consensus

Consensus is the process of building agreement among a group of mutually distrusting participants. 

## Approach proposed

The first, often referred to as __Nakamoto consensus__, elects a leader through some form of “lottery”. The leader then proposes a block that can be added to a chain of previously committed blocks. In Bitcoin, the first participant to successfully solve a cryptographic puzzle wins the leader-election lottery. The elected leader broadcasts the new block to the rest of the participants who implicitly vote to accept the block by adding the block to a chain of accepted blocks and proposing subsequent transaction blocks that build on that chain.

The second approach is based on traditional __Byzantine Fault Tolerance (BFT)__ algorithms and uses multiple rounds of explicit votes to achieve consensus. Ripple and Stellar developed consensus protocols that extend traditional BFT for open participation. Ripple and Stellar developed consensus protocols that extend traditional BFT for open participation.

Sawtooth abstracts the core concepts of consensus and isolates consensus from transaction semantics. The interface supports plugging in various consensus implementations. Sawtooth provides two such implementations: 

- __dev_mode__ - a simplified random leader algorithm that is useful for developers and test networks that require only crash fault tolerance.
- __Proof of Elapsed Time (PoET)__ - is a Nakamoto-style consensus algorithm. It is designed to be a production-grade protocol capable of supporting large network populations.