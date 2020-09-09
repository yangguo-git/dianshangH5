import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import './config/rem'
import { getHttp, postHttp,uploadImg} from './http/index'
import _ from 'lodash'
import VueCookies from 'vue-cookies'
import wx from 'weixin-js-sdk'
Vue.use(VueCookies)
//样式
import './assets/css/normalize.css'
//阿里
import './assets/iconfont/iconfont.css'
Vue.config.productionTip = false;

Vue.prototype.$get = getHttp;
Vue.prototype.$post = postHttp;
Vue.prototype.$postImg = uploadImg;
Vue.prototype.$lodash=_;
Vue.use(Vant);
let options = {
  fullscreenEl: false
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
