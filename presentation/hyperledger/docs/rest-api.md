# REST API

Hyperledger Sawtooth provides a pragmatic RESTish API for clients to interact with a validator using common HTTP/JSON standards. It is an entirely separate process, which once running, allows transactions to be submitted and blocks to be read with a common language-neutral interface.

the REST API treats the validator mostly as a black box, submitting transactions and fetching the results. It is not the tool for all validator communication. 