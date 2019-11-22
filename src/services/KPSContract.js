import Web3 from 'web3';
import { abi } from 'contracts/KPS.json';


class KPSContract {
  async initialise() {
    const provider = await this.getWeb3Provider();

    this.web3 = new Web3(provider);

    this.contract = await this.getContract();

    return this.web3.eth.getAccounts();
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
    return new this.web3.eth.Contract(abi, process.env.VUE_APP_CONTRACT_ADDRESS, { gas: 1000000 });
  }

  generateNonce() {
    return this.web3.utils.randomHex(32);
  }

  async startGame({ selection, nonce, gameStartedCallback, revealedCallback, account }) {
    const selectionHash = this.calculateSelectionHash(selection, nonce);
    const value = this.web3.utils.toWei('1', 'finney');

    const { events } = await this.contract.methods.startGame(selectionHash).send({ value, from: account });

    const { gameIdentifier } = events.PlayerAdded.returnValues;

    this.subscribe('GameStarted', { gameIdentifier }, gameStartedCallback);

    this.subscribe('Revealed', { gameIdentifier }, ({ returnValues }) => returnValues.addr !== account ? revealedCallback(this.convertSelection(returnValues)) : true);

    return gameIdentifier;
  }

  calculateSelectionHash(selection, nonce) {
    return this.web3.utils.soliditySha3(
      { type: 'uint256', value: nonce },
      { type: 'uint8', value: this.convertSelection({ str: selection }) }
    )
  }

  async reveal({ gameIdentifier, nonce, selection, account }) {
    const { events } = await this.contract.methods.reveal(gameIdentifier, nonce, this.convertSelection({ str: selection })).send({ from: account });
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

      if (!keepPolling && timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const intervalFunc = () => {
      this.contract.getPastEvents(eventName, { filter }, (err, [evt]) => evt ? timerClearingCallback(evt) : undefined);
    };

    timer = setInterval(intervalFunc, 1000);
  }
}

export default new KPSContract()
