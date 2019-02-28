import React from 'react'
import { Card, Tree, Layout } from 'antd'
import { gData } from './mock'

const { Content } = Layout
const { TreeNode } = Tree

class MenuManagement extends React.Component {
  state = {
    gData,
    expandedKeys: ['0-0', '0-0-0', '0-0-0-0']
  }

  onDragEnter = (info) => {
    console.log(info)
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  }

  onDrop = (info) => {
    console.log(info)
    const dropKey = info.node.props.eventKey
    const dragKey = info.dragNode.props.eventKey
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr)
        }
        if (item.children) {
          return loop(item.children, key, callback)
        }
      })
    }
    const data = [...this.state.gData]
    let dragObj
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })
    if (info.dropToGap) {
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj)
      })
    }
    this.setState({
      gData: data
    })
  }

  render () {
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>
      }
      return <TreeNode key={item.key} title={item.title} />
    })
    return (
      <Content style={{ backgroundColor: '#F5F5F5' }}>
        <Card style={{ marginBottom: 20 }}>
          <h1>权限配置</h1>
        </Card>
        <Card>
          <Tree
            checkable
            className='draggable-tree'
            defaultExpandedKeys={this.state.expandedKeys}
            draggable
            onDragEnter={this.onDragEnter}
            onDrop={this.onDrop}
          >
            {loop(this.state.gData)}
          </Tree>
        </Card>
      </Content>
    )
  }
}

export default MenuManagement
