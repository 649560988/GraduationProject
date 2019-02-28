import React from 'react'
import ReactDom from 'react-dom';
import { Modal, Input, Form, Button, Row, Col, Select, Radio } from 'antd'
import {connect} from 'dva/index'
import axios from 'axios/index'
import TableLayout from '../../layouts/TableLayout'
import request from '../../utils/request'
import E from 'wangeditor'

// import { FormattedMessage } from 'react-intl'
const FormItem = Form.Item
const Option = Select.Option;

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class SupplierMaintenanceDetail extends React.Component {
  state = {
    id: 0,
    data: {},
    userList: [],
    users: [],
    isAll: 0,
    editorHtml: '',
    editorText: '',
    initialContent: '请输入消息内容'
  };

/***
 *保存成功弹窗
 */
success = () => {
  const modal = Modal.success({
    title: '保存成功',
    content: '保存成功'
  })
  this.linkToChange(`/messages`)
  setTimeout(() => modal.destroy(), 1000)
}
/***
 *保存失败弹窗
 */
errorMess = (mess) => {
  Modal.error({
    title: '保存失败',
    content: mess
  })
}

  /**
   * 路径标志用户id
   */
componentWillMount () {
  this.setState({
    id: parseInt(this.props.match.params.id)
  },()=>{
  })
  this.getUserList()
}
componentDidMount () {
    if (this.state.id !== 0) {
      this.getTenantInfo(this.state.id)
    }
    this.initEditor()
  }

getUserList(){
  let url = '/v1/sysuser/selectall'
  request(url,{
    method: 'GET'
  }).then((res) => {
    if(res.message == '成功'){
      let children = []
      for (let i of res.data) {
        children.push(<Option key={i.id}>{i.userName}</Option>);
      }
      this.setState({
        userList: children
      })
    }else{
      console.log("用户信息获取失败")
    }
  })
}

getTenantInfo = (id) => {
  let url = '/v1/message/' + id
  let data = {}
  request(url,{
    method: 'POST'
  }).then((res) => {
    data.title = res.data.title
    data.content = res.data.content
    this.setState({
      data: data
    })
  }).catch((err) => {
    console.log(err)
  })
}

  /***
   * form表单提交
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue
        }
        if (this.state.id === 0) {
          this.insertUserInfo(values)
        } else {
          this.updateUSerInfo(values)
        }
      }
    })
  }

  // 消息发送人选择
  handleChange(value) {
    console.log(`selected ${value}`);
  }

  // 初始化设置编辑器
  initEditor () {
    const editor = new E(ReactDom.findDOMNode(this._div))
 
    this.editor = editor
 
    editor.customConfig.zIndex = 100
    editor.customConfig.uploadImgServer = '/fileclient-management/api/uploadpic'
    // 限制一次最多上传 1 张图片
    editor.customConfig.uploadImgMaxLength = 1
    editor.customConfig.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      if (files[0]) {
        const formData = new window.FormData()
        formData.append('file', files[0], 'cover.jpg')
        fetch('/fileclient-management/api/uploadpic', {
          method: 'POST',
          body: formData
        }).then((res) => {
          return res.json()
        }).then((res) => {
          const data = res.resultData
          if (data) {
            // 上传代码返回结果之后，将图片插入到编辑器中
            insert(data.resourceUrl)
          } else {
            console.log(data.msg)
          }
        })
      } else {
        message.info('请选择要上传的图片')
      }
    }
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = (html) => {
      this.setState({
        editorHtml: html,
        editorText: editor.txt.text()
      })
      //将html值设为form表单的desc属性值
      this.props.form.setFieldsValue({
        'content': html
      });
    }
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      // 'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      // 'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.customConfig.lang = {
      '设置标题': 'Title',
      '字号': 'Size',
      '文字颜色': 'Color',
      '设置列表': 'List',
      '有序列表': '',
      '无序列表': '',
      '对齐方式': 'Align',
      '靠左': '',
      '居中': '',
      '靠右': '',
      '正文': 'p',
      '链接文字': 'link text',
      '链接': 'link',
      '上传图片': 'Upload',
      '网络图片': 'Web',
      '图片link': 'image url',
      '插入视频': 'Video',
      '格式如': 'format',
      '上传': 'Upload',
      '创建': 'init'
    }
    editor.create()
  }

  /***
   * 添加
   */
  insertUserInfo = (values) => {
    let url = '/v1/message/create'
    request(url, {
      method: 'post',
      body: values
    }).then((res) => {
        if (res.message === '成功') {
            this.success()
        } else {
          console.log(err)
        }
    }).catch(() => {

    })
  };

  /***
   * 更新
   */
  updateUSerInfo = (values) => {
    let url = '/v1/message/update'
    values = {...values,id: this.state.id}
    request(url,{
      method: 'post',
      body: values
    }).then((res) => {
      if (res.message != '成功') {
        this.errorMess(res.data.message)
      } else {
        this.success()
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props
    history.push(url)
  };

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/messages`)
  }

  onChange = (e) => {
    this.setState({
      isAll: e.target.value,
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const RadioGroup = Radio.Group
    const formItemLayout = {
      style: {width: 500, marginBottom: 20},
      labelCol: {
        span: 24
      },
      wrapperCol: {
        span: 24
      }
    }
    let title = ''
    if (this.state.id == '0') {
      title = '创建消息'
      
    } else  {
      title = '编辑消息'
    }
    return (
      <TableLayout
        title={title}
        showBackBtn
        onBackBtnClick={this.handleClickBackBtn}>
        <div className='container-item'>
          <div className='content'>
            <Form layout='inline'>
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>消息标题</p>}>
                    {getFieldDecorator('title', {
                      initialValue: this.state.data.title,
                      rules: [{ required: true, whitespace: true, message: '请输入消息标题!' }]
                    })(
                      <Input placeholder={'请输入消息标题'} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                <FormItem {...formItemLayout} label='消息接受类型'>
                {getFieldDecorator('isAll',{
                  initialValue: this.state.isAll,
                })(
                  <RadioGroup onChange={this.onChange}>
                    <Radio value={0}>部分人接收</Radio>
                    <Radio value={1}>所有人接收</Radio>
                  </RadioGroup>
                )}
                </FormItem>
                </Col>
              </Row>
              {
                !this.state.isAll?<Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label='消息接收人'>
                    {getFieldDecorator('users', {
                      initialValue: this.state.users === [] ? [] : this.state.users,
                      rules: [{ required: true, message: '请选择消息接收人!' }]
                    })(
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请选择消息接收人"
                        onChange={this.handleChange}
                      >
                        {this.state.userList}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>:null
              }
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label={<p style={{display: 'inline', fontWeight: 'bold'}}>消息内容</p>}>
                    {getFieldDecorator('content', {initialValue: this.state.initialContent,
                      rules: [{ required: true, whitespace: true, message: '请输入消息内容!' }]
                    })(<div ref={(ref) => this._div = ref}></div>)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginTop: 30}}>
                <Col span={10}>
                  <FormItem >
                    <Button type='primary' onClick={this.handleSubmit}>数据保存</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </TableLayout>
    )
  }
}

export default Form.create()(SupplierMaintenanceDetail)



