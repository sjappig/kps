import Web3 from 'web3';
import { abi } from 'contracts/KPS.json';


class KPSContract {
  async initialise() {
    const provider = await this.getWeb3Provider();

    this.web3 = new Web3(provider);

    this.contract = await this.getContract();
  }

  async getWeb3Provider() {
    const { VUE_APP_BLOCKCHAIN_HTTP_PROVIDER : httpProvider } = process.env;

    if (httpProvider) {
      return new Web3.providers.HttpProvider(httpProvider);
    }

    await window.ethereum.enable();

    return window.ethereum;
  }

  async getContract() {
    const accounts = await this.web3.eth.getAccounts();

    return new this.web3.eth.Contract(abi, process.env.VUE_APP_CONTRACT_ADDRESS, { from: accounts[0], gas: 1000000 });
  }

  async startGame(selection, nonce) {
    const selectionHash = this.calculateSelectionHash(selection, nonce);
    // eslint-disable-next-line
    console.log(await this.contract.methods.startGame(selectionHash).send({ value: this.web3.utils.toWei('1', 'finney') }));
  }

  calculateSelectionHash(selection, nonce) {
    return this.web3.utils.soliditySha3(
      { type: 'uint256', value: nonce },
      { type: 'uint8', value: this.toSelectionEnum(selection) }
    )
  }

  async reveal(gameIdentifier, nonce, selection) {
    return await this.contract.methods.reveal(gameIdentifier, nonce, this.toSelectionEnum(selection)).send();
  }


  toSelectionEnum(selection) {
    const kpsMap = {
      rock: 1,
      paper: 2,
      scissors: 3
    }

    return kpsMap[selection];
  }
}

export default new KPSContract()
