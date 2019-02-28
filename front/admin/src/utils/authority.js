// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority () {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  return localStorage.getItem('antd-pro-authority') || 'guest'
}

export function setAuthority (authority, token) {
  localStorage.setItem('antd-pro-authority', authority)
  // if (authority === 'guest') {
  //   localStorage.removeItem('antd-pro-token')
  // } else {
  //   if (token) {
  //     localStorage.setItem('antd-pro-token', token)
  //   }
  // }
}
