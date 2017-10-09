# Validator Network

The network layer is responsible for communication between validators in a Sawtooth network, including performing initial connectivity, peer discovery, and message handling. Upon startup, validator instances begin listening on a specified interface and port for incoming connections. Upon connection and peering, validators exchange messages with each other based on the rules of a gossip or epidemic protocol.

A primary design goal is to keep the network layer as self-contained as possible.

## Services

The choice of 0MQ provides considerable flexibility in both available connectivity patterns and the underlying capabilities of the transport layer (IPv4, IPv6, etc.)

We have adopted the 0MQ Asynchronous Client/Server Pattern which consists of a 0MQ ROUTER socket on the server side which listens on a provided endpoint, with a number of connected 0MQ DEALER sockets as the connected clients. The 0MQ guide describes the features of this pattern as follows:
- Clients connect to the server and send requests.
- For each request, the server sends 0 or more replies.
- Clients can send multiple requests without waiting for a reply.
- Servers can send multiple replies without waiting for new requests.

![Validator Network Img](http://kiro112.github.io/presentation/hyperledger/images/multiple_dealer_to_router.svg)

## States

We define three states related to the connection between any two validator nodes:

- __Unconnected__
- __Connected__ - A connection is a required prerequisite for peering.
- __Peered__ - A bidirectional relationship that forms the base case for application level message passing (gossip).


## Wire Protocol

We have standardized on protobuf serialization for any structured messages that need to be passed over the network. All payloads to or from the application layer are treated as opaque.

## Peer Discovery

A bidirectional peering via a neighbor of neighbors approach gives reliable connectivity (messages delivered to all nodes >99% of the time based on random construction of the network).

Peer connections are established by collecting a suitable population of candidate peers through successive CONNECT/GET_PEERS calls (neighbors of neighbors). The connecting validator then selects a candidate peer randomly from the list and attempts to connect and peer with it. If this succeeds, and the connecting validator has reached minimum connectivity, the process halts. If minimum connectivity has not yet been reached, the validator continues attempting to connect to new candidate peers, refreshing its view of the neighbors of neighbors if it exhausts candidates.

![Bilateral Peering](http://kiro112.github.io/presentation/hyperledger/images/bidirectional_peering.png)

The network component continues to perform a peer search if its number of peers is less than the minimum connectivity. The network component rejects peering attempts if its number of peers is equal to or greater than the maximum connectivity. Even if maximum peer connections is reached, a network service should still accept and respond to a reasonable number of connections (for the purposes of other node topology build outs, etc.)

## Related Components
![Related Components](http://kiro112.github.io/presentation/hyperledger/images/related_components.svg)


## Message Delivery

The network delivers application messages (payloads received via BROADCAST or SEND) to the application layer. The network also performs a basic validation of messages prior to forwarding by calling a handler in the Message Validation component.

When the network receives a REQUEST message, it calls a provided handler (a “Responder”, for example) to determine if the request can be satisfied. If so, the expectation is that the application layer generates a SEND message with a response that satisfies the request. In this condition, the network layer does not continue to propagate the REQUEST message to the network.

In the case where a node could not satisfy the request, the node stores who it received the request from and BROADCASTs the request on to its peers. If that node receives a SEND message with the response to the request, it forwards the SEND message back to the original requester.

The network accepts application payloads for BROADCAST, SEND, and REQUEST from the application layer.

## Network Layer Security

0MQ includes a TLS like certificate exchange mechanism and protocol encryption capability which is transparent to the socket implementation. Support for socket level encryption is currently implemented with hardcoded server keys, to avoid needing separate identities for each validator’s server socket. This is appropriate for a public network. For each client, ephemeral certificates are generated on connect.