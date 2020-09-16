import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import wx from 'weixin-js-sdk'

Vue.use(VueRouter);

const Home = () => import('@/views/homes/home');
const Mine = () => import('@/views/mines/mine');
const Part = () => import('@/views/parts/part');
const ProductDetail = () => import('@/views/parts/productDetail');
const Searchpage = () => import('@/views/parts/searchpage');
const ConfirmOrder = () => import('@/views/parts/confirmOrder');
const EditAdress = () => import('@/views/parts/editAdress');
const LogisticDetail = () => import('@/views/mines/logisticDetail'); //物流详情
const AftersaleApply = () => import('@/views/mines/aftersaleApply'); //申请售后
const AllAdress = () => import('@/views/parts/allAdress'); //所有地址
const OrderDetail = () => import('@/views/mines/orderDetail'); //订单详情
const SingleAdress = () => import('@/views/parts/singleAdress');
// 订单不同状态
const AllOrder = () => import('@/views/mines/allorders'); //全部订单
const Refund = () => import('@/views/mines/refund'); //退款/售后
const WaitPay = () => import('@/views/mines/waitpay'); //待付款
const WaitReceive = () => import('@/views/mines/waitreceive'); //待收货
const Payorder = () => import('@/views/mines/payorder'); //支付
const Product = () => import('@/views/parts/product');

const routes = [{
		path: '/',
		redirect: '/ui/home'
	},
	{
		path: '/ui/home',
		name: 'home',
		component: Home
	},
	{
		path: '/ui/mine',
		name: 'mine',
		component: Mine
	}, {
		path: '/ui/part',
		name: 'part',
		component: Part
	},
	{
		path: '/ui/searchpage',
		name: 'searchpage',
		component: Searchpage
	},
	{
		path: '/ui/productdetail',
		name: 'productdetail',
		component: ProductDetail
	},
	{
		path: '/ui/confirmOrder',
		name: 'confirmOrder',
		component: ConfirmOrder
	},
	{
		path: '/ui/editAdress',
		name: 'editAdress',
		component: EditAdress
	},
	{
		path: '/ui/aftersaleapply',
		name: 'aftersaleapply',
		component: AftersaleApply
	},
	{
		path: '/ui/logisticdetail',
		name: 'logisticdetail',
		component: LogisticDetail
	},
	{
		path: '/ui/allAdress',
		name: 'allAdress',
		component: AllAdress
	},
	{
		path: '/ui/allOrder',
		name: 'allOrder',
		component: AllOrder
	},
	{
		path: '/ui/orderDetail',
		name: 'orderDetail',
		component: OrderDetail
	},
	{
		path: '/ui/singleadress',
		name: 'singleadress',
		component: SingleAdress
	},
	{
		path: '/ui/refund',
		name: 'refund',
		component: Refund
	},
	{
		path: '/ui/waitpay',
		name: 'waitpay',
		component: WaitPay
	},
	{
		path: '/ui/waitreceive',
		name: 'waitreceive',
		component: WaitReceive
	},
	{
		path: '/ui/payorder',
		name: 'payorder',
		component: Payorder
	},
	{
		path: '/ui/product',
		name: 'product',
		component: Product
	}
];

const router = new VueRouter({
	routes
});
router.beforeEach((to, from, next) => {
	 wx.hideOptionMenu();
	 next();
})
export default router
