import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import { Form, Input, Select, Button, message } from 'antd'
import request from '../../utils/request';
const Option = Select.Option

class UserUpdate extends React.Component {

    /**
     * 
     * @param {*} props 
     * data: 用户个人信息
     */
    constructor(props) {
        super(props)
        this.state = {
            flag: this.props.match.params.flag,
            id: this.props.match.params.id === 'null' ? undefined : this.props.match.params.id,
            roles: [],
            roleOptions: [],
            data: {},
            createButton: 'enabled'
        }
    }

    componentWillMount() {
        this.getAllRoles()
        if (this.state.id !== undefined) {
            this.getUserInfoById()
        }
    }

    /**
     * 根据用户id去获取用户信息
     */
    getUserInfoById = () => {
        request(`/v1/sysuser/${this.state.id}`, {
            method: 'get',
            // credentials: 'omit'
        }).then((res) => {
            if (res.message === '成功') {
                this.addToForm(res.data)
            } else {
                message.error('获取用户信息失败')
            }
        }).catch((err) => {
            console.log(err)
        })
    }
   
    /**
     * 将获取到的用户信息放入表单显示
     */
    addToForm = (data) => {
        let info = {}
        let roleIds = []
        data.sysRoles.map((item) => {
            roleIds.push(item.id)
        })
        info = Object.assign({ roleIds }, data)
        this.setState({
            data: info
        })
        // console.log(info)
    }

    /**
     * 获取所有角色信息
     */
    getAllRoles = () => {
        request('/v1/sysrole', {
            method: 'get',
            // credentials: 'omit'
        }).then((res) => {
            if (res.message === '成功') {
                this.filterAllRoles(res.data)
            } else {
                message.error('获取角色列表失败')
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将所有的角色信息进行筛选留下角色的id和name的json数据保存在state里的数组roles中
     */
    filterAllRoles = (data) => {
        let roles = []
        data.map((item) => {
            if(item.name!='admin'){
                let role = {}
                role.id = item.id
                role.name = item.name
                roles.push(role)
                console.log
            }
        })
        this.setState({
            roles
        }, () => {
            this.putAllRolesIntoOptions()
        })
    }

    /**
     * 把所有的角色都放到select的option中
     */
    putAllRolesIntoOptions = () => {
        let roleOptions = []
        this.state.roles.map((item) => {
            let option = {}
            option = <Option key={item.id} value={item.id}>{item.name}</Option>
            roleOptions.push(option)
        })
        this.setState({
            roleOptions
        })
    }



    /**
     * 点击页面返回按钮
     */
    handleClickBackBtn = (e) => {
        e.stopPropagation()
        this.linkToChange(`/setting/users`)
    }

    /***
     *   路径跳转
     */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    }

    /**
     * 提交表单数据
     */
    handleOnSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                let sysRoles = []
                console.log('values',fieldsValue)
                fieldsValue.roleIds.map((item) => {
                    this.state.roles.some((role, index) => {
                        if (role.id === item) {
                            sysRoles.push(this.state.roles[index])
                            return true
                        }
                    })
                })
                fieldsValue.sysRoles = sysRoles
                // console.log(fieldsValue)
                delete fieldsValue.roleIds
                if (this.state.flag === 'add') {
                    this.create(fieldsValue)
                } else if (this.state.flag === 'edit') {
                    this.update(fieldsValue)
                }
            }
        })
    }

    /**
     * 创建新用户
     */
    create = (fieldsValue) => {
        fieldsValue.password = '012345678'
        console.log(fieldsValue)
        request('/v1/sysuser', {
            method: 'POST',
            // credentials: 'omit',
            body: fieldsValue
        }).then((res) => {
            // console.log(res)
            if (res.message === '成功') {
                message.success('创建成功')
                this.linkToChange('/setting/users')
            } else {
                message.error(res.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 修改用户信息
     */
    update = (fieldsValue) => {
        fieldsValue.id = Number(this.state.id)
        fieldsValue.version = this.state.data.version
        request('/v1/sysuser', {
            method: 'PUT',
            // credentials: 'omit',
            body: fieldsValue
        }).then((res) => {
            if (res.message === '成功') {
                message.success('修改成功')
                this.linkToChange('/setting/users')
            } else {
                message.error(res.message)
            }
        }).catch((err) => {
            console.log(err)
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

    render() {
        let title = ''
        let disabled = false
        if (this.state.flag === 'add') {
            title = '新增用户'
            disabled = false
        } else if (this.state.flag === 'edit') {
            title = '编辑用户信息'
            disabled = true
        }
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
                title={title}
                showBackBtn
                onBackBtnClick={this.handleClickBackBtn}
            >
                <Form onSubmit={this.handleOnSubmit}>
                    <Form.Item {...formItemLayout} label={'用户名'}>
                        {getFieldDecorator('userName', {
                            initialValue: this.state.data.userName,
                            rules: [{
                                required: true, message: '请输入用户名'
                            }]
                        })(
                            <Input placeholder={'请输入用户名'} disabled={disabled} />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={'真实姓名'}>
                        {getFieldDecorator('realName', {
                            initialValue: this.state.data.realName,
                            rules: [{required: true, message: '请输入真实姓名'}]
                        })(
                            <Input placeholder={'请输入真实姓名'} />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={'角色'}>
                        {getFieldDecorator('roleIds', {
                            initialValue: this.state.data.roleIds,
                            rules: [{ required: true, message: '请选择角色' }]
                        })(
                            <Select
                                mode={'multiple'}
                                placeholder={'请选择角色'}
                            >
                                {this.state.roleOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={'手机号码'}>
                        {getFieldDecorator('telephone', this.state.flag === 'add' ? {
                            rules: [
                                {required: true, message: ' '},
                                { validator: this.validateTelephone }
                            ]
                        } : {
                                initialValue: this.state.data.telephone
                            })(
                                <Input placeholder={'请输入手机号码'} disabled={disabled} />
                            )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={'是否启用'}>
                        {getFieldDecorator('isDel', {
                            initialValue: this.state.data.isDel,
                            rules: [{
                                required: true, message: '请选择是否启用'
                            }]
                        })(
                            <Select placeholder={'请选择是否启用'}>
                                <Option key={0} value={0}>是</Option>
                                <Option key={1} value={1}>否</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Button type='primary' htmlType={'submit'}>保存</Button>
                </Form>
            </TableLayout>
        )
    }
}

export default Form.create()(UserUpdate);