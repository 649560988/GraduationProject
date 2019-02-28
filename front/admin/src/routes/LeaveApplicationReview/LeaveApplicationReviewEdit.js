import React from 'react'
import { Form, Row, Col, Select, Input, message, Button, DatePicker, TimePicker, Icon, Modal } from 'antd'
import TableLayout from '../../layouts/TableLayout'
// import HourPicker from './HourPicker'
import moment from 'moment'
import { connect } from 'dva/index'
import axios from 'axios/index'
import styles from './review.css';
import styles2 from './review.less';
const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
    user: user
}))
class LeaveApplicationReviewEdit extends React.Component {

    /**
     * times: 用户选择了开始时间和结束时间之后算出的合计时长
     * record: 从列表页带过来的流程信息
     */
    state = {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        times: 0,
        data: {},
        status: 0,
        imageUrl: '',
        holidayTypes: [],
        showModal: false,
        imgSrc: '',
        record: {
            taskId: this.props.match.params.taskId,
            taskName: this.props.match.params.taskName,
            procInstId: this.props.match.params.procInstId
        },
        fileList: []
    }

    /***
     *   路径跳转
     */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };

    componentDidMount() {
        this.getHolidayType()
        this.getApplicationByProInstId()
    }

    /**
     * 获取当前正在编辑的休假申请记录的附件
     */
    getAttachment = (id) => {
        axios({
            method: 'get',
            url: '/holiday/v1/ompLeave/getAttachment/' + id
        }).then((res) => {
            // console.log(res)
            if (res.data.length > 0) {
                let fileList = []
                res.data.map((item) => {
                    let file = {}
                    file.uid = '-' + item.id
                    file.name = item.attachmentName
                    file.status = 'done'
                    file.url = item.attachmentPath
                    fileList.push(file)
                })
                this.setState({
                    fileList: fileList
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 根据procInstId去获取整条休假申请的详情
     * procInstId从state的record中取
     */
    getApplicationByProInstId = () => {
        axios({
            method: 'get',
            url: '/holiday/v1/ompLeave/selectSelfByProInstId/' + this.state.record.procInstId
        }).then((res) => {
            // console.log(res)
            if (res.data.failed === true) {
                message.error('获取数据失败')
            } else {
                this.getApplicantName(res.data)
                this.getAttachment(res.data.id)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 获取申请人的姓名
     */
    getApplicantName = (data) => {
        axios({
            method: 'get',
            url: '/iam-ext/v1/userext/' + data.userId
        }).then((res) => {
            // console.log(res)
            if (res.data === '') {
                message.error('获取用户信息失败')
            } else {
                this.addToForm(data, res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将数据填入表单中
     * leaveData:休假记录的业务数据
     * userInfo: 申请人的信息
     */
    addToForm = (leaveData, userInfo) => {
        // console.log(userInfo)
        // console.log(leaveData)
        let info = {}
        info.person = userInfo.realName
        info.type = {
            103: '带薪年假',
            104: '额外福利年假',
            105: '带薪病假',
            106: '病假',
            107: '事假',
            108: '婚假',
            109: '陪产假',
            110: '丧假',
            111: '长病假'
        }[leaveData.type]
        info.startDate = leaveData.startDate === null ? '' : moment(leaveData.startDate.substring(0, 10), 'YYYY-MM-DD')
        info.startTime = leaveData.startDate === null ? '' : moment(leaveData.startDate.substring(11), 'HH:mm:ss')
        info.endDate = leaveData.endDate === null ? '' : moment(leaveData.endDate.substring(0, 10), 'YYYY-MM-DD')
        info.endTime = leaveData.endDate === null ? '' : moment(leaveData.endDate.substring(11), 'HH:mm:ss')
        info.times = leaveData.times.toString()
        info.reason = leaveData.reason
        this.setState({
            data: info
        })
    }

    /**
     * 表单提交
     * result:true同意
     * result:false驳回
     */
    handleSubmit = (e, result) => {
        e.preventDefault()
        // console.log(result)
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                const values = {
                    ...fieldsValue
                }
                // console.log(values)
                this.review(result, values)
            }
        })
    }

    /**
     * 根据taskName判断是一级还是二级审核
     * 整合审核需要提交的数据
     */
    review = (result, values) => {
        // console.log(this.state.record)
        let info = {}
        let applicationDTO = {}
        info.taskId = this.state.record.taskId
        info.taskName = this.state.record.taskName
        applicationDTO.procInstId = this.state.record.procInstId
        if (this.state.record.taskName === '上级领导审核') {
            applicationDTO.auditIsPassFirst = result
            applicationDTO.auditOpinionFirst = values.opinion
        } else if (this.state.record.taskName === '人事审核') {
            applicationDTO.auditIsPassSecond = result
            applicationDTO.auditOpinionSecond = values.opinion
        }
        info.applicationDTO = applicationDTO
        // console.log(info)
        this.audit(info)
    }

    /**
     * 调用审核接口提交审核人的审核结果和审核意见
     */
    audit = (info) => {
        axios({
            method: 'post',
            url: '/holiday/v1/ompLeave/Auditor',
            data: info
        }).then((res) => {
            // console.log(res)
            if (res.data === true) {
                message.success('审核成功')
                this.linkToChange(`/tsmanage/leaveapproval`)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 重置整个页面
     */
    resetForm = () => {
        this.props.form.resetFields()
        this.setState({
            times: 0
        })
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    /**
     * 请假的开始时间
     * start1: 早上上班时间
     * end1: 中午下班时间
     * start2: 中午上班时间
     * end2: 晚上下班时间
     * 若无午休时间则end1 = start2
     */
    hourRangeStart = () => {
        let hours = []
        let start1 = 9
        let end1 = 12
        let start2 = 13
        let end2 = 18
        for (let i = 0; i < start1; i++) {
            hours.push(i)
        }
        for (let i = end1; i < start2; i++) {
            hours.push(i)
        }
        for (let i = end2; i <= 24; i++) {
            hours.push(i)
        }
        return hours
    }

    /**
     * 请假的结束时间
     */
    hourRangeEnd = () => {
        let hours = []
        let start1 = 9
        let end1 = 12
        let start2 = 13
        let end2 = 18
        for (let i = 0; i <= start1; i++) {
            hours.push(i)
        }
        for (let i = end1 + 1; i <= start2; i++) {
            hours.push(i)
        }
        for (let i = end2 + 1; i <= 24; i++) {
            hours.push(i)
        }
        return hours
    }

    /**
     * 控制不允许选择的时间点
     */
    disabledTime(flag) {
        return {
            hideDisabledOptions: true,
            disabledHours: () => flag === 'start' ? this.hourRangeStart() : this.hourRangeEnd(),
            disabledMinutes: () => this.range(0, 60),
            disabledSeconds: () => this.range(0, 60)
        }
    }

    /**
     * 不允许选择的小时
     */
    disabledHours = (flag) => {
        if (flag === 'start') {
            return this.hourRangeStart()
        } else if (flag === 'end') {
            return this.hourRangeEnd()
        }
    }

    /**
     * 获取开始日期
     */
    getStartDate = (date, dateString) => {
        // console.log('获取到了开始时间' + dateString)
        this.setState({
            startDate: dateString
        }, () => {
            if (this.state.startDate !== '' && this.state.startTime !== '' && this.state.endDate !== '' && this.state.endTime !== '') {
                let start = moment(this.state.startDate + ' ' + this.state.startTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let end = moment(this.state.endDate + ' ' + this.state.endTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let hours = end.diff(start, 'hour')
                if (hours <= 0) {
                    message.error('开始时间必须早于结束时间')
                } else {
                    this.setState({
                        times: hours
                    })
                }
            }
        })
    }

    /**
     * 获取开始时刻
     */
    getStartTime = (date, dateString) => {
        // console.log('获取到了开始时刻' + dateString)
        this.setState({
            startTime: dateString
        }, () => {
            if (this.state.startDate !== '' && this.state.startTime !== '' && this.state.endDate !== '' && this.state.endTime !== '') {
                let start = moment(this.state.startDate + ' ' + this.state.startTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let end = moment(this.state.endDate + ' ' + this.state.endTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let hours = end.diff(start, 'hour')
                if (hours <= 0) {
                    message.error('开始时间必须早于结束时间')
                } else {
                    this.setState({
                        times: hours
                    })
                }
            }
        })
    }

    /**
     * 获取结束日期
     */
    getEndDate = (date, dateString) => {
        // console.log('获取到了结束时间' + dateString)
        this.setState({
            endDate: dateString
        }, () => {
            if (this.state.startDate !== '' && this.state.startTime !== '' && this.state.endDate !== '' && this.state.endTime !== '') {
                let start = moment(this.state.startDate + ' ' + this.state.startTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let end = moment(this.state.endDate + ' ' + this.state.endTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let hours = end.diff(start, 'hour')
                if (hours <= 0) {
                    message.error('开始时间必须早于结束时间')
                } else {
                    this.setState({
                        times: hours
                    })
                }
            }
        })
    }

    /**
     * 获取结束时刻
     */
    getEndTime = (date, dateString) => {
        // console.log('获取到了结束时刻' + dateString)
        this.setState({
            endTime: dateString
        }, () => {
            if (this.state.startDate !== '' && this.state.startTime !== '' && this.state.endDate !== '' && this.state.endTime !== '') {
                let start = moment(this.state.startDate + ' ' + this.state.startTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let end = moment(this.state.endDate + ' ' + this.state.endTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let hours = end.diff(start, 'hour')
                if (hours <= 0) {
                    message.error('开始时间必须早于结束时间')
                } else {
                    this.setState({
                        times: hours
                    })
                }
            }
        })
    }

    /**
     * 格式化用户输入合计时长
     */
    formatHours = (e) => {
        // console.log(e.target.value)
        let reg = /^(0|[1-9][0-9]*)$/
        if (reg.test(e.target.value)) {
            // console.log(reg.test(e.target.value))
        } else if (!reg.test(e.target.value)) {
            // console.log('错误')
            // console.log(e.target.value.indexOf('0'))
            if (e.target.value.indexOf('0') === 0) {//0开头的去除
                e.target.value = Number(e.target.value)
            }
            if (e.target.value.indexOf('.') > -1) {//包含'.'的去除
                e.target.value = e.target.value.substring(0, e.target.value.indexOf('.'))
            }
        }
    }

    /**
     * 获取假期类型
     */
    getHolidayType = () => {
        let holidayTypes = []
        let option = ''
        axios({
            method: 'get',
            url: '/attr/v1/sources/queryBySourceName?sourceName=假期类型'
        }).then((res) => {
            // console.log(res.data.sourceSubList)
            res.data.sourceSubList.map((item) => {
                option = <Option key={item.id} value={item.id}>{item.sourceSubName}</Option>
                holidayTypes.push(option)
            })
            this.setState({
                holidayTypes: holidayTypes
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 返回列表页
     */
    handleClickBackBtn = () => {
        this.linkToChange(`/tsmanage/leaveapproval`)
    }

    /**
     * 预览附件
     */
    previewAttachment = (e, item) => {
        this.setState({
            showModal: true,
            imgSrc: item.url
        })
    }

    /**
     * Modal的Cancel操作
     */
    handleCancel = () => {
        this.setState({
            showModal: false,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { fileList } = this.state
        const formItemLayout = {
            style: { width: 500, marginBottom: 15 },
            labelCol: {
                span: 24
            },
            wrapperCol: {
                span: 24
            }
        }

        let message = <div style={{ fontStyle: 'italic', color: 'black' }}>
            <p style={{ lineHeight: '0.6' }}><span style={{ color: 'red' }}>*</span>注意：只能上传图片附件(支持多张图片同时上传)</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>1.如果是病假或产检假申请，提交的病例材料可以是原件的复印件或照片</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>2.带薪病假{'>'}=2天必须上传附件，{'<'}2天则无需上传</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>3.如果是婚假，请上传结婚证扫描件或照片</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>4.图片格式为：JPG、JPEG、GIF、PNG等。</p>
        </div>

        let attachment = []
        if (fileList.length > 0) {
            fileList.map((item) => {
                attachment = [...attachment, <span key={Number(item.uid.substring(1))} style={{ marginRight: '8px' }}>
                    <img src={item.url} style={{ width: '100px', height: '100px' }} />
                    <span className={styles.mask}><Icon id={item.name} onClick={(e) => this.previewAttachment(e, item)} title={'预览附件'} className={styles.eye} type={'eye-o'} /></span>
                </span>]
            })
        }


        return (
            <TableLayout
                title={'休假申请审核'}
                showBackBtn
                onBackBtnClick={this.handleClickBackBtn}
            >
                <Form className={styles2.details}>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'申请人'}>
                                {getFieldDecorator('person', {
                                    initialValue: this.state.data.person,
                                    rules: [{ required: true, message: '请输入申请人!' }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'假期类型'}>
                                {getFieldDecorator('type', {
                                    initialValue: this.state.data.type,
                                    rules: [{ required: true, message: '请选择假期类型!' }]
                                })(
                                    <Select open={false} placeholder={'请选择假期类型'}>
                                        {this.state.holidayTypes}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'开始日期'}>
                                <Input.Group compact>
                                    {getFieldDecorator('startDate', {
                                        initialValue: moment(this.state.data.startDate, 'YYYY-MM-DD'),
                                        rules: [{ required: true, message: '请选择开始日期!' }]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            open={false}
                                            style={{ width: '300px' }}
                                            placeholder={'请选择时间'}
                                            showToday={true}
                                            format={'YYYY-MM-DD'}
                                            onChange={(date, dateString) => this.getStartDate(date, dateString)}
                                        />
                                    )}
                                    {getFieldDecorator('startTime', {
                                        initialValue: moment(this.state.data.startTime, 'HH'),
                                        rules: [{ required: true, message: '请选择开始时间!' }]
                                    })(
                                        <TimePicker
                                            allowClear={false}
                                            open={false}
                                            style={{ width: '200px' }}
                                            placeholder={'请选择时刻'}
                                            disabledHours={() => this.disabledHours('start')}
                                            format={'HH'}
                                            onChange={(date, dateString) => this.getStartTime(date, dateString)}
                                        />
                                    )}
                                </Input.Group>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'结束时间'}>
                                <Input.Group compact>
                                    {getFieldDecorator('endDate', {
                                        initialValue: moment(this.state.data.endDate, 'YYYY-MM-DD'),
                                        rules: [{ required: true, message: '请选择结束日期!' }]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            open={false}
                                            style={{ width: '300px' }}
                                            placeholder={'请选择日期'}
                                            showToday={true}
                                            format={'YYYY-MM-DD'}
                                            onChange={(date, dateString) => this.getEndDate(date, dateString)}
                                        />
                                    )}
                                    {getFieldDecorator('endTime', {
                                        initialValue: moment(this.state.data.endTime, 'HH'),
                                        rules: [{ required: true, message: '请选择结束时刻!' }]
                                    })(
                                        <TimePicker
                                            allowClear={false}
                                            open={false}
                                            placeholder={'请选择时刻'}
                                            style={{ width: '200px' }}
                                            disabledHours={() => this.disabledHours('end')}
                                            format={'HH'}
                                            onChange={(date, dateString) => this.getEndTime(date, dateString)}
                                        />
                                    )}
                                </Input.Group>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'合计时长(以小时为单位)'}>
                                {getFieldDecorator('times', {
                                    initialValue: this.state.data.times,
                                    rules: [{ required: true, whitespace: true, message: '请输入合计时长(正整数)!' }]
                                })(
                                    <Input readOnly={true} onChange={(e) => this.formatHours(e)} min={0} type={'number'} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'原因说明'}>
                                {getFieldDecorator('reason', {
                                    initialValue: this.state.data.reason,
                                    rules: [{ required: true, whitespace: true, message: '请输入请假原因!' }]
                                })(
                                    <Input.TextArea readOnly={true} style={{ height: '100px' }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label={'附件'}>
                                {message}
                                {attachment}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'审核意见'}>
                                {getFieldDecorator('opinion', {
                                    initialValue: '',
                                    rules: [{ required: true, whitespace: true, message: '请输入审核意见!' }]
                                })(
                                    <Input.TextArea style={{ height: '100px' }} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout}>
                                <Button onClick={(e, result) => this.handleSubmit(e, true)} type={'primary'}>同意</Button>
                                <Button onClick={(e, result) => this.handleSubmit(e, false)} type={'danger'} style={{ marginLeft: '10px' }}>驳回</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    width={500}
                    style={{ paddingLeft: 50 }}
                    visible={this.state.showModal}
                    onCancel={this.handleCancel}
                    footer={
                        <Button onClick={this.handleCancel} type={'primary'}>预览完毕</Button>
                    }
                    destroyOnClose={true}
                >
                    <img style={{ height: '400px' }} src={this.state.imgSrc} />
                </Modal>
            </TableLayout>
        )
    }
}

export default Form.create()(LeaveApplicationReviewEdit)