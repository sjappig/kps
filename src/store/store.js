import Vue from 'vue';
import Vuex from 'vuex';

import KPSContract from '@/services/KPSContract';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    nonce: null,
    gameIdentifier: null,
    selection: null,
    opponentSelection: null,
    hasOpponent: false,
    hasRevealed: false,
    result: null,
    account: null,
    allAccounts: []
  },
  mutations: {
    setNonce(state, nonce) {
      state.nonce = nonce;
    },

    setGameIdentifier(state, gameIdentifier) {
      state.gameIdentifier = gameIdentifier;
    },

    setSelection(state, selection) {
      state.selection = selection;
    },

    setOpponentSelection(state, opponentSelection) {
      state.opponentSelection = opponentSelection;
    },

    setHasOpponent(state, hasOpponent) {
      state.hasOpponent = hasOpponent;
    },

    setHasRevealed(state, hasRevealed) {
      state.hasRevealed = hasRevealed;
    },

    setAllAccounts(state, allAccounts) {
      state.allAccounts = allAccounts;
    },

    setAccount(state, account) {
      state.account = account;
    }
  },
  actions: {
    async initialise({ commit }) {
      const allAccounts = await KPSContract.initialise();

      commit('setAllAccounts', allAccounts);
      commit('setAccount', allAccounts[0]);
    },
    async getAccounts() {
      return KPSContract.getAccounts();
    },
    async select({ commit, state }, selection) {
      const { account } = state;
      const nonce = KPSContract.generateNonce();
      const gameStartedCallback = () => commit('setHasOpponent', true) && false;
      const revealedCallback = selection => commit('setOpponentSelection', selection) && false;
      const gameIdentifier = await KPSContract.startGame({
        selection,
        nonce,
        gameStartedCallback,
        revealedCallback,
        account
      });
      commit('setNonce', nonce);
      commit('setGameIdentifier', gameIdentifier);
      commit('setSelection', selection);
    },
    async reveal({ commit, state }) {
      const { gameIdentifier, nonce, selection, account } = state;
      await KPSContract.reveal({ gameIdentifier, nonce, selection, account});
      commit('setHasRevealed', true);
    }
  }
});
