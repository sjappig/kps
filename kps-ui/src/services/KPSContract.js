import Web3 from 'web3';
import { abi, address } from '../abi/kps';

class KPSContract {
  initialise() {
    this.web3 = new Web3(window.ethereum)
  }

  async select(selection, gameStartedCallback, gameEndedCallback) {
    // eslint-disable-next-line
    console.log(selection);
    const nonce = this.nonce;
    const selectionHash = this.calculateSelectionHash(selection, nonce);
    // eslint-disable-next-line
    console.log(selectionHash);
    this.contract.events.GameStarted({
      filter: { addr: this.walletAddress },
    }, (error, evt) => {
      const { gameIdentifier } = evt.returnValues;
      // eslint-disable-next-line
      console.log(gameIdentifier);
      const subscription = this.contract.events.Revealed({
        filter: { gameIdentifier },
      }, (error, evt) => {
        const { opponentResult } = evt.returnValues;
        gameEndedCallback(opponentResult);
      });
      gameStartedCallback(gameIdentifier, nonce, subscription);
    });
// eslint-disable-next-line
    console.log(await this.contract.methods.startGame(selectionHash).send({from: this.walletAddress, to: address, value: this.web3.utils.toWei('1', 'finney')}));
  }

  async reveal(gameIdentifier, nonce, selection) {
      return await this.contract.methods.reveal(gameIdentifier, nonce, this.toSelectionEnum(selection)).call();
  }

  get walletAddress() {
    return window.web3.eth.accounts[0];
  }

  get nonce() {
    return Math.floor(Math.random() * 1234567890);
  }

  get contract() {
      return new this.web3.eth.Contract(abi, address);
  }

  toSelectionEnum(selection) {
    const kpsMap = {
      rock: 1,
      paper: 2,
      scissors: 3
    }

    return kpsMap[selection];
  }

  calculateSelectionHash(selection, nonce) {
    return this.web3.utils.soliditySha3(
      { type: 'uint256', value: nonce },
      { type: 'address', value: this.walletAddress },
      { type: 'uint8', value: this.toSelectionEnum(selection) }
    )
  }
}

export default new KPSContract()
