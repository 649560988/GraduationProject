import React, { Component } from 'react'

const { Provider, Consumer } = React.createContext({})

class Fullscreen extends Component {
  static Consumer = Consumer

  constructor (props) {
    super(props)

    this.state = {
      isFullscreen: this.isFullscreen(),
      open: this.open.bind(this),
      close: this.close.bind(this),
      toggle: this.toggle.bind(this)
    }
  }

  componentDidMount () {
    document.addEventListener('webkitfullscreenchange', this.handleChange, false)
  }

  componentWillUnmount () {
    document.removeEventListener('webkitfullscreenchange', this.handleChange, false)
  }

  handleChange = () => {
    this.setState({
      isFullscreen: this.isFullscreen()
    })
  }

  open () {
    if (this.state.isFullscreen) return
    this.setState({
      isFullscreen: true
    }, () => {
      document.documentElement.webkitRequestFullscreen()
    })
  }

  toggle () {
    if (this.state.isFullscreen) return this.close()
    this.open()
  }

  close () {
    if (!this.state.isFullscreen) return
    this.setState({
      isFullscreen: false
    }, () => {
      if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    })
  }

  isFullscreen () {
    return document.webkitFullscreenElement != null
  }

  render () {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    )
  }
}

export default Fullscreen
