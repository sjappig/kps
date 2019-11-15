const KPS = artifacts.require('KPS');

contract('KPS', accounts => {
  function calculateHash(nonce, addr, selection) {
    return web3.utils.soliditySha3(
      { type: 'uint256', value: nonce },
      { type: 'address', value: addr },
      { type: 'uint8', value: selection}
    );
  }

  const validBetValue = web3.utils.toWei('1', 'finney');

  const gasPrice = 20000000000; // This is the default for truffle develop network

  it('should play full fair game', async () => {
    const instance = await KPS.deployed();
    const hash1 = calculateHash(12345, accounts[0], 1);
    const hash2 = calculateHash(67890, accounts[1], 2);
    let estimatedBalance1 = await web3.eth.getBalance(accounts[0]);
    let estimatedBalance2 = await web3.eth.getBalance(accounts[1]);

    let transaction = await instance.startGame(hash1, { from: accounts[0], value: validBetValue });
    estimatedBalance1 -= (transaction.receipt.cumulativeGasUsed * gasPrice);
    transaction = await instance.startGame(hash2, { from: accounts[1], value: validBetValue });
    estimatedBalance2 -= (transaction.receipt.cumulativeGasUsed * gasPrice);

    transaction = await instance.reveal(1, 12345, 1, { from: accounts[0] });
    estimatedBalance1 -= (transaction.receipt.cumulativeGasUsed * gasPrice);
    transaction = await instance.reveal(1, 67890, 2, { from: accounts[1] });
    estimatedBalance2 -= (transaction.receipt.cumulativeGasUsed * gasPrice);

    console.log((await web3.eth.getBalance(accounts[0])) - estimatedBalance1)
    console.log((await web3.eth.getBalance(accounts[1])) - estimatedBalance2)
  });
}); 
