import './polyfill'
import dva from 'dva'
import axios from 'axios'
import createHistory from 'history/createHashHistory'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
import router from './router'
import 'antd/dist/antd.css'
import './index.less'
import request from './utils/request'
import myrouter from './myrouter'

axios.defaults.baseURL = process.env.server
const app = dva({
  history: createHistory()
})
var oo=false;
// 2. Plugins
app.use(createLoading())

// 3. Register global model
app.model(require('./models/global').default)
app.model(require('./models/user').default)
app.model(require('./models/login').default)
app.model(require('./models/locale').default)
getCurrentUser()
function getCurrentUser(){
  console.log('进入函数')
  let url = '/v1/sysUserDomin/getAuth'
 request(url, {
      method: 'GET'
  }).then((res) => {
    if (res.message === '成功') {
      console.log('这是已经登陆')
      app.router(myrouter)
      app.start('#root')
    } 
    else 
    {
      console.log('没有登陆',res.data)
      app.router(router)
      app.start('#root')
    }
  }).catch(() => {
    app.router(router)
      app.start('#root')
    console.log('出错111')
  
  })
}

// 1. Initialize

// 4. Router
// app.router(router)
// app.start('#root')

// 5. Start

export default app._store; // eslint-disable-line
