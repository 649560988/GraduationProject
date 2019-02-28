import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Form, Input, Select, Button, message } from 'antd'
import {connect} from 'dva/index'
import request from '../../utils/request'

const Option = Select.Option

@connect(({ user }) => ({
    user: user
  }))
class PersonalInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        this.getPersonalInfoById()
    }

    /**
     * 根据当前登录人的id获取登录人的信息
     */
    getPersonalInfoById = () => {
        request('/v1/sysUserDomin/getAuth', {
            method: 'GET',
            // credentials: 'omit'
        }).then((res) => {
            // console.log(res)
            if (res.message === '成功') {
                this.addToForm(res.data)
            } else {
                message.error('获取当前登录人信息失败');
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将用户信息放入form表单中
     */
    addToForm = (data) => {
        let info = {}
        info.realName = data.realName
        info.userName = data.userName
        info.telephone = data.telephone
        this.setState({
            data: info
        })
    }

    /**
     * 校验手机号码格式
     */
    validateTelephone = (rule, value, callback) => {
        if (/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(value)) {
            callback()
        } else if (value.length === 0 || value === undefined) {
            callback(new Error('请输入手机号码'))
        } else {
            callback(new Error('请输入格式正确的手机号码'))
        }
    }

    /**
     * 提交表单数据
     */
    handleOnSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                fieldsValue.id = this.props.user.currentUser.id
                request('/v1/sysUserDomin/updateSelf', {
                    method: 'POST',
                    body: fieldsValue
                }).then((res) => {
                    if (res.message === '成功') {
                        message.success('修改成功')
                    } else {
                        message.error(res.message)
                    }
                })
            } else {
                message.error('请检查个人信息是否填写完整')
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            style: { width: '500px', marginBottom: '15px' },
            labelCol: {
                span: 24
            },
            wrapperCol: {
                span: 24
            }
        }
        return (
            <TableLayout
                title={'个人信息编辑'}
            >
                <p style={{ marginBottom: '15px' }}>你的个人信息中<strong>角色</strong>由管理员进行设置，其他信息可以根据你的需要进行修改。</p>
                <Form onSubmit={this.handleOnSubmit}>
                    <Form.Item {...formItemLayout} label={'用户名'}>
                        {getFieldDecorator('userName', {
                            initialValue: this.state.data.userName,
                            // rules: [{ required: true, message: '请输入用户名' }]
                        })(
                            <Input placeholder={'请输入用户名'} disabled={true}/>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={'真实姓名'}>
                        {getFieldDecorator('realName', {
                            initialValue: this.state.data.realName,
                            rules: [{ required: true, message: '请输入真实姓名' }]
                        })(
                            <Input placeholder={'请输入真实姓名'} />
                        )}
                    </Form.Item>
                    
                    <Form.Item {...formItemLayout} label={'手机号码'}>
                        {getFieldDecorator('telephone', {
                            initialValue: this.state.data.telephone,
                            rules: [
                                {required: true, message: ' '},
                                { validator: this.validateTelephone }
                            ]
                        })(
                            <Input placeholder={'请输入手机号码'}/>
                        )}
                    </Form.Item>
                   
                    <Button type='primary' htmlType={'submit'}>保存</Button>
                </Form>
            </TableLayout>
        )
    }
}

export default Form.create()(PersonalInfo);