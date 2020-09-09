import axios from 'axios'
import qs from 'qs';

let instance = axios.create({
    baseURL: 'https://tchopshop.weein.cn/busi',
    timeout: 30000,
    withCredentials:true
});

//配置http请求拦截
instance.interceptors.request.use(config => {
    config.headers.INFOINSIDE = localStorage.getItem('surUrl');
    return config
}, error => {
    return Promise.reject(error);
});

//封装请求
function getHttp(url, params) {
    return instance.get(url, {params})
}

function postHttp(url, params) {
    let newParams = qs.parse(qs.stringify(params));
    return instance.post(url, newParams)
}

function uploadImg(url, params) {
    let newParams = qs.stringify(params);
    return instance.post(url, newParams)
}

export { getHttp, postHttp,uploadImg }



