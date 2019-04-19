import React ,{Fragment} from 'react'
import { routerRedux, Route, Switch } from 'dva/router'
import { LocaleProvider } from './LocaleProvider'
import { getRouterData } from './common/router'
import Authorized from './utils/Authorized'
import { getQueryPath } from './utils/utils'
import Fullscreen from './components/Fullscreen'
// import { Fragment } from 'react';
const { ConnectedRouter } = routerRedux
const { AuthorizedRoute } = Authorized
function RouterConfig ({ history, app }) {
  console.log('这是router')
  const routerData = getRouterData(app)
  const UserLayout = routerData['/user'].component
  const BasicLayout = routerData['/'].component
  const RentHouse=routerData['/renthouse'].component
  const MyHome=routerData['/myhome'].component
  const MyBuilding=routerData['/building'].component
  const MyArticle=routerData['/article'].component
  return <LocaleProvider>
      <Fullscreen>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/auth' component={require('./routes/User/Auth').default} />
            <Route path='/user' component={UserLayout} />
            <Route path='/exception' component={BasicLayout} />
            <Route path='/myhome' component={MyHome}/>    
            <Route path='/renthouse' component={RentHouse}/>
            <Route path='/building' component={MyBuilding}/>
            <Route path='/article' component={MyArticle}/> 
            
            {/* <Route path='/menu-management' component={require('./routes/MenuManagement').default} /> */}
            <AuthorizedRoute
              path='/'
              render={props => <BasicLayout {...props} />}
              authority={['admin', 'user']}
              redirectPath={getQueryPath('/user/login', {
                redirect: window.location.href
              })}
            />
          </Switch>
        </ConnectedRouter>
      </Fullscreen>
    </LocaleProvider>
  
}

export default RouterConfig
// const Data = {}
// Data.RouterConfig= RouterConfig({})
// export default Data