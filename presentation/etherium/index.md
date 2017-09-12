How to setup Ethereum Test

Create a genesis.json
```
{
    "config": {
        "chainId": 15,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
    "difficulty": "0x400",
    "gasLimit": "0x2100000",
    "alloc": {
        "93f932b3b87e08cdaf0877994e44feb4c93e81aa": { "balance": "0x1337000000000000000000" }     
    }
}
```

create your custom directory (I use ~/ethereum as my custom dir), this will serve as the directory for databases and keystore

initialize your genesis file
`geth --identity "MyEth" --nodiscover --networkid 1999 --datadir "~/ethereum/" init ~/ethereum/genesis.json`

> --identity - Custom node name
> -- nodiscover - Disables the peer discovery mechanism (manual peer addition)
> --networkid - Network identifier
> --datadir - Data directory for the databases and keystore


lets run geth console
geth --identity "MyEth" --nodiscover --networkid 1999 --datadir "~/ethereum/" console

Create your first account
`personal.newAccount()`
this will ask you for your passphrase.


Let start Mining!
miner.start(); // lets earn ether
miner.stop();  // lets stop the miner ~!

lets check how many etherium we earn
`web3.fromWei(eth.getBalance(eth.coinbase), "ether")`

Add new account
`personal.newAccount()`

set the second account as the collector of the reward
miner.setEtherbase(eth.accounts[1]);

the second account/eth.accounts[1] will receive the ethereum
lets start the mining!
miner.start();
miner.stop();

Check the of the second account if it earns some ethereum
`web3.fromWei(eth.getBalance(eth.accounts[1]), "ether")`


How Transfer ethereum?
first we need to unlock the account who gonna send the etherium
`personal.unlockAccount("<Account number>");` e.g. `personal.unlockAccount(eth.accounts[0])`;
and enter the passphrase

then create a send transaction
(in this example we are transfering the amount 100 from account1 to account2)
eth.sendTransaction({
	from: eth.account[0],
	to: eth.account[1],
	amount: web3.toWei(100, "ether")
});

> web3.toWei(100, "ether")
this will convert the ether to wei
What is wei ? `wei is like an etherium currency`

the transaction will be added to the pending transactions
`eth.pendingTransactions` if there are no running miner to process it.

we need to start a miner to process it.
`miner.start()`

after a few sec close it
`miner.close()` 

check if the transaction is still pending
`eth.pendingTransactions` if it returns `[]`
then the transaction has been processed.

if you check the accounts balance
you will see that the account1 has been reduced by 100
and the account 2 has been added by 100

(Note the account is also earning because if miner.start())




`SOLIDITY`

installation

lets install the solidity CLI via NPM
`npm install -g solc`

[Solidity installation](http://solidity.readthedocs.io/en/develop/installing-solidity.html)
