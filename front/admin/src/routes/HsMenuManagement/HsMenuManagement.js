import React from 'react'
import axios from 'axios'
import { connect } from 'dva'
import TableLayout from '../../layouts/TableLayout'
import request from '../../utils/request'
import { Tree, Button, Input, Icon, Modal,Tooltip, Popconfirm, Popover, message ,Select ,Form ,Spin } from 'antd'

const TreeNode = Tree.TreeNode
const Search = Input.Search
const ButtonGroup = Button.Group
const Option = Select.Option;
const FormItem = Form.Item;

/***
 * 保存成功弹窗
 */
function success (state) {
    const modal = Modal.success({
        title: state,
        content: state
})
setTimeout(() => modal.destroy(), 1000)
}
/***
 * 保存失败弹窗
*/
function error (state,msg) {
    Modal.error({
        title: state,
        content: msg
    })
}



@connect(({ user }) => ({
    user: user
  }))
class DeptManage extends React.Component {
    state = {
        datalist:[],   //树形目录数据源
        allData: [],   //搜索功能所需树形同级数据源
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        id: '',   //操作节点id
        state: -1, //是添加（0）还是修改（1）没有删除
        display: 'none',  //控制右侧表单显示隐藏
        visible: false,   //弹窗显示隐藏
        isEnabled: 1,     //启用禁用ID
        content: <ButtonGroup>
                  <Tooltip placement="bottom" title="添加1111111111111111111">
                      <Button style={{ paddingTop:'-2px' }} onClick={(e)=>{this.showModal(0)}} ><Icon type='plus' /></Button>
                  </Tooltip>
                  <Tooltip placement="bottom" title="编辑1111111111111111111">
                      <Button onClick={(e)=>{this.showModal(1)}} ><Icon type='edit' /></Button>
                  </Tooltip>
                  <Tooltip placement='bottom' title='停用111111111111111'>
                    <Button type='danger'>
                      <Icon type='minus-circle-o' /></Button>
                  </Tooltip>
              </ButtonGroup>,      //操作按钮组内容
        update:{
          menuName: '',
          language: '',
          parentId: '',
          route: '',
          sort: '',
        },                //表单数据源
        treeNodeData:''   //节点信息
    };


    componentDidMount = () => {
      this.selectDept()
      this.getAllDept()
    }

    /***
    * 查询所有菜单
    */
    selectDept = (lang) => {
      let param = {
        language: 'zh_CN',
        parentId: 0
      }
      if (lang !== undefined){
        param.language = lang
      }
      let treeData = [{
        id: -1,
        menuName: "所有菜单",
        children: []
        }]
      request('/v1/sysMenu/list', {
        method: 'post',
        body: param
      }).then((res) => {
        treeData[0].children = res.data
        this.setState({
                  datalist: this.handleDept(treeData),
              })
      }).catch((err) =>{
        console.log(err)
      })
      }

      /**
     * 解析所有菜单数据将以父子关系呈现出来
     */
    handleDept = (data) => {
      let dept = []
      for (let i = 0; i < data.length; i++) {
        let deptObj = {}
        deptObj.id = data[i].id.toString()
        deptObj.menuName = data[i].menuName
        deptObj.title = <Popover trigger="contextMenu" placement="right" content={this.state.content}>{data[i].menuName}</Popover>
        if (data[i].children.length > 0) {
          deptObj.children = this.handleDept(data[i].children)
        }
        dept.push(deptObj)
      }
      return dept
    }
    /***
     * 同级所有节点信息
     */
    getAllDept = () => {
      let _this = this
      request('/v1/sysMenu/queryList', {
        method: 'get',
      }).then((res) => {
        let allDatas = []
        for (let i = 0; i < res.data.length; i++) {
          let deptObj = {}
          deptObj.id = res.data[i].id.toString()
          deptObj.title = res.data[i].menuName
          deptObj.value = res.data[i].menuName
          allDatas.push(deptObj)
        }
        _this.setState({
          allData: allDatas
        })
      }).catch((err) => {
        console.log(err)
      })
    }
    /**
     * 限制弹窗中文本的长度
     */
    handleTextLength = (e) => {
        if (e.target.value.length > 32) {
            message.error('部门名称长度不得超过32位')
            e.target.value = e.target.value.substring(0, 32)
        }
    }

    /**
     * 展开收起
     */
    onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    }

    /**
     * 树形搜索返回搜索值所在树形的位置
     */
    getParentKey = (key, tree) => {
        let parentKey
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          if (node.children) {
            if (node.children.some(item => item.id === key)) {
              parentKey = node.id
            } else if (this.getParentKey(key, node.children)) {
              parentKey = this.getParentKey(key, node.children)
            }
          }
        }
        return parentKey
      }

    /**
     * 搜索触发事件
     */
    onChange = (e) => {
      const value = e.target.value;
      const expandedKeys = this.state.allData.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.id, this.state.datalist);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    }
    /***
    * 右击
    */
    onRightClick = (e) => {
        let key = -1
        if ( e.node._reactInternalFiber.alternate === null ) {
            key = e.node._reactInternalFiber.key
        } else {
            key = e.node._reactInternalFiber.alternate.key
        }
        this.state.id = key
        this.setState({
            display: 'none',
        },()=>{
        })
        this.enableContent(this.state.id)
    }

    /**
     * 加载操作按钮组
     */
    enableContent = (key) => {
      request('/v1/sysMenu/query/' + key, {
          method: 'get',
        }).then((res) => {
          this.state.treeNodeData = res.data
          if(res.data){
            this.state.isEnabled = res.data.isDel
          }else{
            this.state.isEnabled = 0
          }
          this.state.content = <ButtonGroup>
                  <Tooltip placement="bottom" title="添加">
                      <Button style={{ paddingTop:'-2px' }} onClick={(e)=>{this.showModal(0)}} ><Icon type='plus' /></Button>
                  </Tooltip>
                  <Tooltip placement="bottom" title="编辑">
                      <Button onClick={(e)=>{this.showModal(1)}} ><Icon type='edit' /></Button>
                  </Tooltip>
                  {
                    this.state.isEnabled === 0
                      ? <Tooltip placement='bottom' title='停用'>
                        <Button type='danger' onClick={() => this.handleDisableRole()}>
                          <Icon type='minus-circle-o' /></Button>
                      </Tooltip>
                      : <Tooltip placement='bottom' title='启用'>
                        <Button onClick={() => this.handleDisableRole()}>
                          <Icon type='check-circle-o' /></Button>
                      </Tooltip>
                  }
              </ButtonGroup>
          this.selectDept()
        }).catch((err) => {
          console.log(err)
        })
    }

    /**
     * 启用禁用
     */
    handleDisableRole = () => {
      if (this.state.id === '-1') {
        success('首节点不可操作')
      } else {
        let roleData = {
          id: this.state.id,
          isdel: this.state.isEnabled
        }
        let isdelData = 0
        if (roleData.isdel === 0) {
          isdelData = 1
        } else {
          isdelData = 0
        }
        request('/v1/sysMenu/delete/' + roleData.id + '/' + isdelData, {
          method: 'put',
        }).then((res) => {
          this.enableContent(this.state.id)
        }).catch((err) => {
          console.log(err)
        })
      }
    }
    /***
    * 显示弹层
    */
    showModal = (state) => {
      if (this.state.id === '-1'){
        success('首节点不可操作')
      }else{
        if (state === 1) {
          this.state.update.menuName = this.state.treeNodeData.menuName
          this.state.update.language = this.state.treeNodeData.language
          this.state.update.route = this.state.treeNodeData.route
          this.state.update.sort = this.state.treeNodeData.sort
        } else if (state === 0) {
          this.state.update.menuName = ''
          this.state.update.route = ''
          this.state.update.sort = ''
          this.state.update.language = 'zh_CN'
        }
        this.state.state=state
        this.setState({
            display: 'block',
          })
      }
    }
    /***
    * 取消
    */
    handleCancel = (e) => {
        this.setState({
            display: 'none',
            visible: false
        });
    }
    /***
     * 选择中英文
     */
    handleChange = (e) => {
      this.selectDept(e)
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.state.update.menuName = values.menuName
          this.state.update.language = values.language
          this.state.update.route = values.route
          this.state.update.sort = values.sort
          if (this.state.state === 1) {
            this.state.update.id = this.state.id
            request('/v1/sysMenu/update', {
              method: 'put',
              body: this.state.update
            }).then((res) => {
              success('编辑成功')
              this.selectDept()
              this.getAllDept()
            }).catch((err) => {
              console.log(err)
            })
          }else{
            this.state.update.parentId = this.state.id
            request('/v1/sysMenu/create', {
              method: 'post',
              body: this.state.update
            }).then((res) => {
              success('新增成功')
              this.selectDept()
              this.getAllDept()
            }).catch((err) => {
              console.log(err)
            })
          }
          this.props.form.resetFields();
          this.setState({
            display: 'none',
            visible: false
          });
        }
      });
    }
    render () {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 8 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 16 },
                },
              };
        let modalTitle = ''
        const loop = data => data.map((item) => {
        const index = item.title.props.children.indexOf(searchValue);
        const beforeStr = item.title.props.children.substr(0, index);
        const afterStr = item.title.props.children.substr(index + searchValue.length);
        const title = index > -1 ? (
            <span>
                <Popover trigger="contextMenu" placement="right" content={this.state.content}>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
              </Popover>
            </span>
        ) : <span>{item.title}</span>
          if (item.children) {
            return (
              <TreeNode key={item.id} title={title}>
                {loop(item.children)}
              </TreeNode>
            )
          }
          return <TreeNode key={item.id} title={title} />
      });
        return (
            <TableLayout
                title={'菜单管理'}
            >
            <div>
              <Select defaultValue="中文" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="zh_CN">中文</Option>
                <Option value="en_US">英文</Option>
              </Select>
              <Search style={{ marginBottom: 8 ,width: 300, marginLeft:20}} placeholder="Search" onChange={this.onChange} />
            </div>
            <div style={{marginTop: 30}}>
              <div style={{width: 300,float: 'left'}}>
                {this.state.datalist.length === 0 ? null
                : <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onRightClick={this.onRightClick}
                >
                    {loop(this.state.datalist)}
                </Tree>
                }
              </div>
              <div style={{width: 400,float: 'left',display: this.state.display}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item
                    {...formItemLayout}
                    label="名称"
                  >
                    {getFieldDecorator('menuName', {
                      initialValue: this.state.update.menuName,
                      rules: [{
                        required: true, message: '菜单名称不能为空',
                      }],
                    })(
                      < Input />
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="route"
                  >
                    {getFieldDecorator('route', {
                      initialValue: this.state.update.route,
                      rules: [ {
                        required: true, message: 'route不能为空',
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="排序"
                  >
                    {getFieldDecorator('sort', {
                      initialValue: this.state.update.sort,
                      rules: [{
                        required: true, message: '排序不能为空',
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="语言"
                  >
                    {getFieldDecorator('language', {
                      initialValue: this.state.update.language,
                      rules: [{
                        required: true, message: 'Please input your E-mail!',
                      }],
                    })(
                      <Select >
                        <Option value="zh_CN">中文</Option>
                        <Option value="en_US">英文</Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      xs: { span: 24, offset: 0 },
                      sm: { span: 16, offset: 8 },
                    }}
                  >
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button type="primary" onClick={this.handleCancel} style={{marginLeft:20}}>取消</Button>
                  </Form.Item>
              </Form>
              </div>
            </div>
            <Modal
                title={modalTitle}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                destroyOnClose
                maskClosable={false}
                width='320px'
                >
                <span>部门名称：</span>
                <Input onChange={this.handleTextLength} className='deptName' placeholder='请输入部门名称' defaultValue={this.state.defaultDeptName} style={{width:200}}/>
            </Modal>
            </TableLayout>
        )
    }
}

export default Form.create()(DeptManage)

