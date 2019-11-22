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
    const [ account ] = await this.web3.eth.getAccounts();

    return new this.web3.eth.Contract(abi, process.env.VUE_APP_CONTRACT_ADDRESS, { from: account, gas: 1000000 });
  }

  generateNonce() {
    return this.web3.utils.randomHex(32);
  }

  async startGame({selection, nonce, gameStartedCallback, revealedCallback}) {
    const selectionHash = this.calculateSelectionHash(selection, nonce);
    const value = this.web3.utils.toWei('1', 'finney');

    const { events } = await this.contract.methods.startGame(selectionHash).send({ value });

    const { gameIdentifier } = events.PlayerAdded.returnValues;

    this.subscribe('GameStarted', { gameIdentifier }, gameStartedCallback);

    this.subscribe('Revealed', { gameIdentifier }, ({ returnValues }) => revealedCallback(this.convertSelection(returnValues)));

    return gameIdentifier;
  }

  calculateSelectionHash(selection, nonce) {
    return this.web3.utils.soliditySha3(
      { type: 'uint256', value: nonce },
      { type: 'uint8', value: this.convertSelection({ str: selection }) }
    )
  }

  async reveal(gameIdentifier, nonce, selection) {
    const { events } = await this.contract.methods.reveal(gameIdentifier, nonce, this.convertSelection({ str: selection })).send();
    // eslint-disable-next-line
    console.log(events);
  }

  convertSelection({ str, selection }) {
    const kpsMap = {
      rock: 1,
      paper: 2,
      scissors: 3
    }

    if (str !== undefined) {
      return kpsMap[str];
    }

    for (const key in kpsMap) {
      // loose equality used deliberately
      if (kpsMap[key] == selection) {
        return key;
      }
    }
  }

  subscribe(eventName, filter, callback) {
    let timer = null;

    const timerClearingCallback = evt => {
      const keepPolling = callback(evt);

      if (!keepPolling & timer) {
        clearInterval(timer);
      }
    };

    const intervalFunc = () => {
      this.contract.getPastEvents(eventName, { filter }, (err, [evt]) => evt ? timerClearingCallback(evt) : undefined);
    };

    timer = setInterval(intervalFunc, 1000);
  }
}

export default new KPSContract()
