module.exports = {
    // 将baseUrl: '/api',改为baseUrl: '/',
    publicPath:'./',
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 100, // 换算的基数
                        selectorBlackList: ['van'], // 忽略转换正则匹配项
                        propList: ['*'],
                    }),
                ]
            }
        }
    },
    lintOnSave: false
};
