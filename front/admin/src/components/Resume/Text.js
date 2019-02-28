import React from 'react'

class Text extends React.Component {
  render () {
    const {
      children,
      blockClassname = '',
      blockStyle = {
        minHeight: 26
      },
      ...restProps
    } = this.props
    if (!(typeof children === 'string')) return <div {...restProps} />
    if (!children) return ''
    const list = children.split(/\r?\n/)
    return (
      <div {...restProps}>
        {list.map((item, index) => {
          return (
            <div
              className={blockClassname}
              style={blockStyle}
              key={index}
            >{item}</div>
          )
        })}
      </div>
    )
  }
}

export default Text
