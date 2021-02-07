import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from '@/plugins/vuetify' // path to vuetify export
import axios from 'axios'
// import VueAxios from 'vue-axios'

Vue.config.productionTip = false;

window.axios=axios;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
