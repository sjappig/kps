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
    }
  },
  actions: {
    async initialise() {
      await KPSContract.initialise();
    },
    async select({ commit }, selection) {
      const nonce = Math.floor(Math.random() * 1234567890);
      const gameIdentifier = await KPSContract.startGame(selection, nonce);
      commit('setNonce', nonce);
      commit('setGameIdentifier', gameIdentifier);
      commit('setSelection', selection);
    }
  }
});
