import React from 'react'
import { Modal, Form, Row, Col, Input, Button, message } from 'antd';
import request from '../../utils/request'
import { connect } from 'dva/index'

const FormItem = Form.Item
@connect(({ user }) => ({
    user: user
}))
class PasswordUpdate extends React.Component {

    /**
     * visible: 弹窗是否可见,
     * isTeleTrue: {
            format: 手机号码的格式是否正确
            real: 手机号码和后台数据是否一致
        }
        oldPassword: 旧密码是否已填
        newPassword: 新密码是否符合格式要求
        newPasswordAgain: 新密码与旧密码是否一致
     * @param {*} props 
     */
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible,
            isTeleTrue: {
                format: false,
                real: false
            },
            oldPassword: false,
            newPassword: false,
            newPasswordAgain: false,
            telephone: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible,
        })
    }



    /**
     * 返回验证手机号码是否正确页面
     */
    renderTelePage = () => {
        const { getFieldDecorator } = this.props.form
        return (
            <Form id={'telePage'}>
                <Row>
                    <Col>
                        <FormItem label={'请输入手机号码进行身份验证:'} style={{ marginTop: '9px', marginLeft: '-10px' }} labelCol={{ span: 9 }} wrapperCol={{ offset: 9 }}>
                            {getFieldDecorator('telephone', {
                                rules: [
                                    { validator: this.validateTelephone }
                                ]
                            })(
                                <Input id={'telephone'} style={{ marginTop: '6px' }} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }

    /**
     * 返回更新密码的页面
     */
    renderUpdatePage = () => {
        const { getFieldDecorator } = this.props.form
        return (
            <Form id={'passwordPage'}>
                <Row>
                    <Col>
                        <FormItem label={'请输入原始密码:'} style={{ marginTop: '9px', marginLeft: '-10px' }} labelCol={{ span: 6 }} wrapperCol={{ offset: 6 }}>
                            {getFieldDecorator('oldPassword', {
                                initialValue: '',
                                rules: [
                                    { validator: this.validateOldPassword }
                                ]
                            })(
                                <Input id={'oldPassword'} type={'password'} style={{ marginTop: '6px' }} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label={'请输入新密码:'} style={{ marginTop: '9px', marginLeft: '-10px' }} labelCol={{ span: 6 }} wrapperCol={{ offset: 6 }}>
                            {getFieldDecorator('newPassword', {
                                rules: [
                                    { validator: this.validatePassword }
                                ]
                            })(
                                <Input id={'newPassword'} type={'password'} style={{ marginTop: '6px' }} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label={'请再次输入新密码:'} style={{ marginTop: '9px', marginLeft: '-10px' }} labelCol={{ span: 6 }} wrapperCol={{ offset: 6 }}>
                            {getFieldDecorator('newPasswordAgain', {
                                rules: [
                                    { validator: this.validateNewPassword }
                                ]
                            })(
                                <Input id={'newPasswordAgain'} type={'password'} style={{ marginTop: '6px' }} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }

    /**
     * 使弹层消失
     */
    handleOnCancel = () => {
        this.setState({
            visible: false,
            isTeleTrue: {
                format: false,
                real: false
            },
            oldPassword: false,
            newPassword: false,
            newPasswordAgain: false,
        })
    }


    /**
     * 校验手机号码格式
     */
    validateTelephone = (rule, value, callback) => {
        if (/^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/.test(value)) {
            this.setState({
                isTeleTrue: {
                    format: true,
                    real: false
                },
                telephone: value
            })
            callback()
        } else if (value.length === 0 || value === undefined) {
            this.setState({
                isTeleTrue: {
                    format: false,
                    real: false
                }
            })
            callback(new Error('请输入手机号码'))
        } else {
            this.setState({
                isTeleTrue: {
                    format: false,
                    real: false
                }
            })
            callback(new Error('请输入格式正确的手机号码'))
        }
    }

    /**
     * 验证手机号码是否正确
     */
    isTeleTrue = (e) => {
        e.preventDefault()
        if (this.state.isTeleTrue.format === true) {
            let data = {}
            data.id = this.props.user.currentUser.id
            data.telephone = this.state.telephone
            request('/v1/sysUserDomin/confirmPhone', {
                method: 'POST',
                // credentials: 'omit',
                body: data
            }).then((res) => {
                if (res.message === '成功') {
                    message.success('手机号码正确，请修改密码')
                    this.setState({
                        isTeleTrue: {
                            format: true,
                            real: true
                        }
                    })
                } else {
                    message.error('手机号码错误')
                    this.setState({
                        isTeleTrue: {
                            format: true,
                            real: false
                        }
                    })
                }
            }).catch((err) => {
                console.log(err)
            })

        } else {
            message.error('手机号码格式不正确')
            this.setState({
                isTeleTrue: {
                    format: false,
                    real: false
                }
            })
        }
    }

    /**
     * 验证原始密码是否输入
     */
    validateOldPassword = (rule, value, callback) => {
        if (value === '') {
            this.setState({
                oldPassword: false
            })
            callback(new Error('请输入原始密码'))
        } else {
            this.setState({
                oldPassword: true
            })
            callback()
        }
    }

    /**
     * 验证新密码格式
     */
    validatePassword = (rule, value, callback) => {
        if (/(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/.test(value)) {
            this.setState({
                newPassword: true
            })
            this.props.form.validateFields(['newPasswordAgain'], { force: true })
            callback()
        } else if (value === '') {
            this.setState({
                newPassword: false
            })
            this.props.form.validateFields(['newPasswordAgain'], { force: true })
            callback(new Error('请输入新密码'))
        } else {
            this.setState({
                newPassword: false
            })
            this.props.form.validateFields(['newPasswordAgain'], { force: true })
            callback(new Error('请输入8-16位数字字母组合'))
        }
    }

    /**
     * 验证两次输入的新密码是否一致
     */
    validateNewPassword = (rule, value, callback) => {
        switch (value) {
            case this.props.form.getFieldValue('newPassword'):
                this.setState({
                    newPasswordAgain: true
                })
                callback()
                break;
            case '':
                this.setState({
                    newPasswordAgain: false
                })
                callback(new Error('请再次输入新密码'))
                break;
            case undefined:
                this.setState({
                    newPasswordAgain: false
                })
                callback()
                break;
            default:
                this.setState({
                    newPasswordAgain: false
                })
                callback(new Error('两次输入的密码不一致'))
                break;
        }
    }

    /**
     * 保存新密码
     */
    save = () => {
        const { oldPassword, newPassword, newPasswordAgain } = this.state
        if (oldPassword && newPassword && newPasswordAgain) {
            let password = this.props.form.getFieldsValue()
            let data = {}
            data.id = this.props.user.currentUser.id
            data.oldPwd = password.oldPassword
            data.newPwd1 = password.newPassword
            data.newPwd2 = password.newPasswordAgain
            request('/v1/sysUserDomin/updatePwd', {
                method: 'POST',
                // credentials: 'omit',
                body: data
            }).then((res) => {
                if (res.message === '成功') {
                    message.success('密码修改成功')
                    this.handleOnCancel()
                } else {
                    message.error(res.message)
                }
            }).catch((err) => {
                console.log(err)
            })
        } else {
            message.error('新旧密码验证不通过，修改密码失败')
        }
    }

    close = () => {
        this.props.handleOnCancel()
        this.setState({

        })
    }




    render() {
        let page
        if (this.state.isTeleTrue.real === false) {
            page = this.renderTelePage()
        } else {
            page = this.renderUpdatePage()
        }
        return (
            <Modal
                afterClose={()=>this.close()}
                destroyOnClose={true}
                visible={this.state.visible}
                title={'密码修改'}
                onCancel={this.handleOnCancel}
                footer={
                    <div>
                        {this.state.isTeleTrue.real === false ? <Button onClick={this.isTeleTrue} type={'primary'}>确定</Button>
                            : <Button onClick={this.save} type={'primary'}>确定</Button>}
                        <Button onClick={this.handleOnCancel} >取消</Button>
                    </div>
                }
            >
                {page}
                {/* {this.state.isTeleTrue.real === false ? this.renderTelePage() : this.renderUpdatePage()} */}
            </Modal>
        )
    }
}

export default Form.create()(PasswordUpdate)