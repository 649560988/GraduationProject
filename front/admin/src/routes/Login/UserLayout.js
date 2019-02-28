import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import { getRoutes, getPageQuery, getQueryPath } from '../../utils/utils';




class UserLayout extends React.PureComponent {


  render() {
    const { routerData, match } = this.props;
    return  getRoutes(match.path, routerData).map(item => (
        <Route
          key={item.key}
          path={item.path}
          component={item.component}
          exact={item.exact}
        />
      ))
  }
}

export default UserLayout;
