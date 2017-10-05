# Proof of Elapsed Time (PoET)

For the purpose of achieving distributed consensus efficiently, a good lottery function has several characteristics:

- __Fairness__: The function should distribute leader election across the broadest possible population of participants.
- __Investment__: The cost of controlling the leader election process should be proportional to the value gained from it.
- __Verification__: It should be relatively simple for all participants to verify that the leader was legitimately selected.

PoET is designed to achieve these goals using new secure CPU instructions which are becoming widely available in consumer and enterprise processors. PoET uses these features to ensure the safety and randomness of the leader election process without requiring the costly investment of power and specialized hardware inherent in most “proof” algorithms.