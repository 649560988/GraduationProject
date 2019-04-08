const config = {
 local: true, //是否为本地开发
  clientId: process.env.CLIENTID || 'choerodonparent', // 必须填入响应的客户端（本地开发）
  titlename: 'RentAndSell房屋出租出售信息发布系统', // 项目页面的title名称
  favicon: 'favicon.ico', //项目页面的icon图片名称
  cookieServer: '', //子域名token共享
 // server: 'http://api.zsmq.console.retailsolution.cn',
 server: 'http://localhost:8080',

  companyname: '上海汉得信息技术股份有限公司'
}

module.exports = process.env.NODE_ENV === 'production' ? Object.keys(config).reduce((all, key) => {
  all[key] = `===localhost.${key}===`
  return all
}, {}) : config
