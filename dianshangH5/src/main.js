import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import './config/rem'
import { getRequest, postRequest,uploadRequest} from './http/index'
import _ from 'lodash'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
//样式
import './assets/css/normalize.css'
//阿里
import './assets/iconfont/iconfont.css'
Vue.config.productionTip = false;

Vue.prototype.$get = getRequest;
Vue.prototype.$post = postRequest;
Vue.prototype.$postImg = uploadRequest;//设置不同的content-type
Vue.prototype.$lodash=_;
Vue.use(Vant);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
