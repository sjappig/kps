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
    result: null
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
    }
  },
  actions: {
    async initialise() {
      await KPSContract.initialise();
    },
    async select({ commit }, selection) {
      const nonce = KPSContract.generateNonce();
      const gameStartedCallback = () => commit('setHasOpponent', true);
      const revealedCallback = selection => commit('setOpponentSelection', selection);
      const gameIdentifier = await KPSContract.startGame({
        selection,
        nonce,
        gameStartedCallback,
        revealedCallback
      });
      commit('setNonce', nonce);
      commit('setGameIdentifier', gameIdentifier);
      commit('setSelection', selection);
    },
    async reveal({ commit, state }) {
      await KPSContract.reveal(state.gameIdentifier, state.nonce, state.selection);
      commit('setHasRevealed', true);
    }
  }
});
