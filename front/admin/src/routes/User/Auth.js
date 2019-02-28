import React from 'react'
import qs from 'querystring'
import { Spin } from 'antd'
import axios from 'axios'
import { connect } from 'dva'
import request from '../../utils/request'

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('antd-pro-token')}`
request.token = localStorage.getItem('antd-pro-token')

export default @connect(({ login }) => ({
  login
}))
class Auth extends React.Component {
  state = {
    logged: false,
    search: {}
  }
  componentDidMount () {
    const { location } = this.props
    const search = qs.parse(location.search.substr(1))
    const { access_token: accessToken, token_type: tokenType } = search
    if (!accessToken) {
      return this.setState({
        error: new Error('登录失败')
      })
    }

    localStorage.setItem('antd-pro-token', accessToken)
    axios.defaults.headers.common['Authorization'] = `${tokenType === 'bearer' ? 'Bearer' : tokenType} ${accessToken}`
    request.token = accessToken
    this.props.dispatch({
      type: 'login/login',
      payload: {
        token: accessToken,
        redirect: '/'
      }
    })
  }

  render () {
    if (this.state.error) {
      return (
        <div>{this.state.error.message}</div>
      )
    }
    return (
      <Spin />
    )
  }
}
