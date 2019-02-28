import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Authorized from './Authorized'

class AuthorizedRoute extends React.Component {
  renderRedirect = () => {
    const { redirectPath } = this.props
    if (redirectPath.indexOf('http') === 0) {
      window.location.href = redirectPath
    } else {
      return <Redirect to={{ pathname: redirectPath }} />
    }
  }

  render () {
    const { component: Component, render, authority, redirectPath, ...rest } = this.props
    return (
      <Authorized
        authority={authority}
        noMatch={<Route {...rest} render={this.renderRedirect} />}
      >
        <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
      </Authorized>
    )
  }
}

export default AuthorizedRoute
