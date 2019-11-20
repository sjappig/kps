import Vue from 'vue';
import VueRouter from 'vue-router';

import App from '@/App';
import SelectionView from '@/views/SelectionView'
import { store } from '@/store/store';

Vue.use(VueRouter);
Vue.config.productionTip = false;

const router = new VueRouter({
  routes: [
    { path: '/selection', name: 'Selection', component: SelectionView, alias: '/' }
  ]
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
