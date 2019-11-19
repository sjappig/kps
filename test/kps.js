const KPS = artifacts.require('KPS');

contract('KPS', accounts => {
  const VALID_BET_VALUE = web3.utils.toWei('1', 'finney');

  const GAS_PRICE = 20000000000; // This is the default for truffle test network

  const SELECTION = {
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3,
  }

  function calculateHash(nonce, selection) {
    return web3.utils.soliditySha3(
      { type: 'uint256', value: nonce },
      { type: 'uint8', value: selection}
    );
  }

  async function createPlayers([selection0, selection1]) {
    const players = [
      { address: accounts[1], selection: selection0, nonce: 12345, expectedBalance: 0 },
      { address: accounts[2], selection: selection1, nonce: 67890, expectedBalance: 0 },
    ];
    for (const player of players) {
      player.expectedBalance = await web3.eth.getBalance(player.address);
    }
    return players;
  }

  it('should play full fair game', async () => {
    const instance = await KPS.deployed();
    const players = await createPlayers([SELECTION.ROCK, SELECTION.PAPER]);
    const expectedWinner = players[1];

    for (const player of players) {
      const hash = calculateHash(player.nonce, player.selection);
      const { receipt } = await instance.startGame(hash, { from: player.address, value: VALID_BET_VALUE });

      player.expectedBalance -= receipt.cumulativeGasUsed * GAS_PRICE;
    }

    const gameStartedEvents = await instance.getPastEvents('GameStarted');
    const gameIdentifier = gameStartedEvents[0].returnValues.gameIdentifier;

    for (const player of players) {
      const { receipt } = await instance.reveal(gameIdentifier, player.nonce, player.selection, { from: player.address });

      player.expectedBalance -= receipt.cumulativeGasUsed * GAS_PRICE;
    }

    for (const player of players) {
      const accountBalance = await web3.eth.getBalance(player.address);
      const expectedIncome = player === expectedWinner ? 1000000000000000 : -1000000000000000;

      assert.equal(accountBalance - player.expectedBalance, expectedIncome);
    }
  });
}); 
