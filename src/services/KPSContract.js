import Web3 from 'web3';
import { abi } from 'contracts/KPS.json';

const contractAddress = '0xfcD80A0a3B682B84996e4BfcC07e39226b507FF0';

class KPSContract {
  async initialise() {
    const provider = await this.getWeb3Provider();

    this.web3 = new Web3(provider);
  }

  async getWeb3Provider() {
    const { VUE_APP_BLOCKCHAIN_HTTP_PROVIDER : httpProvider } = process.env;

    if (httpProvider) {
      return new Web3.providers.HttpProvider(httpProvider);
    }

    await window.ethereum.enable();

    return window.ethereum;
  }

  async startGame(selection, nonce) {
    // eslint-disable-next-line
    console.log(selection);
    const contract = await this.contract();
    const selectionHash = this.calculateSelectionHash(selection, nonce);
    // eslint-disable-next-line
    console.log(selectionHash);
    // eslint-disable-next-line
    console.log(await contract.methods.startGame(selectionHash).send({ value: this.web3.utils.toWei('1', 'finney') }));
  }

  async reveal(gameIdentifier, nonce, selection) {
    const contract = await this.contract();

    return await contract.methods.reveal(gameIdentifier, nonce, this.toSelectionEnum(selection)).send();
  }

  async accounts() {
    return this.web3.eth.getAccounts();
  }

  async contract() {
    const accounts = await this.accounts();

    return new this.web3.eth.Contract(abi, contractAddress, { from: accounts[0], gas: 1000000 });
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
      { type: 'uint8', value: this.toSelectionEnum(selection) }
    )
  }
}

export default new KPSContract()
