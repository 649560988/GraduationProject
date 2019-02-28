// 业绩管理

import React from 'react'
import { Switch, Route } from 'dva/router'

export default class Performance extends React.Component {
  render () {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.path}`} exact component={require('./List').default} />
        <Route path={`${match.path}/add`} exact component={require('./Add').default} />
      </Switch>
    )
  }
}
