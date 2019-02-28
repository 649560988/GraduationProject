import React from 'react'
import axios from 'axios'
import { connect } from 'dva'
import TableLayout from '../../layouts/TableLayout'
import { Tree, Button, Input, Icon, Modal,Tooltip, Popconfirm, Popover, message } from 'antd'

const TreeNode = Tree.TreeNode
const Search = Input.Search
const ButtonGroup = Button.Group
// let fatherDept= [] // 父级部门

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
        searchValue: '',
        id: 0, // 部门id
        defaultDeptName: '', // 部门名称
        data: [], // 菜单和权限，有父级和子级
        allData: [], // 所有数据，无父级和子级
        autoExpandParent: true, // 自动展开
        expandedKeys: [], // 自动展开的字段
        showBtn:'none', // 显示buttongroup
        key:0, //
        visible: false, // 弹窗是否显示
        state: -1, //是添加（0）还是修改（1）没有删除
        content: <ButtonGroup>
                    <Tooltip placement="bottom" title="添加">
                        <Button style={{ paddingTop:'-2px' }} onClick={(e)=>{this.showModal(0)}} ><Icon type='plus' /></Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="编辑">
                        <Button onClick={(e)=>{this.showModal(1)}} ><Icon type='edit' /></Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="移除">
                        <Popconfirm title="确定要删除吗" okText="是的" cancelText="取消"
                                onConfirm={(e) => {this.deleteData()}}
                        >
                            <Button type="danger"><Icon type="delete"  /></Button>
                        </Popconfirm>
                    </Tooltip>
                </ButtonGroup>
    };


    componentDidMount = () => {
        let isadmin = this.props.user.currentUser.admin
        if (isadmin === true) {
            this.getAllDept()
            this.selectDept()
        }
    }
    /***
    * 查询所有部门
    */
    selectDept = () => {
        axios({
            method: 'get',
            url: '/iam-ext/v1/departments/queryListByPidLoop/0'
        }).then((res) => {
            // console.log(res)
            // this.handleData(res.data)
            this.setState({
                data: this.handleDept(res.data),  
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
   * 解析所有部门数据将deptName(部门名称),id(部门id)以父子关系呈现出来
   */
  handleDept = (data) => {
    let dept = []
    for (let i = 0; i < data.length; i++) {
      let deptObj = {}
      deptObj.key = data[i].id.toString()
      deptObj.value = data[i].deptName
      deptObj.title = <Popover trigger="contextMenu" placement="right" content={this.state.content}>{data[i].deptName}</Popover>
    //   deptObj.title = data[i].deptName
      // deptObj.deptName = data[i].deptName
      // deptObj.id = data[i].id
    //   console.log(deptObj)
      if (data[i].departmentEList.length > 0) {
        deptObj.children = this.handleDept(data[i].departmentEList)
      }
      dept.push(deptObj)
    }
    return dept
  }

  /**
   * 获取所有部门的name,id不分父子
   */
  getAllDept = (data) => {
      let _this = this
    axios({
        method: 'get',
        url: '/iam-ext/v1/departments/all'
    }).then((res) => {
        let allDatas = []
        for (let i = 0; i < res.data.length; i++) {
            let deptObj = {}
            deptObj.key = res.data[i].id.toString()
            deptObj.title = res.data[i].deptName
            deptObj.value = res.data[i].deptName
            allDatas.push(deptObj)
        }
        _this.setState({
            allData: allDatas
        })
    }).catch((err) => {
        console.log(err)
    })
  }


    /***
    * 处理数据
    */
    // handleData = (result) => {
    //     let datas = []
    //     // let allDatas = []
    //     // let permissionIds = []
    //     if (result !== undefined && result !== null) {
    //         result.forEach((fatherMenu) => {
    //             // 父菜单
    //             let father = {}
    //             let son = []
    //             father.title = fatherMenu.deptName
    //             father.key = fatherMenu.id
    //             // allDatas.push(father)
    //             if (fatherMenu.departmentEList !== undefined && fatherMenu.departmentEList !== null) {
    //                 fatherMenu.departmentEList.forEach((sonMenu) => {
    //                     // 子菜单
    //                     let child = {}
    //                     let grandson = []
    //                     child.title = sonMenu.deptName
    //                     child.key = sonMenu.id // child.key = fatherMenu.code + sonMenu.code
    //                     // allDatas.push(child)
    //                     if (sonMenu.departmentEList !== undefined || sonMenu.departmentEList !== null) {
    //                         sonMenu.departmentEList.forEach((deptList) => {
    //                             // 孙权限
    //                             let childd = {}
    //                             let grandchild = []
    //                             childd.title = deptList.deptName
    //                             childd.key = deptList.id // childd.key = child.key + permissionList.code
    //                             if(deptList.departmentEList!== undefined || deptList.departmentEList !== null) {
    //                                 deptList.departmentEList.forEach((value) => {
    //                                     let grandchildd={}
    //                                     grandchildd.title=value.deptName
    //                                     grandchildd.key=value.id
    //                                     grandchild.push(grandchildd)
    //                                 })
    //                             }
    //                             // allDatas.push(childd)
    //                             // permissionIds.push(permissionList.id)
    //                             childd.children=grandchild
    //                             grandson.push(childd)
    //                         })
    //                     }
    //                     child.children = grandson
    //                     son.push(child)
    //                 })
    //             }
    //             father.children = son
    //             datas.push(father)
    //         })
    //     }
    //     // console.log(allDatas)
    //     console.log(datas)
    //     // 将datas 添加到state中
    //     this.setState({
    //         data: datas,
    //         // allData: allDatas,
    //         // allPermissionIds: permissionIds
    //     }, () => {
    //         // this.selectUserMenu()
    //     })
    // }

    /***
    * 处理添加部门信息
    */
    // handleAdd = (result,datas) => {
    //     if(datas.length!==0) {
    //         datas.forEach((value) =>{
    //             if(value.key===result.parentId){
    //                 console.log(value.children)
    //                 let child={}
    //                 child.title=result.deptName
    //                 child.key=result.id
    //                 value.children.push(child)
    //             }
    //             else if(value.children!==undefined){
    //                 //递归
    //                 this.handleAdd(result,value.children)
    //             }
    //         })
    //     }
    //     console.log(this.state.expandedKeys)
    //     this.setState({
    //         data:datas,
    //         expandedKeys:this.state.expandedKeys,
    //         autoExpandParent: false
    //     })
    // }

    /***
    * 处理修改部门信息
    */
    // handleEdit = (result,datas) => {
    //     if(datas.length>0) {
    //         datas.forEach((value) =>{
    //             if(value.key===result.id){
    //                 value.title=result.deptName
    //                 return
    //             }
    //             else if(value.children!==undefined){
    //                 //递归
    //                 this.handleEdit(result,value.children)
    //             }
    //         })
    //     }
    //     // console.log(datas)
    //     this.setState({
    //         data:datas,
    //         expandedKeys:this.state.expandedKeys,
    //         autoExpandParent: false
    //     })
    // }
    
    /***
    * 处理删除部门信息
    */   
    // handleDelete = (result,datas) => {
    //     let nextData=[]
    //     if(datas.length>0) {
    //         datas.forEach((value) =>{
    //             fatherDept.push(value)
    //             if(value.key===result.id){
    //                 nextData = datas.filter(item => item.key !== result.id)
    //                 // datas=nextData
    //                 // 找到它的父级，父级.children=nextData
    //                 let findFather = () => {
    //                     this.state.data.forEach((val) => {
    //                         if(val.key=fatherDept[fatherDept.length-2].key) {
    //                             value.children=nextData
    //                         }
    //                         else if(val.children!==undefine) {
    //                             findFather(val.children)
    //                         }
    //                     })
    //                 }
    //                 findFather(this.state.data)                 
    //             }
    //             else if(value.children!==undefined){
    //                 //递归
    //                 this.handleDelete(result,value.children)
    //             }
    //         })
    //     }
    //     console.log(datas)
    //     this.setState({
    //         data:datas,
    //         expandedKeys:this.state.expandedKeys,
    //         autoExpandParent: false
    //     })
    // }
    
    
    /***
    * 展开
    */
    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys)
        this.setState({
          expandedKeys,
          autoExpandParent: false
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

    onChange = (e) => {
        const value = e.target.value
        // console.log(e.target.value)
        const expandedKeys = this.state.allData.map((item) => {
            if (item.title.indexOf(value) > -1) {
                // console.log(item.key)
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


    /***
    * 右击
    */
    onRightClick = (e) => {
        // console.log(e.node._reactInternalFiber.alternate.key)
        // console.log(e)
        // console.log(node)
        let key = -1
        if ( e.node._reactInternalFiber.alternate === null ) {
            key = e.node._reactInternalFiber.key
        } else {
            key = e.node._reactInternalFiber.alternate.key
        } 
        // let key=　e.node._reactInternalFiber.alternate.key
        this.setState({
            // showBtn: 'inline',
            id: key
        },()=>{
            // console.log(this.state.id)
        })
    }

    /***
    * 显示弹层
    */
    showModal = (state) => {
        if (state === 1) {
                axios({
                    method: 'get',
                    url: '/iam-ext/v1/departments/'+this.state.id
                }).then((res) => {
                    this.setState({
                        defaultDeptName: res.data.deptName,
                        visible: true,
                        state: state
                    })
                    console.log(res.data.deptName)
                }).catch((err) => {
                    console.log(err)
                })
        } else if (state === 0) {
            this.setState({
                defaultDeptName: '',
                visible: true,
                state: state
            })
        }
        // this.setState({
        //     // showBtn: 'none',
        //     visible: true,
        //     state: state
        // });
    }
    
    /***
    * 保存（添加和修改）
    */
    handleOk = (e) => {
        console.log(e);

        let data={}
        data.deptName = document.getElementsByClassName('deptName')[0].value

        //添加
        if(this.state.state===0) {
            data.parentId=this.state.id
            axios({
                method: 'post',
                url: '/iam-ext/v1/departments',
                data: data
            }).then((res) => {
                // this.handleAdd(res.data,this.state.data)
                success('添加成功')
                this.selectDept()
                this.getAllDept()
            }).catch((err) => {
                console.log(err)
            })   
        }
        //修改
        if(this.state.state===1) {
            axios({
                method: 'put',
                url: '/iam-ext/v1/departments/'+this.state.id,
                data: data
            }).then((res) => {
                // this.handleEdit(res.data,this.state.data)
                success('修改成功')
                this.selectDept()
                this.getAllDept()
            }).catch((err) => {
                console.log(err)
            })            
        }
        this.setState({
            visible: false,
        });
    }

    /***
    * 删除
    */
    deleteData = () => {
        axios({
            method: 'delete',
            url: '/iam-ext/v1/departments/'+this.state.id
        }).then((res) => {
            if(res.data.failed===true) {
                error('删除失败',res.data.message)
            }
            else {
                // this.handleDelete(res.data,this.state.data)
                success('删除成功')
                this.selectDept()
                this.getAllDept()
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    /***
    * 取消
    */
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
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
    render () {
        const { searchValue, expandedKeys, autoExpandParent } = this.state
        let modalTitle = ''
        const loop = data => data.map((item) => {
        //   const index = item.title.indexOf(searchValue)
          const index = item.title.props.children.indexOf(searchValue)
        //   const beforeStr = item.title.substr(0, index)
          const beforeStr = item.title.props.children.substr(0, index)
        //   const afterStr = item.title.substr(index + searchValue.length)
          const afterStr = item.title.props.children.substr(index + searchValue.length)
          const title = index > -1 ? (
            <span>
                <Popover trigger="contextMenu" placement="right" content={this.state.content}>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
              </Popover>
            </span>
        //   ) : <span>{item.title}</span>
        ) : <span>{item.title}</span>
          if (item.children) {
            return (
              <TreeNode key={item.key} title={title}>
                {loop(item.children)}
              </TreeNode>
            )
          }
          return <TreeNode key={item.key} title={title} />
        })

        if (this.state.state === 1) {
            modalTitle = '编辑部门名称'
        } else if (this.state.state === 0) {
            modalTitle = '新增部门'
        }
        
        //当状态是修改是显示当前部门的名字
        // let defaultDeptName=''
        // if(this.state.state===1) {
        //     axios({
        //         method: 'get',
        //         url: '/iam-ext/v1/departments/'+this.state.id
        //     }).then((res) => {
        //         this.setState({
        //             defaultDeptName:res.data.deptName
        //         })
        //     }).catch((err) => {
        //         console.log(err)
        //     })
        // }
        
        return (
            <TableLayout
                title={'部门维护'}
            >
                <Search style={{ marginBottom: 8, width: 300 }} placeholder='输入关键词' onChange={this.onChange} />
                {this.state.data.length === 0 ? null
                : <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onRightClick={this.onRightClick}
                    // onClick={this.onRightClick}
                >
                    {loop(this.state.data)}
                </Tree>
                }
                {/* <ButtonGroup style={{ display:this.state.showBtn }} >
                    <Tooltip placement="bottom" title="添加">
                        <Button style={{ paddingTop:'-2px' }} onClick={(e)=>{this.showModal(0)}} ><Icon type='plus' /></Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="编辑">
                        <Button onClick={(e)=>{this.showModal(1)}} ><Icon type='edit' /></Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="移除">
                        <Popconfirm title="确定要删除吗" okText="是的" cancelText="取消"
                                    onConfirm={(e) => {this.deleteData()}}
                        >
                        <Button type="danger"><Icon type="delete"  /></Button>
                        </Popconfirm>
                    </Tooltip>
                </ButtonGroup> */}
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

export default DeptManage

