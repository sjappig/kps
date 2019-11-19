import Web3 from 'web3';
import { abi } from 'contracts/KPS.json';

const contractAddress = '0xCfB3076E9008E812867B3C7AB300B8011AED6DF5';

class KPSContract {
  initialise() {
    const provider = (
      process.env.VUE_APP_BLOCKCHAIN_MODE === 'local' ?
      new Web3.providers.HttpProvider('http://127.0.0.1:7545') :
      window.ethereum
    );
    this.web3 = new Web3(provider);
  }

  async select(selection) {
    // eslint-disable-next-line
    console.log(selection);
    const nonce = this.nonce;
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

  get nonce() {
    return Math.floor(Math.random() * 1234567890);
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
