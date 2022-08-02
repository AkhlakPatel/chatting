import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Parse from 'parse/dist/parse.min.js';

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = '7jOylnKjNew2fhToxAJRtu5Of4by6H49HXmFZ14b';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'uIvl4BATgFbKfM3Euf6B8YRnobYWjmcY3N2N2YBJ';
const PARSE_LIVE_QUERY_URL = "https://testlivechat.b4a.io";

Parse.initialize(PARSE_LIVE_QUERY_URL, PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
