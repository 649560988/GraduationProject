import './polyfill'
import dva from 'dva'
import axios from 'axios'
import createHistory from 'history/createHashHistory'
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
import router from './router'
import 'antd/dist/antd.css'
import './index.less'
import request from './utils/request'
import myrouter from './myrouter'

axios.defaults.baseURL = process.env.server

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
    console.log('出错')
    // app.router(router)
    // app.start('#root')
  })
}
getCurrentUser()
// function getCurrentUser  (){
//   console.log('进入函数')
//   let url = '/v1/sysUserDomin/getAuth'
//   axios({
//     method: 'get',
//     url: url,
//   }).then((res)=>{
//     if (res.message === '成功') {
//       console.log('这是已经登陆')
//       app.router(myrouter)
//       app.start('#root')
//     } 
//     else 
//     {
//       console.log('没有登陆',res.data)
//       app.router(router)
//       app.start('#root')
//     }
//   }).catch((e) => {
//     console.log('出错',e)
//     app.router(router)
//         app.start('#root')
//   })

//  request(url, {
//       method: 'GET'
//   }).then((res) => {
    
//   })
// }

// 1. Initialize
const app = dva({
  history: createHistory()
})

// 2. Plugins
app.use(createLoading())

// 3. Register global model
app.model(require('./models/global').default)
app.model(require('./models/user').default)
app.model(require('./models/login').default)
app.model(require('./models/locale').default)

// 4. Router


// 5. Start

export default app._store; // eslint-disable-line
