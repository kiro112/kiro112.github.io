# Journal

The Journal is responsible for maintaining and extending the BlockChain for the validator. This responsibility involves validating candidate blocks, evaluating valid blocks to determine if they are the correct chain head, and generating new blocks to extend the chain.

![Journal Organization](http://kiro112.github.io/presentation/hyperledger/images/journal_organization.svg)

The Journal is the consumer of Blocks and Batches that arrive at the validator. These Blocks and Batches arrive via interconnect, either through the __gossip__ protocol or the __REST API__. The newly-arrived Blocks and Batches are sent to the Journal, which routes them internally.

The Journal divides up the processing of Blocks and Batches to different pipelines. Both objects are delivered initially to the Completer, which guarantees that all dependencies for the Blocks and Batches have been satisfied and delivered downstream. Completed Blocks are delivered to the Chain controller for validation and fork resolution. Completed Batches are delivered the BlockPublisher for validation and inclusion in a Block.

The Journal is designed to be asynchronous, allowing incoming blocks to be processed in parallel by the ChainController, as well as allowing the BlockPublisher to proceed with claiming blocks even when the incoming block rate is high.

It is also flexible enough to accept different consensus algorithms. The Journal implements a consensus interface that defines the entry points and responsibilities of a consensus algorithm.