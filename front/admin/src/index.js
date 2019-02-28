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

axios.defaults.baseURL = process.env.server

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
app.router(router)

// 5. Start
app.start('#root')

export default app._store; // eslint-disable-line
