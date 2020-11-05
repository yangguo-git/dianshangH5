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
function getRequest(url, params) {
    return instance.get(url, {params})
}

function postRequest(url, params) {
    let newParams = qs.parse(qs.stringify(params));
    return instance.post(url, newParams)
}

function uploadRequest(url, params) {
    let newParams = qs.stringify(params);
    return instance.post(url, newParams)
}

export { getRequest, postRequest,uploadRequest }



