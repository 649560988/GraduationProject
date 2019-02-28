import React from 'react'
import { Form, Row, Col, Select, Input, Modal, Button, DatePicker, message } from 'antd';
import styles from './TS.less'
import moment from 'moment'
import axios from 'axios/index'
const FormItem = Form.Item
const Option = Select.Option

class TSApplicationDetails extends React.Component {

    /**
     * data: 所有的项目列表
     */
    state = {
        data: [],
        options: [],
        title: '',
        initialRecord: {}
    }

    componentDidMount () {
        this.getAllProjects()
    }

    /**
     * 根据TS的id去获取这条记录的数据
     */
    getTSRecord = (id) => {
        let initialRecord = {}
        let leaveTypes = ['带薪年假', '额外福利年假', '带薪病假', '病假', '事假', '婚假', '陪产假', '丧假', '长病假']
        axios({
            url: '/demo/v1/ompts/selectById/' + id,
            method: 'get'
        }).then((res) => {
            // console.log(res.data.ompTsE)
            if (res.data.ompTsE.projectName === '周末及法定节假日') {
                initialRecord.project_name = res.data.ompTsE.projectName
                initialRecord.project_id = undefined
                initialRecord.project_manager = undefined
                initialRecord.project_manager_id = undefined
                initialRecord.description = res.data.ompTsE.description
                // console.log(initialRecord)
                this.setState({
                    initialRecord,
                    title: '修改TS'
                }, () => {
                    this.matchRecord()
                })
            } else if (leaveTypes.includes(res.data.ompTsE.projectName)) {
                initialRecord.project_name = res.data.ompTsE.projectName
                initialRecord.project_id = undefined
                initialRecord.project_manager = undefined
                initialRecord.project_manager_id = res.data.ompTsE.approverId
                initialRecord.description = res.data.ompTsE.description
                this.getProjectManagerName(initialRecord)
            } else {
                initialRecord.project_name = res.data.ompTsE.projectName
                initialRecord.project_id = res.data.ompTsE.projectId
                initialRecord.project_manager = undefined
                initialRecord.project_manager_id = res.data.ompTsE.approverId
                initialRecord.description = res.data.ompTsE.description
                this.getProjectManagerName(initialRecord)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 根据项目经理的id去获取项目经理的真实姓名并显示
     */
    getProjectManagerName = (initialRecord) => {
        axios({
            url: '/iam-ext/v1/userext/selectRealName?userId=' + initialRecord.project_manager_id,
            method: 'get',
        }).then((res) => {
            initialRecord.project_manager = res.data.realName
            // console.log(initialRecord)
            this.setState({
                initialRecord,
                title: '修改TS'
            }, () => {
                this.matchRecord()
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 匹配当天的项目列表和初始的ts记录
     */
    matchRecord = () => {
        // console.log(this.state.initialRecord)
        let exist = false
        this.state.data.map((item, index) => {
            let temp = {}
            temp.project_name = item.project_name
            temp.project_id = item.project_id
            temp.project_manager = item.project_manager
            temp.project_manager_id = item.project_manager_id
            temp.description = this.state.initialRecord.description
            // console.log(item)
            // console.log(temp)
            if (JSON.stringify(temp) === JSON.stringify(this.state.initialRecord)) {
                exist = true
                this.props.form.setFieldsValue({ projectManager: item.project_manager })
                this.props.form.setFieldsValue({ projectId: item.order.toString() })
                this.props.form.setFieldsValue({ description: this.state.initialRecord.description })
            }
        })
        if (exist === false) {
            message.error('该条TS记录不存在当天的项目源中')
        }
    }

    /**
     * 获取选中日期的所有项目放入数组
     */
    getAllProjects = () => {
        let time = new Date().toTimeString().substring(0, 8)
        let date = this.props.selectedDates[0] + ' ' + time
        let leaveExist = false
        axios({
            url: '/demo/v1/projectSource/source?date=' + date,
            method: 'get'
        }).then((res) => {
            if (res.data.length === 0) {
                message.info('当天没有任何假期或项目记录')
            } else if (res.data.length > 0) {
                let tsRecords = []
                let leaveTypes = ['带薪年假', '额外福利年假', '带薪病假', '病假', '事假', '婚假', '陪产假', '丧假', '长病假']
                res.data.map((item, index) => {
                    let tsRecord = {}
                    if (item.project_name === '周末及法定节假日') {
                        tsRecord.order = index
                        tsRecord.project_name = item.project_name
                        tsRecord.project_id = undefined
                        tsRecord.project_manager = undefined
                        tsRecord.project_manager_id = undefined
                        tsRecords.push(tsRecord)
                    } else if (leaveTypes.includes(item.project_name)) {
                        tsRecord.order = index
                        leaveExist = true
                        tsRecord.project_name = item.project_name
                        tsRecord.project_id = undefined
                        tsRecord.project_manager = undefined
                        tsRecord.project_manager_id = item.project_manager_id
                        tsRecords.push(tsRecord)
                    } else {
                        tsRecord.order = index
                        tsRecord.project_name = item.project_name
                        tsRecord.project_id = item.project_id
                        tsRecord.project_manager = item.project_manager
                        tsRecord.project_manager_id = item.project_manager_id
                        tsRecords.push(tsRecord)
                    }
                })
                if (leaveExist === true) {
                    this.setState({
                        data: tsRecords
                    }, () => {
                        this.getLeaderName(0)
                    })
                } else if (leaveExist === false) {
                    this.setState({
                        data: tsRecords
                    }, () => {
                        this.putDataIntoSelect()
                    })
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 根据请假的审批人id去获取审批人的姓名
     */
    getLeaderName = (index) => {
        if (index < this.state.data.length) {
            let data = this.state.data
            if (this.state.data[index].project_manager_id !== undefined) {
                axios({
                    url: '/iam-ext/v1/userext/selectRealName?userId=' + this.state.data[index].project_manager_id,
                    method: 'get'
                }).then((res) => {
                    if (res.data.failed === true) {
                        message.error('查找审批人失败')
                    } else {
                        data[index].project_manager = res.data.realName
                        index++
                        this.setState({
                            data: data
                        }, () => {
                            this.getLeaderName(index)
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                index++
                this.getLeaderName(index)
            }
        } else {
            this.putDataIntoSelect()
        }
    }

    /**
     * 将获取到的项目假期信息放到select的option中
     */
    putDataIntoSelect = () => {
        let option = ''
        let options = []
        this.state.data.map((item) => {
            option = <Option key={item.order} value={item.order.toString()}>{item.project_name}</Option>
            options.push(option)
        })
        this.setState({
            options: options
        }, () => {
            if (this.props.selectedId[0] === undefined) {
                this.setState({
                    title: '新增TS'
                })
            } else {
                this.getTSRecord(this.props.selectedId[0])
            }
        })
    }

    /**
     * 点击提交按钮触发
     * 使modal消失
     * 提交ts表单数据
     */
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue
                }
                let h = new Date().getHours()
                let m = new Date().getMinutes()
                let s = new Date().getSeconds()
                values.date = this.props.selectedDates[0] + ' ' + h + ':' + m + ':' + s
                // console.log(values)
                if (this.props.selectedId[0] === undefined) {
                    this.createTSRecord(values)
                } else {
                    this.updateTSRecord(values)
                }
                this.props.handleOnCancel()
            }
        })
    }

    /**
     * 创建一条TS记录
     */
    createTSRecord = (values) => {
        // console.log(values)
        let data = {}
        let leaveTypes = ['带薪年假', '额外福利年假', '带薪病假', '病假', '事假', '婚假', '陪产假', '丧假', '长病假', '周末及法定节假日']
        this.state.data.map((item) => {
            // console.log(item.order)
            // console.log(Number(values.projectId))
            if (item.order === Number(values.projectId)) {
                if (leaveTypes.includes(item.project_name)) {
                    data.state = 1
                } else {
                    data.state = 0
                }
                data.projectName = item.project_name
                data.projectId = item.project_id
                data.approverId = item.project_manager_id
                data.description = values.description
                data.tsDate = values.date
            }
        })
        // console.log(data)
        axios({
            url: '/demo/v1/ompts/create',
            method: 'post',
            data: data
        }).then((res) => {
            // console.log(res)
            let result = values.date.substring(0, 4) + values.date.substring(5, 7)
            // console.log(this)
            this.props.getMonthTS(result)
            this.props.clearAllSelectedDates()
        }).catch((err) => {
            console.log(err)
        })
    }


    /**
     * 修改一条TS记录
     */
    updateTSRecord = (values) => {
        let data = {}
        let leaveTypes = ['带薪年假', '额外福利年假', '带薪病假', '病假', '事假', '婚假', '陪产假', '丧假', '长病假', '周末及法定节假日']
        this.state.data.map((item) => {
            // console.log(item.order)
            // console.log(Number(values.projectId))
            if (item.order === Number(values.projectId)) {
                if (leaveTypes.includes(item.project_name)) {
                    data.state = 1
                } else  {
                    data.state = 0
                }
                data.projectName = item.project_name
                data.projectId = item.project_id
                data.approverId = item.project_manager_id
                data.description = values.description
                data.tsDate = values.date
                data.id = this.props.selectedId[0]
            }
        })
        axios({
            url: '/demo/v1/ompts/update',
            method: 'post',
            data: data
        }).then((res) => {
            // console.log(res)
            let result = values.date.substring(0, 4) + values.date.substring(5, 7)
            // console.log(this)
            this.props.clearThisStateNames(result)
            this.props.clearAllSelectedDates()
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 点击modal对话框的cancel按钮使对话框消失
     */
    handleOnCancel = () => {
        this.props.handleOnCancel()
    }

    /**
     * 当用户选择的项目变化时自动带出项目经理
     */
    handleOnChange = (value) => {
        this.state.data.some((item) => {
            if (item.order === Number(value)) {
                this.props.form.setFieldsValue({ projectManager: item.project_manager })
                return true
            } else {
                this.props.form.setFieldsValue({ projectManager: '请选择项目' })
                return false
            }
        })
    }



    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            style: { marginBottom: 15, marginTop: 15 },
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            }
        }
        return (
            <Modal
                title={this.state.title}
                visible={this.props.visible}
                destroyOnClose={true}
                onCancel={this.handleOnCancel}
                footer={
                    <Button type={'primary'} onClick={this.handleSubmit}>提交</Button>
                }
            >
                <Form>
                    <Row>
                        <Col>
                            <FormItem className={styles.formItem} {...formItemLayout} label={'日期'}>
                                <DatePicker
                                    open={false}
                                    allowClear={false}
                                    value={moment(this.props.selectedDates[0], 'YYYY-MM-DD')}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem className={styles.formItem} {...formItemLayout} label={'项目列表'}>
                                {getFieldDecorator('projectId', {
                                    rules: [{ required: true, whitespace: true, message: '请选择项目' }]
                                })(
                                    <Select
                                        allowClear={true}
                                        placeholder={'请选择项目'}
                                        onChange={this.handleOnChange}
                                    >
                                        {this.state.options}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem className={styles.formItem} {...formItemLayout} label={'项目经理(审批人)'}>
                                {getFieldDecorator('projectManager', {
                                    initialValue: '选中项目自动带出',
                                    rules: []
                                })(
                                    <Input disabled />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem className={styles.formItem} {...formItemLayout} label={'说明'}>
                                {getFieldDecorator('description', {
                                    initialValue: '',
                                    rules: []
                                })(
                                    <Input.TextArea style={{ height: '150px' }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(TSApplicationDetails)