import React from 'react'
import { Tree, Button, Input, Modal } from 'antd'
import TableLayout from '../../layouts/TableLayout'
import axios from 'axios'
import { connect } from 'dva'
import { FormattedMessage } from 'react-intl'


const TreeNode = Tree.TreeNode
const Search = Input.Search
/***
 *保存成功弹窗
 */
function success () {
  const modal = Modal.success({
    title: '保存成功',
    content: '保存成功'
  })
  setTimeout(() => modal.destroy(), 1000)
}
/***
 *保存失败弹窗
 */
function error (msg) {
  Modal.error({
    title: '保存失败',
    content: msg
  })
}
@connect(({ user }) => ({
  user: user
}))
class TenantPermissionUpdate extends React.Component {
  state = {
    searchValue: '',
    id: 0, // 租户id
    data: [], // 菜单和权限，有父级和子级
    allData: [], // 菜单和权限，无父级和子级
    oldPermissionIds: [], // 原来的权限id
    allPermissionIds: [], // 所有的权限id
    autoExpandParent: true, // 自动展开
    expandedKeys: [], // 自动展开的字段
    checkedKeys: [], // 选中的菜单和权限
    checkedKeysId: []// 选中的没有菜单的权限的id
  };

  componentWillMount = () => {
    this.setState({
      id: this.props.match.params.id
    })
  }
  componentDidMount = () => {
    // console.log(this.props.user.currentUser.organizationId)
    let isadmin = this.props.user.currentUser.admin
    if (isadmin === true) {
      this.selectMenu()
    }
  }

  /***
   * 根据id查询租户菜单
   */
  selectMenu = () => {
    // let url = '/iam-ext/v1/menus/org?id='
    // url += this.props.user.currentUser.organizationId
    let url = '/iam-ext/v1/menus/queryAllMenu'
    axios({
      method: 'get',
      url: url
    }).then((res) => {
      this.getMenuContent(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   * 获取菜单和权限
   */
  getMenuContent = (result) => {
    let datas = []
    let allDatas = []
    let permissionIds = []
    if (result !== undefined && result !== null) {
      result.forEach((fatherMenu) => {
        // 父菜单
        let father = {}
        let son = []
        father.title = fatherMenu.name
        father.key = fatherMenu.code
        allDatas.push(father)
        if (fatherMenu.subMenus !== undefined && fatherMenu.subMenus !== null) {
          fatherMenu.subMenus.forEach((sonMenu) => {
            // 子菜单
            let child = {}
            let grandson = []
            child.title = sonMenu.name
            child.key = sonMenu.code // child.key = fatherMenu.code + sonMenu.code
            allDatas.push(child)
            if (sonMenu.permissions !== undefined || sonMenu.permissions !== null) {
              sonMenu.permissions.forEach((permissionList) => {
                // 孙权限
                let childd = {}
                childd.title = permissionList.code
                childd.key = permissionList.code // childd.key = child.key + permissionList.code
                childd.description = permissionList.description // 描述
                allDatas.push(childd)
                permissionIds.push(permissionList.id)
                grandson.push(childd)
              })
            }
            child.children = grandson
            son.push(child)
          })
        }
        father.children = son
        datas.push(father)
      })
    }
    console.log(allDatas)
    console.log(datas)
    // 将datas 添加到state中
    this.setState({
      data: datas,
      allData: allDatas,
      allPermissionIds: permissionIds
    }, () => {
      this.selectUserMenu()
    })
  }

  /***
   * 根据id查询租户权限
   */
  selectUserMenu = () => {
    axios({
      method: 'get',
      url: '/organizationManager/v1/IamPermissionOrganization/' + this.state.id
    }).then((res) => {
      // console.log(res.data)
      this.setMenuContent(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   * 根据对应的权限判断是否选中
   */
  setMenuContent = (result) => {
    // console.log(this.state.allPermissionIds)
    // console.log(result)
    let check = []
    let permissionid = []
    if (result !== undefined || result !== null) {
      result.forEach((value) => {
        permissionid.push(value.permission.id)
        // console.log(value.permission.id)
        // console.log(this.state.allPermissionIds.indexOf(value.permission.id))
        if (this.state.allPermissionIds.indexOf(value.permission.id) >= 0) {
          // console.log('************************' + value.permission.code)
          check.push(value.permission.code)
        }
      })
    }
    this.setState({
      expandedKeys: check,
      checkedKeys: check,
      oldPermissionIds: permissionid
    })
  }

  getParentKey = (key, tree) => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }

  /***
   * 保存选中的权限
   */
  handleSave = () => {
    let checkedKeysId = []
    // 通过key反查id
    axios({
      method: 'post',
      url: '/iam-ext/v1/permissions/codes',
      data: this.state.checkedKeys
    }).then((res) => {
      if (res.data.length > 0) {
        res.data.forEach((value) => {
          console.log(value.id)
          checkedKeysId.push(value.id)
        })
        this.setState({
          checkedKeysId: checkedKeysId
        }, () => {
          let datas = {}
          datas.formerPermissions = this.state.oldPermissionIds // 原来的所有的
          datas.currentPermissions = this.state.checkedKeysId // 现在选中的
          console.log(datas)
          axios({
            method: 'post',
            url: '/organizationManager/v1/IamPermissionOrganization/modify/' + this.state.id,
            data: datas
          }).then((res) => {
            console.log(res.data)
            if (res.data.failed === true) {
              error(res.data.message)
            } else {
              this.setState({
                oldPermissionIds: checkedKeysId
              })
              success()
            }
          }).catch((err) => {
            console.log(err)
          })
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  /***
   * 返回上一个页面
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/setting/tenantpermission`)
  }

  /***
  *   路径跳转
  */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys)
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys)
    this.setState({ checkedKeys })
  }

  onChange = (e) => {
    const value = e.target.value
    const expandedKeys = this.state.allData.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return this.getParentKey(item.key, this.state.data)
      }
      return null
    }).filter((item, i, self) => item && self.indexOf(item) === i)
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    })
  }

  render () {
    const { searchValue, expandedKeys, autoExpandParent } = this.state
    const loop = data => data.map((item) => {
      // console.log(item)
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span title={item.description===null?"暂无描述":item.description}>
          {beforeStr}
          <span style={{ color: '#f50' }} >{searchValue}</span>
          {afterStr}
        </span>
      ) : <span title={item.description===null?"暂无描述":item.description}>{item.title}</span>
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} title={title} />
    })
    // console.log(this.state.data)
    // console.log(this.state.allData)
    return (
      <TableLayout
        title={<FormattedMessage id='omp.code.tenantpermission'/>}
        showBackBtn
        onBackBtnClick={this.handleClickBackBtn}
      >
        <Search style={{ marginBottom: 8, width: 300 }} placeholder='输入关键词' onChange={this.onChange} />
        {this.state.data.length === 0 ? null
          : <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
          >
            {loop(this.state.data)}
          </Tree>
        }
        <Button type='primary' onClick={this.handleSave}>数据保存</Button>
      </TableLayout>
    )
  //  return (
  //    <TableLayout
  //      title={'租户权限设置'}
  //      showBackBtn
  //      onBackBtnClick={this.handleClickBackBtn}
  //    >
  //      {this.state.data.length === 0 ? null
  //        : <Tree
  //          checkable
  //          onExpand={this.onExpand}
  //          expandedKeys={this.state.expandedKeys}
  //          autoExpandParent={this.state.autoExpandParent}
  //          onCheck={this.onCheck}
  //          checkedKeys={this.state.checkedKeys}
  //        >
  //          {this.renderTreeNodes(this.state.data)}
  //        </Tree>
  //      }
  //      <Button type='primary' onClick={this.handleSave}>数据保存</Button>
  //    </TableLayout>
  //  )
  }
}

export default TenantPermissionUpdate
