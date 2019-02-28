import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'

class ResumeBlock extends React.Component {
  static propTypes = {
    /**
     * 编辑状态变化事件
     */
    onToggleEdit: PropTypes.func.isRequired,

    /**
     * blocKName 表示是哪个分组
     * index 表示是分组内的并列数据的某一条
     */
    blockName: PropTypes.string.isRequired,
    index: PropTypes.any,

    /**
     * 原始数据，不可编辑，只用于显示。
     * 可编辑数据为this.state.editingData
     */
    data: PropTypes.object.isRequired,

    defaultEditing: PropTypes.bool

  }

  constructor (props) {
    super(props)
    this.state = {
      isEditing: typeof props.defaultEditing === 'boolean' ? props.defaultEditing : false,
      toggleEdit: this.toggleEdit,
      handleChange: this.handleChange,
      editingData: {}
    }
  }

  handleChange = (key, value) => {
    this.setState({
      editingData: {
        ...this.state.editingData,
        [key]: value
      }
    })
  }

  toggleEdit = () => {
    const nextState = {
      isEditing: !this.state.isEditing
    }
    if (nextState.isEditing) {
      nextState.editingData = Object.assign({}, this.props.data)
    }

    this.setState(nextState, () => {
      this.props.onToggleEdit({
        blockName: this.props.blockName,
        data: this.props.data,
        isEditing: this.state.isEditing,
        index: this.props.index
      })
    })
  }

  render () {
    const commonProps = {
      ...this.state,
      blockName: this.props.blockName,
      index: this.props.index,
      data: this.props.data
    }
    let Children = () => this.props.children(commonProps)
    if (this.state.isEditing) {
      Children = Form.create()(({ form }) => {
        return this.props.children({
          ...commonProps,
          form
        })
      })
    }

    return (
      <div style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        borderBottom: '1px solid #EEE'
      }}>
        <div style={{
          padding: '20px 0'
        }}>
          <Children />
        </div>
      </div>
    )
  }
}

export default ResumeBlock
