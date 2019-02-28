import React from 'react'
import TableLayout from '../../layouts/TableLayout';
import { Form, Calendar, Button, Checkbox, message, Popover } from 'antd';
import TSApplicationDetails from './TSApplicationDetails'
import styles from './TS.less'
import moment from 'moment';
import axios from 'axios/index'

class TSApplication extends React.Component {

    /**
     * selectedDates: 复选框被选中的日期
     * selectedId: 复选框被选中的id，即该条TS记录的id
     * selectedMonth: 当前日历面板的月份
     * copiedRecordId: 被选中的要进行复制的记录id
     * data: TS数据
     * date: 当前面板的年和月份 格式为'YYYYMM'
     * names： 当月每一天的审批人的姓名数组
     */
    state = {
        selectedDates: [],
        selectedId: [],
        selectedMonth: moment(new Date(), 'YYYY-MM-DD').format('MM'),
        modalVisible: false,
        data: [],
        copiedRecordId: 0,
        date: '',
        names: []
    }

    componentDidMount() {
        let Y = new Date().getFullYear()
        let M = new Date().getMonth() + 1
        let result = Y.toString() + M.toString()
        this.setState({
            date: result
        })
        this.getMonthTS(result)
    }

    /**
     * 清除state中的names
     */
    clearThisStateNames = (date) => {
        this.setState({
            names: []
        }, () => {
            this.getMonthTS(date)
        })
    }

    /**
     * 获取整月的TS记录
     */
    getMonthTS = (date) => {
        axios({
            url: '/demo/v1/ompts/selectBatch/' + date,
            method: 'get'
        }).then((res) => {
            if (res.data.length > 0) {
                this.addToData(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    /**
     * 将后台读取的TS记录存入this.state.data中
     */
    addToData = (records) => {
        let tsRecords = []
        records.map((item, index) => {
            tsRecords.push(item.ompTsE)
        })
        this.setState({
            data: tsRecords,
        }, () => {
            if (this.state.names.length === 0) {
                this.getApproverName(0)
            } else {
                this.getApproverName(this.state.names.length)
            }
        })
    }

    /**
     * 根据approverId去获取审批人的姓名
     */
    getApproverName = (index) => {
        let datas = this.state.data
        if (index < this.state.data.length) {
            if (this.state.data[index].approverId === null) {
                this.setState({
                    names: [...this.state.names, '通过']
                }, () => {
                    index++
                    this.getApproverName(index)
                })
            } else {
                axios({
                    url: '/iam-ext/v1/userext/selectRealName?userId=' + this.state.data[index].approverId,
                    method: 'get'
                }).then((res) => {
                    // console.log(res)
                    if (res.data.failed === true) {
                        message.error('获取审批人失败')
                        index++
                        this.setState({
                            names: [...this.state.names, '获取审批人失败']
                        })
                    } else {
                        index++
                        this.setState({
                            names: [...this.state.names, res.data.realName]
                        }, () => {
                            this.getApproverName(index)
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else {
            datas.map((item, i) => {
                item.projectManager = this.state.names[i]
            })
            this.setState({
                data: datas,
            })
        }


        // Promise.all(this.state.data.map(item => axios({
        //     url: '/iam-ext/v1/userext/selectRealName?userId='+ item.approverId,
        //     method: 'get'
        // }))).then((ress) => {
        //     console.log(ress)
        //     datas.some((item, index) => {
        //         item.projectManager = ress[index].data.realName
        //     })
        //     this.setState({
        //         data: datas
        //     })
        // }).catch((errs) => {
        //     console.log(errs)
        // })
    }

    /**
     * 清除所有选中的日期
     */
    clearAllSelectedDates = () => {
        this.setState({
            selectedDates: [],
            selectedId: [],
            copiedRecordId: 0
        })
    }

    /**
     * 自定义日历控件单元格样式(覆盖)
     */
    dateFullCellRender = (date) => {
        let month = this.state.selectedMonth
        let data = this.state.data
        let info = ''
        let defaultChecked = false
        let id = undefined
        if (date.format('MM') === month) {//保证非本月的单元格不显示任何控件
            data.some((item) => {//向日期中塞入数据
                if (item.tsDate.substring(0, 10) === date.format('YYYY-MM-DD')) {
                    let projectName = item.projectName.length > 8 ? item.projectName.substring(0, 8) + '...' : item.projectName
                    let projectManager = item.projectManager && item.projectManager.length > 5 ? item.projectManager.substring(0, 5) + '...' : item.projectManager
                    let description = item.description.length > 8 ? item.description.substring(0, 8) + '...' : item.description
                    info = <p
                        title={'项目:' + item.projectName + ' 审批人:' + item.projectManager + ' 说明:' + item.description}
                        style={{ fontSize: '12px' }}>
                        项目: {projectName} <br /> 审批人: {projectManager} <br /> 说明: {description}
                    </p>
                    id = item.id.toString()
                    return true
                } else {
                    info = ''
                    id = undefined
                    return false
                }
            })
            this.state.selectedDates.some((item) => {//判断该日期是否被选中
                if (item === date.format('YYYY-MM-DD')) {
                    defaultChecked = true
                    return true
                } else {
                    defaultChecked = false
                    return false
                }
            })
            return (
                <Popover
                    placement={'right'}
                    trigger={'contextMenu'}
                    content={
                        <span>
                            <Button.Group>
                                <Button
                                    onClick={(e) => this.copy(e)}
                                    disabled={this.state.selectedDates.length === 1 ? false : true}
                                >
                                    复制
                                </Button>
                                <Button
                                    onClick={this.paste}
                                    disabled={this.state.selectedDates.length === 0 ? true : false}
                                >
                                    粘贴
                                </Button>
                            </Button.Group>
                        </span>
                    }>
                    <div style={{ height: '120px', width: '100%', textAlign: 'center', borderBottom: '1px solid #D9D9D9' }}>
                        <Checkbox id={id} checked={defaultChecked} onChange={(e) => this.handleTDClick(e, date, id)} style={{ marginTop: 20 }}>{date.format('YYYY-MM-DD')}</Checkbox>
                        {info}
                    </div>
                </Popover>
            )
        }
    }


    /**
     * 复制一条ts记录
     * 获取该ts记录的id
     * selectedDate为复制的单元格中信息数据的对象
     */
    copy = (e) => {
        let id
        if (this.state.selectedDates.length !== 1) {
            message.error('请在本月选择一条记录进行复制')
        } else {
            this.state.data.some((item, index) => {
                if (item.tsDate.substring(0, 10) === this.state.selectedDates[0]) {
                    id = item.id
                    return true
                } else {
                    id = undefined
                    return false
                }
            })
            if (id === undefined) {
                message.error('所选日期无TS记录复制失败')
            } else {
                message.success('复制成功')
                // message.info(id)
                this.setState({
                    copiedRecordId: id
                })
            }
        }
    }

    /**
     * 粘贴
     * 必须选择至少一条记录粘贴
     */
    paste = () => {
        if (this.state.selectedDates.length === 0) {
            message.error('请在本月选择至少一条记录进行粘贴')
        } else {
            if (this.state.copiedRecordId === 0) {
                message.error('请先在本月选择一条记录进行复制')
            } else {
                let selectedDates = []
                this.state.selectedDates.map((item) => {
                    item = item + ' ' + '00:00:00'
                    selectedDates.push(item)
                })
                this.setState({
                    selectedDates: selectedDates
                }, () => {
                    axios({
                        url: '/demo/v1/projectSource/bathCreate/' + this.state.copiedRecordId,
                        method: 'post',
                        data: {
                            listDate: this.state.selectedDates
                        }
                    }).then((res) => {
                        if (res.data.failed === true) {
                            message.error(res.data.message)
                            this.clearAllSelectedDates()
                        } else {
                            message.success('粘贴成功')
                            this.clearAllSelectedDates()
                            this.clearThisStateNames(this.state.date)
                        }

                    }).catch((err) => {
                        console.log(err)
                    })
                })

            }
        }
    }

    /**
     * 日期单元格的点击事件
     * 切换checkbox的选中状态，并以此改变被选中的日期
     */
    handleTDClick = (e, date) => {
        let exist = false
        if (e.target.checked === true) {
            this.state.selectedDates.some((item) => {
                if (item === date.format('YYYY-MM-DD')) {
                    exist = true
                    return true
                } else {
                    exist = false
                    return false
                }
            })
            if (exist === false) {
                this.setState({
                    selectedDates: [...this.state.selectedDates, date.format('YYYY-MM-DD')],
                    selectedId: [...this.state.selectedId, e.target.id],
                })
            }
        } else if (e.target.checked === false) {
            this.state.selectedDates.some((item) => {
                if (item === date.format('YYYY-MM-DD')) {
                    exist = true
                    return true
                } else {
                    exist = false
                    return false
                }
            })
            if (exist === true) {
                let selectedDates = []
                let selectedId = []
                this.state.selectedDates.map((item) => {
                    if (item !== date.format('YYYY-MM-DD')) {
                        selectedDates.push(item)
                    }
                })
                this.state.selectedId.map((id) => {
                    if (id !== e.target.id) {
                        selectedId.push(id)
                    }
                })
                this.setState({
                    selectedDates,
                    selectedId
                })
            }
        }
    }

    /**
     * 月份切换时获取选定的月份用来限定日历面板显示效果
     */
    onPanelChange = (date) => {
        this.setState({
            selectedMonth: date.format('MM'),
            selectedDates: [],
            selectedId: [],
            copiedRecordId: 0,
            date: date.format('YYYYMM'),
            names: []
        }, () => {
            this.getMonthTS(this.state.date)
        })
    }

    /**
     * 点击日历单元格的回调事件
     * 月份切换时获取选中的月份
     * 清空选中的日期
     */
    onSelect = (date) => {
        if (date.format('MM') !== this.state.selectedMonth) {
            this.setState({
                selectedMonth: date.format('MM'),
                selectedDates: [],
                selectedId: [],
                copiedRecordId: 0,
                date: date.format('YYYYMM'),
                names: []
            }, () => {
                this.getMonthTS(this.state.date)
            })
        } 
        // else {
        //     console.log(123)
        //     this.setState({
        //         selectedMonth: date.format('MM'),
        //         date: date.format('YYYYMM')
        //     }, () => {
        //         this.getMonthTS(this.state.date)
        //     })
        // }
    }

    /**
     * 设置子组件的modal的visible属性为false
     * 隐藏modal
     */
    handleOnCancel = () => {
        this.setState({
            modalVisible: false
        })
    }

    /**
     * 显示modal进行TS填写
     * 只能选择选择一且仅一天填写TS
     */
    handleOnShowModal = () => {
        if (this.state.selectedDates.length === 0) {
            message.error('请先选择日期再进行TS填写')
        } else if (this.state.selectedDates.length === 1) {
            this.setState({
                modalVisible: true
            })
        } else if (this.state.selectedDates.length > 1) {
            message.error('只能选择一天进行TS填写，如果想批量操作，请勾选要复制的日期右击')
        }
    }



    render() {
        let detailsPage = ''
        if (this.state.modalVisible === true) {
            detailsPage = <TSApplicationDetails
                handleOnCancel={this.handleOnCancel}
                visible={this.state.modalVisible}
                selectedDates={this.state.selectedDates}
                selectedId={this.state.selectedId}
                getMonthTS={this.getMonthTS}
                clearAllSelectedDates={this.clearAllSelectedDates}
                clearThisStateNames={this.clearThisStateNames}
            />
        } else if (this.state.modalVisible === false) {
            detailsPage = undefined
        }
        return (
            <TableLayout
                title={'Timesheet填写'}
                renderTitleSide={() => (
                    <Button type='primary' ghost icon='plus' style={{ border: 0, fontWeight: 'bold' }} onClick={this.handleOnShowModal}>
                        <span style={{ fontSize: 16, fontFamily: '微软雅黑' }}>填写TS</span>
                    </Button>
                )}
            >
                <Calendar
                    className={styles.ts}
                    mode={'month'}
                    onSelect={this.onSelect}
                    dateFullCellRender={this.dateFullCellRender}
                    onPanelChange={this.onPanelChange}
                />
                {detailsPage}
            </TableLayout>
        )
    }
}

export default Form.create()(TSApplication)