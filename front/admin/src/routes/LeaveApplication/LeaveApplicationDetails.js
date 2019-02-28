import React from 'react'
import { Form, Row, Col, Select, Input, message, Button, Tooltip, Popconfirm, DatePicker, TimePicker, Upload, Icon, Modal } from 'antd'
import TableLayout from '../../layouts/TableLayout'
// import HourPicker from './HourPicker'
import moment from 'moment'
import { connect } from 'dva/index'
import axios from 'axios/index'
import styles from './detail.css'
import styles2 from './detail.less'
const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(({ user }) => ({
    user: user
}))
class LeaveApplicationDetails extends React.Component {

    /**
     * times: 用户选择了开始时间和结束时间之后算出的合计时长
     * this.props.match.params.flag: 1---创建
     *                               0---编辑
     *                              -1---查看           
     */
    state = {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        times: 0,
        data: {},
        status: 0,
        holidayTypes: [],
        fileList: [],
        previewVisible: false,
        previewImage: '',
        showModal: false,
        imgSrc: '',
        fileName: '',
        attachment: {},
        isAttachmentExist: false
    }

    /***
     *   路径跳转
     */
    linkToChange = url => {
        const { history } = this.props
        history.push(url)
    };

    /**
     * 返回列表页
     */
    handleClickBackBtn = () => {
        this.linkToChange(`/tsmanage/leaverequest`)
    }

    componentDidMount() {
        this.getHolidayType()
        if (this.props.match.params.id !== '0') {
            this.getApplicationInfo()
            this.getAttachment()
        }
    }

    /**
     * 根据id查询请假申请整条记录
     */
    getApplicationInfo = () => {
        axios({
            method: 'get',
            url: '/holiday/v1/ompLeave/' + this.props.match.params.id
        }).then((res) => {
            this.addToForm(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将后台查询的数据加载到form表单中
     */
    addToForm = (data) => {
        // console.log(data)
        let info = {}
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
        }[data.type]
        info.startDate = data.startDate === null ? '' : moment(data.startDate.substring(0, 10), 'YYYY-MM-DD')
        info.startTime = data.startDate === null ? '' : moment(data.startDate.substring(11), 'HH:mm:ss')
        info.endDate = data.endDate === null ? '' : moment(data.endDate.substring(0, 10), 'YYYY-MM-DD')
        info.endTime = data.endDate === null ? '' : moment(data.endDate.substring(11), 'HH:mm:ss')
        info.times = data.times
        info.reason = data.reason
        this.setState({
            data: info,
            startDate: data.startDate.substring(0, 10),
            startTime: data.startDate.substring(11),
            endDate: data.endDate.substring(0, 10),
            endTime: data.endDate.substring(11),
            times: data.times.toString(),
            status: data.status
        })
        // console.log(info)
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
     * 表单提交
     * flag=0: 保存不提交
     * flag=1: 提交
     */
    handleSubmit = (e, flag) => {
        e.preventDefault()
        // console.log(this.props.form.getFieldsValue())
        this.props.form.validateFields((err, fieldsValue) => {
            // console.log(fieldsValue)
            if (!err) {
                const values = {
                    ...fieldsValue
                }
                // console.log(values.startDate.format('YYYY-MM-DD'), values.startTime.format('HH'))
                let start = moment(values.startDate.format('YYYY-MM-DD') + ' ' + values.startTime.format('HH') + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let end = moment(values.endDate.format('YYYY-MM-DD') + ' ' + values.endTime.format('HH') + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let hours = end.diff(start, 'hour')
                // console.log(start.format('YYYY-MM-DD HH:mm:ss'))
                // console.log(end.format('YYYY-MM-DD HH:mm:ss'))
                // console.log(values)
                if (hours < 0) {
                    message.error('开始时间必须早于结束时间')
                } else {
                    if (flag === 0) {
                        this.save(values, start, end)
                    } else if (flag === 1) {
                        this.submit(values, start, end)
                    }
                }
            }
        })
    }

    /**
     * 保存不提交或者编辑
     * 参数中有id时是更新，没有id时是保存
     */
    save = (values, start, end) => {
        let info = {}
        let data = {}
        let successMess = ''
        // console.log(values)
        // console.log(start)
        info.endDate = end.format('YYYY-MM-DD HH:mm:ss')
        info.startDate = start.format('YYYY-MM-DD HH:mm:ss')
        info.times = Number(this.state.times)
        info.reason = values.reason
        info.status = 0
        if (typeof (values.type) === 'string') {
            info.type = {
                '带薪年假': 103,
                '额外福利年假': 104,
                '带薪病假': 105,
                '病假': 106,
                '事假': 107,
                '婚假': 108,
                '陪产假': 109,
                '丧假': 110,
                '长病假': 111
            }[values.type]
        } else {
            info.type = values.type
        }
        // console.log(info)
        // console.log(typeof(info.startDate))
        if (this.props.match.params.id === '0') {
            data = info
            successMess = '创建成功'
        } else {
            data = { ...info, id: Number(this.props.match.params.id) }
            successMess = '修改成功'
        }
        axios({
            method: 'post',
            url: '/holiday/v1/ompLeave/create/0',
            data: data
        }).then((res) => {
            // console.log(res)
            if (res.data.failed === true) {
                message.error(res.data.message)
            } else {
                message.success(successMess)
                this.linkToChange(`/tsmanage/leaverequest`)
                this.attachmentToLeave(res)
            }
        }).catch((err) => {
            console.log(err)
        })

    }
    /**
     * 提交
     */
    submit = (values, start, end) => {
        let data = {}
        let info = {}
        let successMess = ''
        data.startDate = start.format('YYYY-MM-DD HH:mm:ss')
        data.endDate = end.format('YYYY-MM-DD HH:mm:ss')
        data.times = this.state.times
        data.reason = values.reason
        data.status = 1
        if (typeof (values.type) === 'string') {
            data.type = {
                '带薪年假': 103,
                '额外福利年假': 104,
                '带薪病假': 105,
                '病假': 106,
                '事假': 107,
                '婚假': 108,
                '陪产假': 109,
                '丧假': 110,
                '长病假': 111
            }[values.type]
        } else {
            data.type = values.type
        }
        if (this.props.match.params.id === '0') {
            info = data
            successMess = '创建并提交成功'
        } else {
            info = { ...data, id: Number(this.props.match.params.id) }
            successMess = '修改并提交成功'
        }
        axios({
            method: 'post',
            url: '/holiday/v1/ompLeave/create/1',
            data: info
        }).then((res) => {
            // console.log(res)
            if (res.data.failed === true) {
                message.error(res.data.message)
            } else {
                message.success(successMess)
                this.attachmentToLeave(res)
                this.linkToChange(`/tsmanage/leaverequest`)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
    * 重置整个页面
    */
    resetForm = () => {
        // console.log(this.state.fileList)
        this.props.form.resetFields()
        this.props.form.setFieldsValue({
            times: '',
            type: '',
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            reason: ''
        })
        // console.log(this.props.form.getFieldsValue())
        this.removeAllAttachments()
        // this.setState({
        //     times: 0,
        //     startDate: '',
        //     startTime: '',
        //     endDate: '',
        //     endTime: '',
        //     fileList: []
        // })
    }

    /**
     * 在重置的时候清除这条休假申请的所有附件
     */
    removeAllAttachments = () => {
        if (this.state.isAttachmentExist === true) {
            let attachId = 0
            this.state.fileList.map((file, index) => {
                attachId = Number(file.uid.substring(1))
                axios({
                    method: 'delete',
                    url: '/holiday/v1/ompLeave/removeAttach/' + attachId
                }).then((res) => {
                    // console.log(res)
                    if (res.data === 'success') {
                        message.success('附件删除成功')
                        if (index === (this.state.fileList.length - 1)) {
                            this.setState({
                                times: 0,
                                startDate: '',
                                startTime: '',
                                endDate: '',
                                endTime: '',
                                fileList: []
                            })
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            })
        } else {
            this.setState({
                times: 0,
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                fileList: []
            })
        }
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
        // console.log(this.props.form.getFieldsValue())
        this.setState({
            startDate: dateString
        }, () => {
            if (this.state.startDate !== '' && this.state.startTime !== '' && this.state.endDate !== '' && this.state.endTime !== '') {
                let start = moment(this.state.startDate + ' ' + this.state.startTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                let end = moment(this.state.endDate + ' ' + this.state.endTime + ':00:00', 'YYYY-MM-DD HH:mm:ss')
                // console.log(start)
                // console.log(end)
                let hours = end.diff(start, 'hour')
                if (hours <= 0) {
                    message.error('开始时间必须早于结束时间')
                    this.setState({
                        times: '0'
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
                    })
                } else {
                    this.setState({
                        times: hours.toString()
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
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
                    this.setState({
                        times: '0'
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
                    })
                } else {
                    this.setState({
                        times: hours.toString()
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
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
                    this.setState({
                        times: '0'
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
                    })
                } else {
                    this.setState({
                        times: hours
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
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
                    this.setState({
                        times: '0'
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
                    })
                } else {
                    this.setState({
                        times: hours
                    }, () => {
                        this.props.form.setFieldsValue({ times: (this.state.times).toString() })
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
            let positionDot = e.target.value.indexOf('.')//用户输入的小数点的位置
            // console.log(e.target.value.indexOf('0'))
            if (e.target.value.indexOf('0') === 0) {//0开头的去除
                e.target.value = Number(e.target.value)
            }
            if (positionDot > -1) {//包含'.'的去除
                e.target.value = e.target.value.substring(0, positionDot)
            }
        }
    }


    /**
     * 编辑时候的预览弹窗
     */
    handleCancelEdit = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        // console.log(file)
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    /**
     * 获取当前正在编辑的休假申请记录的附件
     */
    getAttachment = () => {
        axios({
            method: 'get',
            url: '/holiday/v1/ompLeave/getAttachment/' + Number(this.props.match.params.id)
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
                    fileList: fileList,
                    isAttachmentExist: true
                })
            } else {
                this.setState({
                    isAttachmentExist: false
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将休假申请和附件关联
     * res保存或提交休假申请之后返回的申请的信息
     */
    attachmentToLeave = (res) => {
        // console.log(res)
        // console.log(this.state.attachment)
        if (this.state.attachment.length > 0) {
            if (this.props.match.params.flag === '1') {
                //新创建的休假申请
                let attachment = this.state.attachment
                attachment.map((item) => {
                    item.mainTableId = res.data.id
                })
                axios({
                    method: 'post',
                    url: '/holiday/v1/ompLeave/attachment',
                    data: attachment
                }).then((res) => {
                    // console.log(res)
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                //正在编辑的已保存的休假申请
                axios({
                    method: 'post',
                    url: '/holiday/v1/ompLeave/attachment',
                    data: this.state.attachment
                }).then((res) => {
                    // console.log(res)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }

    }

    /**
     * 附件内容变化时触发
     * fileList:剩余附件信息
     */
    handleChange = ({ fileList, file, event }) => {
        // console.log(fileList)
        this.setState({ fileList })
        let fileObj = []
        fileList.map((item) => {
            // console.log(item)
            if (item.response) {
                let attachment = {}
                attachment.mainTableId = Number(this.props.match.params.id)
                attachment.attachmentName = item.response.originFileName
                attachment.attachmentPath = item.response.endPoint + 'holiday/' + item.response.fileName
                attachment.attachmentTypeId = 2
                // console.log(attachment)
                fileObj.push(attachment)
            }
        })
        // console.log(fileObj)
        this.setState({
            attachment: fileObj
        })
    }

    /**
     * 规定上传图片的格式和大小
     * file：被删除图片的信息
     */
    beforeUpload = (file) => {
        let types = ['image/jpeg', 'image/gif', 'image/png', 'image/jpg']
        let isJPG = false;
        if (types.includes(file.type)) {
            isJPG = true
        } else {
            message.error('上传文件类型错误')
        }
        // if (!isJPG) {
        //     message.error('You can only upload gif file!');
        // }
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //     message.error('Image must smaller than 2MB!');
        // }
        // if (!(isJPG && isLt2M)) {
        //     this.setState({
        //         fileList: []
        //     })
        // }
        this.setState({
            fileName: file.name
        })
        // return isJPG && isLt2M;
        return isJPG;
    }

    /**
     * 删除附件时的回调
     */
    removeAttachment = (file) => {
        // console.log(file)
        if (this.state.isAttachmentExist === true) {
            let attachId = Number(file.uid.substring(1))
            axios({
                method: 'delete',
                url: '/holiday/v1/ompLeave/removeAttach/' + attachId
            }).then((res) => {
                // console.log(res)
                if (res.data === 'success') {
                    message.success('删除成功')
                }
            }).catch((err) => {
                console.log(err)
            })
        }
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
     * 查看时候的Modal的Cancel操作
     */
    handleCancel = () => {
        this.setState({
            showModal: false,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { previewVisible, previewImage, fileList } = this.state
        const formItemLayout = {
            style: { width: 500, marginBottom: 15 },
            labelCol: {
                span: 24
            },
            wrapperCol: {
                span: 24
            }
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className={'ant-upload-text'}>Upload</div>
            </div>
        )
        let title = ''
        let attachment = ''
        let edit = true
        let buttons = <Row>
            <Col span={24}>
                <FormItem {...formItemLayout}>
                    <Tooltip title={'保存不提交'}>
                        <Button onClick={(e) => this.handleSubmit(e, 0)} type={'primary'}>保存</Button>
                    </Tooltip>
                    <Tooltip title={'提交'}>
                        <Popconfirm title={"请核对页面信息，确认无误后点击'提交'"} okText={'提交'} cancelText={'取消'}
                            onConfirm={(e) => this.handleSubmit(e, 1)}
                        >
                            <Button style={{ marginLeft: '10px' }} type={'primary'}>提交</Button>
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title={'重置'}>
                        <Popconfirm title={'确定要重置整个页面吗'} okText={'是的'} cancelText={'取消'}
                            onConfirm={this.resetForm}
                        >
                            <Button type={'danger'} style={{ marginLeft: '10px' }}>重置</Button>
                        </Popconfirm>
                    </Tooltip>
                </FormItem>
            </Col>
        </Row>
        let action = ''
        if (this.props.match.params.flag === '0') {
            if (this.state.status === 0 || this.state.status === 2) {
                action = buttons
            } else {
                action = ''
            }
            edit = true
            title = '编辑休假申请'
            attachment = <Upload
                accept={'.jpg,.jpeg,.gif,.png'}
                action={process.env.server + '/file/v1/documents?bucket_name=holiday&file_name=' + this.state.fileName}
                headers={{
                    Authorization: `Bearer ${localStorage.getItem('antd-pro-token')}`
                }}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
                onRemove={(file) => this.removeAttachment(file)}
            >
                {fileList.length >= 5 ? null : uploadButton}
            </Upload>
        } else if (this.props.match.params.flag === '1') {
            action = buttons
            edit = true
            title = '创建休假申请'
            attachment = <Upload
                action={process.env.server + '/file/v1/documents?bucket_name=holiday&file_name=' + this.state.fileName}
                listType="picture-card"
                fileList={fileList}
                headers={{
                    Authorization: `Bearer ${localStorage.getItem('antd-pro-token')}`
                }}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
                onRemove={(file) => this.removeAttachment(file)}
                onError={() => {
                    message.error('上传出错')
                }}
            >
                {fileList.length >= 5 ? null : uploadButton}
            </Upload>
        } else if (this.props.match.params.flag === '-1') {
            action = ''
            edit = false
            title = '查看休假申请'
            if (fileList.length > 0) {
                fileList.map((item) => {
                    attachment = [...attachment, <span key={Number(item.uid.substring(1))} style={{ marginRight: '8px' }}>
                        <img src={item.url} style={{ width: '100px', height: '100px' }} />
                        <span className={styles.mask}><Icon id={item.name} onClick={(e) => this.previewAttachment(e, item)} title={'预览附件'} className={styles.eye} type={'eye-o'} /></span>
                    </span>]
                })
            }
        }

        let message = <div style={{ fontStyle: 'italic', color: 'black' }}>
            <p style={{ lineHeight: '0.6' }}><span style={{ color: 'red' }}>*</span>注意：只能上传图片附件(支持多张图片同时上传)</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>1.如果是病假或产检假申请，提交的病例材料可以是原件的复印件或照片</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>2.带薪病假{'>'}=2天必须上传附件，{'<'}2天则无需上传</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>3.如果是婚假，请上传结婚证扫描件或照片</p>
            <p style={{ textIndent: '3em', lineHeight: '0.6' }}>4.图片格式为：JPG、JPEG、GIF、PNG等。</p>
        </div>
        return (
            <TableLayout
                title={title}
                showBackBtn
                onBackBtnClick={this.handleClickBackBtn}
            >
                <Form className={styles2.details}>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'假期类型'}>
                                {getFieldDecorator('type', {
                                    initialValue: this.state.data.type === undefined ? '' : this.state.data.type,
                                    rules: [{ required: true, message: '请选择假期类型!' }]
                                })(
                                    <Select
                                        {...edit === true ? {allowClear: true} : {allowClear: false}}
                                        {...edit === true ? null : { open: false }}
                                        placeholder={'请选择假期类型'}
                                    >
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
                                    {getFieldDecorator('startDate',
                                        this.state.data.startDate === undefined ? { rules: [{ required: true, message: '请选择开始日期!' }] }
                                            : { initialValue: this.state.data.startDate, rules: [{ required: true, message: '请选择开始日期!' }] }
                                    )(
                                        <DatePicker
                                            style={{ width: '300px' }}
                                            placeholder={'请选择时间'}
                                            showToday={true}
                                            format={'YYYY-MM-DD'}
                                            onChange={(date, dateString) => this.getStartDate(date, dateString)}
                                            {...edit === true ? null : { open: false }}
                                            {...edit === true ? null : { allowClear: false }}
                                        />
                                    )}
                                    {getFieldDecorator('startTime',
                                        this.state.data.startTime === undefined ? { rules: [{ required: true, message: '请选择开始时间!' }] }
                                            : { initialValue: this.state.data.startTime, rules: [{ required: true, message: '请选择开始时间!' }] }
                                    )(
                                        <TimePicker
                                            style={{ width: '200px' }}
                                            placeholder={'请选择时刻'}
                                            disabledHours={() => this.disabledHours('start')}
                                            format={'HH'}
                                            onChange={(date, dateString) => this.getStartTime(date, dateString)}
                                            {...edit === true ? null : { open: false }}
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
                                    {getFieldDecorator('endDate',
                                        this.state.data.endDate === undefined ? { rules: [{ required: true, message: '请选择结束日期!' }] }
                                            : { initialValue: this.state.data.endDate, rules: [{ required: true, message: '请选择结束日期!' }] },
                                    )(
                                        // <HourPicker data={this.props.form.endDate} getTime={this.getEndTime} flag={'end'} start1={9} end1={12} start2={13} end2={18} />
                                        <DatePicker
                                            style={{ width: '300px' }}
                                            placeholder={'请选择日期'}
                                            showToday={true}
                                            format={'YYYY-MM-DD'}
                                            onChange={(date, dateString) => this.getEndDate(date, dateString)}
                                            {...edit === true ? null : { open: false }}
                                            {...edit === true ? null : { allowClear: false }}
                                        />
                                    )}
                                    {getFieldDecorator('endTime',
                                        this.state.data.endTime === undefined ? { rules: [{ required: true, message: '请选择结束时刻!' }] }
                                            : { initialValue: this.state.data.endTime, rules: [{ required: true, message: '请选择结束时刻!' }] }
                                    )(
                                        <TimePicker
                                            placeholder={'请选择时刻'}
                                            style={{ width: '200px', height: '32px' }}
                                            disabledHours={() => this.disabledHours('end')}
                                            format={'HH'}
                                            onChange={(date, dateString) => this.getEndTime(date, dateString)}
                                            {...edit === true ? null : { open: false }}
                                        />
                                    )}
                                </Input.Group>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'合计时长(以小时为单位的正整数)'}>
                                {getFieldDecorator('times', {
                                    initialValue: this.state.data.times === undefined ? '' : this.state.data.times.toString(),
                                    rules: [{ required: true, whitespace: true, message: '请输入合计时长(正整数)!' }]
                                })(
                                    <Input
                                        onChange={(e) => this.formatHours(e)}
                                        min={0}
                                        type={'number'}
                                        {...edit === true ? null : { readOnly: true }}
                                        onBlur={(e) => this.formatHours(e)}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem {...formItemLayout} label={'原因说明'}>
                                {getFieldDecorator('reason', {
                                    initialValue: this.state.data.reason === undefined ? '' : this.state.data.reason,
                                    rules: [{ required: true, whitespace: true, message: '请输入请假原因!' }]
                                })(
                                    <Input.TextArea
                                        style={{ height: '100px', resize: 'none' }}
                                        {...edit === true ? null : { readOnly: true }}
                                    />
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
                    {action}
                </Form>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelEdit}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
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
                    <img style={{ width: '400px' }} src={this.state.imgSrc} />
                </Modal>
            </TableLayout >
        )
    }
}

export default Form.create()(LeaveApplicationDetails)
