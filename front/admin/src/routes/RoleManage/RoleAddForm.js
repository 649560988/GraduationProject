import React , {Component} from 'react';
import { Card, Icon, Form, Select, Input, Button, message, TreeSelect} from 'antd';
import styles from './RoleManage.less';
import TableLayout from '../../layouts/TableLayout';
import request from '../../utils/request'

const FormItem = Form.Item;
const {Option, OptGroup} = Select;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

@Form.create()
class MenuAddForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      treeData : [],
      value:''
    }
  }

  componentDidMount(){
    const id = this.props.match.params.id
    if(id!=='-1'){
      this.getMenuTree(id)
    }else{
      this.getAllMenuTree()
    }
  }

  getAllMenuTree = () => {
    request('/v1/sysMenu/queryList',{
      method:'GET',
      // credentials:'omit',
      // headers: new Headers({
      //   'Content-Type': 'application/json;charset=utf-8'
      // }),
      // body:{
      //   "language":"zh_CN",
	    //   "parentId":"0"
      // }
    }).then((res)=>{
      console.log("u温无毒",res.data)
      const treeMenu = []
      res.data.menuList.map(item=>{
        treeMenu.push(item)
      })
      treeMenu.map(item=>{
        item.title = item.menu_name
        item.key = item.menu_id
        item.value = item.menu_id
      })
      this.setState({
        treeData:treeMenu
      })
    })
    .catch(error=>console.error(error))
  }

  getMenuTree = (id) => {
    request(`http://localhost:8080/v1/sysrole/selectone/${id}`,{
      method:'GET',
      credentials:'omit',
      headers: new Headers({
        'Content-Type': 'application/json;charset=utf-8'
      })
    }).then((res)=>{
      const treeMenu = []
      res.data.menuList.map(item=>{
        treeMenu.push(item)
      })
      treeMenu.map(item=>{
        item.title = item.menu_name
        item.key = item.menu_id
        item.value = item.menu_id
      })
      // this.props.form.setFieldsValue({
      //   name:res.data.sysRole.name
      // })
      this.setState({
        treeData:treeMenu
      })
    })
    .catch(error=>console.error(error))
  }

  handSubmit = () => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  onChange = (value) => {
    console.log('onChange ', value);
    this.setState({ value });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 3 }, },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12, }, },
    };
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select'
    };
    return (
        <TableLayout title={this.props.match.params.id==='-1'?'添加角色':'修改角色'} showBackBtn={true} onBackBtnClick={this.props.history.goBack}>
          	<div>
            <Form>
              	<FormItem label="角色名称" {...formItemLayout}>
                {getFieldDecorator(`name`, {
                  rules: [
                    {required: true, message: '角色名称不能为空', },
                    {max:64,message:'角色名称长度超过限制'},
                    {validator:this.handleNameUniqueCheck},
                  ],
                })(
                  <Input placeholder="角色名称（唯一）" autoComplete='off'/>
                )}
              	</FormItem>
              	<FormItem label="菜单名称" {...formItemLayout}>
              		<TreeSelect {...tProps} />
              	</FormItem>
            </Form>
          	</div>
			<div style={{paddingLeft:140}}>
				<Button type="primary" onClick={this.handSubmit}>保存</Button>
			</div>
      	</TableLayout>
    )
  }
}

export default MenuAddForm;
