import Web3 from 'web3';
import { abi } from 'contracts/KPS.json';

const contractAddress = '0x6924D2D3939fC772DC85Df084c74132c4996Ac08';

class KPSContract {
  initialise() {
    this.web3 = new Web3(window.ethereum);
  }

  async select(selection) {
    // eslint-disable-next-line
    console.log(selection);
    const nonce = this.nonce;
    const accounts = await this.accounts();
    const selectionHash = this.calculateSelectionHash(selection, nonce, accounts[0]);
    // eslint-disable-next-line
    console.log(selectionHash);
    // eslint-disable-next-line
    console.log(await this.contract.methods.startGame(selectionHash).send({from: accounts[0], to: contractAddress, value: this.web3.utils.toWei('1', 'finney')}));
  }

  async reveal(gameIdentifier, nonce, selection) {
    const accounts = await this.accounts();
    return await this.contract.methods.reveal(gameIdentifier, nonce, this.toSelectionEnum(selection)).send({from: accounts[0], to: contractAddress});
  }

  async accounts() {
    return this.web3.eth.getAccounts();
  }

  get nonce() {
    return Math.floor(Math.random() * 1234567890);
  }

  get contract() {
      return new this.web3.eth.Contract(abi, contractAddress);
  }

  toSelectionEnum(selection) {
    const kpsMap = {
      rock: 1,
      paper: 2,
      scissors: 3
    }

    return kpsMap[selection];
  }

  calculateSelectionHash(selection, nonce, address) {
    return this.web3.utils.soliditySha3(
      { type: 'uint256', value: nonce },
      { type: 'address', value: address },
      { type: 'uint8', value: this.toSelectionEnum(selection) }
    )
  }
}

export default new KPSContract()
