# Journal

The Journal is responsible for maintaining and extending the BlockChain for the validator. This responsibility involves validating candidate blocks, evaluating valid blocks to determine if they are the correct chain head, and generating new blocks to extend the chain.

![Journal Organization](http://kiro112.github.io/presentation/hyperledger/images/journal_organization.svg)

The Journal is the consumer of Blocks and Batches that arrive at the validator. These Blocks and Batches arrive via interconnect, either through the __gossip__ protocol or the __REST API__. The newly-arrived Blocks and Batches are sent to the Journal, which routes them internally.

The Journal divides up the processing of Blocks and Batches to different pipelines. Both objects are delivered initially to the __Completer__, which guarantees that all dependencies for the Blocks and Batches have been satisfied and delivered downstream. Completed Blocks are delivered to the __Chain controller__ for validation and fork resolution. Completed Batches are delivered the __BlockPublisher__ for validation and inclusion in a Block.

The Journal is designed to be asynchronous, allowing incoming blocks to be processed in parallel by the ChainController, as well as allowing the BlockPublisher to proceed with claiming blocks even when the incoming block rate is high.

It is also flexible enough to accept different consensus algorithms. The Journal implements a consensus interface that defines the entry points and responsibilities of a consensus algorithm.


## The BlockStore

The BlockStore contains all the blocks in the current block chain, that is the list of blocks from the current chain head back to the Genesis blocks.


## The BlockCache

The Block Cache holds the working set of blocks for the validator and tracks the processing state. This processing state is tracked as valid, invalid, or unknown. Valid blocks are blocks that have been proven to be valid by the ChainController. Invalid blocks are blocks that failed validation or have an invalid block as a predecessor. Unknown are blocks that have not yet completed validation, usually having just arrived from the Completer.

The BlockCache is an in-memory construct. It is rebuilt by demand when the system is started.


## The Completer

The Completer is responsible for making sure Blocks and Batches are complete before they are delivered. Blocks are considered formally complete once all of their predecessors have been delivered to the ChainController and their batches field contains all the Batches specified in the BlockHeader’s batch_ids list.


## The ChainController

The ChainController is responsible for determining which chain the validator is currently on and coordinating any change-of-chain activities that need to happen. Currently the only listener for chain updates is the BlockPublisher, so that it can build a new candidate block on the new chain head.

#### Basic flow of the ChainController as a single block is processed
![Journal Chain Control Flow](http://kiro112.github.io/presentation/hyperledger/images/journal_chain_controller.svg)
