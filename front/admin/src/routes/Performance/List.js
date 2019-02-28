
import React from 'react'
import {
  Button,
  Form,
  Table,
  Radio,
  Row,
  message,
  Col,
  Icon,
  Modal,
  // Tooltip,
  Input,
  Select,
  // DatePicker
  // Spin
} from 'antd'
import { connect } from 'dva'
import styled from 'styled-components'
import TableLayout from '../../layouts/TableLayout'
import { FormattedMessage } from 'react-intl'
import PromiseView from '../../components/PromiseView'
// import { getList } from './mock'
import axios from 'axios'
import qs from 'qs'
import camelize from 'camelize'
import styles from './list.css'
import styles2 from './list2.less'
import YearPicker from './YearPicker'
import FuLLscreen from '../../components/Fullscreen'

const FormItem = Form.Item
const Search = Input.Search
const monthColumnWidth = 120

const StyledButton = styled(Button)`
  border: 0px;
  background-color: transparent;
  fontSize: 10px;
  &:hover {
    color: red;
    opacity: 0.9;
    background-color: transparent;
  }
  &:focus {
    background-color: transparent;
  }
`

const EditableCell = styled.input`
  /* border: 0px; */
  border: 1px solid transparent;
  text-align: right;
  height: 17px;
  box-shaodow: 0px;
  outline: 0px;
  line-height: 17px;
  background-color: transparent;
  width: ${(props) => monthColumnWidth - 20}px;
  &:focus {
    /* color: #fff; */
    /* background-color: #1890ff; */
    border-color: #1890ff;
  }
`

export default 
@connect(({ user }) => ({ user: user }))
@Form.create()
class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      datas: [],
      count: 0,
      counts: 0,
      isAllLoaded: false,
      page: 0,
      size: 3,
      keyword: '',
      type: '区域',
      year: 2018,
      formChanged: false,
      fixedColumns: [
        {
          dataIndex: 'project',
          fixed: 'left',
          width: 185,
          title: <FormattedMessage id='omp.project.performance.list.project' />,
          render: this.renderProjectCell
        },
        {
          dataIndex: 'time',
          width: 75,
          fixed: 'left',
          // title: <FormattedMessage id='omp.project.performance.list.time' />,
          title: '收支情况',
          render: (text, record, index) => {
            return record.isSummary ? this.renderSummaryTimeCell() : this.renderProjectTimeCell(record, index)
          }
        }, {}
        // ,
        // {
        //   dataIndex: 'total',
        //   width: 120,
        //   fixed: 'left',
        //   title: (
        //     // <div style={{ textAlign: 'right', fontFamily: 'Microsoft YaHei', fontSize: '13px', color: '#333333' }}>汇总{this.state.year}年</div>
        //     <div>{this.yearChoose}</div>
        //   ),
        //   render: this.renderTotalColumns
        // }
      ],
      sideFixedColumns: [
        {
          dataIndex: 'operation',
          width: 60,
          fixed: 'right',
          title: <FormattedMessage id='omp.project.performance.list.operation' />,
          render: (text, record) => {
            return record.isSummary ? '-' : (
              <StyledButton
                type='danger'
                shape='circle'
                onClick={() => message.warning('此功能正在开发中！')}

              // style={{ }}

              >
                <Icon type='delete' style={{ fontSize: 20 }} />
                <br />
                删除
              </StyledButton>
            )
          }
        }
      ],
      monthColumns: [],
      list: [],
      lists: [],
      summary: [],
      summarys: [],
      tableLoading: false,
      mode: "year",
      open: false,
      value: null
    }
  }


  onYearChooseChange = (e) => {
    // console.log(e);
    // console.log(e.format('YYYY'))
    this.setState({
      value: e,
      // open: false
    }, () => {
      this.refreshYear(e.format('YYYY'))
    });
  };


  /**
   * 返回总计年份选择列
   */
  returnYearChoose = () => {
    let fixedColumns = this.state.fixedColumns
    let totalColumn = {
      dataIndex: 'total',
      width: 120,
      fixed: 'left',
      title: (
        <div style={{ textAlign: 'right', fontFamily: 'Microsoft YaHei', fontSize: '13px', color: '#333333' }}>
          汇总:
          <YearPicker onChange={this.onYearChooseChange} />

          {/* <Tooltip title='上一年'>
            <Icon
              onClick={() => this.refreshYear(this.state.year - 1)}
              type='left'
              // style={{ cursor: 'pointer', marginRight: 10, color: '#1890ff', width: 10 }}
              style={{ cursor: 'pointer', marginRight: 6, color: '#1890ff', width: 10 }}
            />
          </Tooltip>
          {this.state.year}
          年
          <Tooltip title='下一年'>
            <Icon
              onClick={() => this.refreshYear(this.state.year + 1)}
              type='right'
              // style={{ cursor: 'pointer', marginLeft: 10, color: '#1890ff', width: 10 }}
              style={{ cursor: 'pointer', marginLeft: 3, color: '#1890ff', width: 10 }}
            />
          </Tooltip> */}
        </div>
      ),
      render: this.renderTotalColumns
    }
    fixedColumns[2] = totalColumn

    this.setState({
      fixedColumns: fixedColumns
    })
  }

  // componentWillMount() {
  //   this.returnYearChoose()
  // }

  fillZero = (str, len) => {
    while (str.length < len) {
      str = `0${str}`
    }
    return str
  }

  renderTotalColumns = (text, record, index) => {
    // this.setState({
    //   row: this.state.row + 1
    // }, () => {
    const { filterType = 'all' } = this.state
    const isAll = filterType === 'all'
    const isSummary = record.id === 'summary'
    // const safeText = {}
    // TODO 把summary的记录也放到data里
    const realRecord = isSummary ? this.state.summary : record

    // console.log(realRecord)
    const values = {
      actural_income: 0,
      billing: 0,
      estimated_income: 0,
      financial_recognition_income: 0,
      receipt: 0,
    }

    Object.values(realRecord).forEach(value => {
      if (typeof value === 'object') {
        if (value.actural_income) values.actural_income += value.actural_income.value
        if (value.billing) values.billing += value.billing.value
        if (value.estimated_income) values.estimated_income += value.estimated_income.value
        if (value.financial_recognition_income) values.financial_recognition_income += value.financial_recognition_income.value
        if (value.receipt) values.receipt += value.receipt.value
      }
    })

    // isAll ? console.log() : console.log(index)

    return (
      <div style={{ marginLeft: '-6px', marginRight: -9, textAlign: 'right' }}>
        {isAll
          ? (
            <React.Fragment>
              <div style={{ paddingRight: 10, height: 20, color: isSummary ? '#333333' : '#666666', fontSize: '12px', fontFamily: 'Microsoft YaHei' }}>{Number(values.estimated_income).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style={{ paddingRight: 10, height: 20, color: isSummary ? '#333333' : '#666666', fontSize: '12px', fontFamily: 'Microsoft YaHei', backgroundColor: 'rgba(0,0,0,0.04)' }}>{Number(values.actural_income).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style={{ paddingRight: 10, height: 20, color: isSummary ? '#333333' : '#666666', fontSize: '12px', fontFamily: 'Microsoft YaHei' }}>{Number(values.financial_recognition_income).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style={{ paddingRight: 10, height: 20, color: isSummary ? '#333333' : '#666666', fontSize: '12px', fontFamily: 'Microsoft YaHei', backgroundColor: 'rgba(0,0,0,0.04)' }}>{Number(values.billing).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style={{ paddingRight: 10, height: 20, color: isSummary ? '#333333' : '#666666', fontSize: '12px', fontFamily: 'Microsoft YaHei' }}>{Number(values.receipt).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </React.Fragment>
          )

          // 只显示当前filterType对应的值
          : <div style={{ paddingRight: 10, height: 20, color: isSummary ? '#333333' : '#666666' }}>
            {Number(values[filterType]).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
        }
      </div>
    )
    // })
  }

  getMonthColumns = (year) => {
    return Array.from({ length: 13 }, (v, k) => {
      const month = this.fillZero(String(k === 12 ? 1 : k + 1), 2)
      const dataIndex = `${year + (k === 12 ? 1 : 0)}-${month}`
      let months = Number(`${month}`) + '月'
      return {
        width: monthColumnWidth,
        title: (
          <div style={{ textAlign: 'right', width: monthColumnWidth, margin: '0 -20px', paddingRight: '14px' }}>
            <div>
              {/* {k === 0
                ? <Tooltip title='上一年'>
                  <Icon
                    onClick={() => this.refreshYear(year - 1)}
                    type='left'
                    style={{ cursor: 'pointer', marginRight: 10, color: '#1890ff', width: 10 }}
                  />
                </Tooltip>
                : <div style={{ display: 'inline-block', width: 10 }} />} */}
              {/* {dataIndex} */}
              {months}
              {/* {k === 12
                ? <Tooltip title='下一年'>
                  <Icon
                    onClick={() => this.refreshYear(year + 1)}
                    type='right'
                    style={{ cursor: 'pointer', marginLeft: 10, color: '#1890ff', width: 10 }}
                  />
                </Tooltip>
                : <div style={{ display: 'inline-block', width: 10 }} />} */}
            </div>
          </div>
        ),
        dataIndex,
        // height: '100%',
        // color: 'red',
        render: this.renderMonthCell(k)
      }
    })
  }

  updateSummaryCell = (dataIndex, key, valueChange) => {
    const { summary } = this.state
    const nextSummary = {}
    Object.keys(summary).forEach(dataIndexKey => {
      // console.log(dataIndexKey, dataIndex)
      if (dataIndexKey === dataIndex) {
        nextSummary[dataIndex] = {
          ...summary[dataIndex],
          [key]: {
            editable: summary[dataIndex][key].editable,
            value: Number(Number(Number(summary[dataIndex][key].value) + valueChange).toFixed(2))
          }
        }
      } else {
        nextSummary[dataIndexKey] = summary[dataIndexKey]
      }
    })
    return nextSummary
  }

  updateListCell = (dataIndex, key, valueChange, projectId) => {
    return this.state.list.slice().map(item => {
      if (item.id === projectId) {
        if (!item[dataIndex]) {
          item[dataIndex] = {
            estimated_income: { editable: true, value: 0 },
            actural_income: { editable: true, value: 0 },
            financial_recognition_income: { editable: true, value: 0 },
            billing: { editable: true, value: 0 },
            receipt: { editable: true, value: 0 }
          }
        }
        item[dataIndex][key].value = Number(Number(Number(item[dataIndex][key].value) + valueChange).toFixed(2))
      }
      return item
    })
  }

  onInputBlur = (e) => {
    const { key, valueChange } = e
    const month = this.fillZero(String(e.month === 12 ? 1 : e.month + 1), 2)
    const dataIndex = `${this.state.year + (e.month === 12 ? 1 : 0)}-${month}`

    this.setState({
      summary: this.updateSummaryCell(dataIndex, key, valueChange),
      list: this.updateListCell(dataIndex, key, valueChange, e.data.projectId),
      updatePromise: new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/omp-projectmanage/v1/ContractAmount/addOrUpdate`, camelize({
            ...e.data,
            projectDate: dataIndex
          }))
          if (res.data.failed) {
            throw new Error(res.data.message)
          }
          resolve(res.data)
        } catch (e) {
          reject(e)
        }
      }),
      updateHandle: (state, data) => {
        if (state === 'rejected') message.error(data.message || '更新失败')
        // if (state === 'resolved') message.success('更新成功')
      }
    })
  }

  refreshYear = (year) => {
    this.setState({
      year,
      list: [],
      summary: {},
      page: 0,
      isAllLoaded: false,
      size: (this.state.page + 1) * this.state.size,
      monthColumns: this.getMonthColumns(year)
    }, this.onFormSubmit)
  }

  componentDidMount() {
    this.onFormSubmit()
  }

  formatList = (list) => {
    const formattedList = list.map(row => {
      const formattedRow = {
        id: row.project.project_id,
        project: row.project
      }
      row.columns.forEach(column => {
        formattedRow[column.month] = column
      })
      return formattedRow
    })
    return formattedList
  }

  formatSummary = (summary) => {
    const formattedSummary = {
      id: 'summary',
      isSummary: true
    }
    summary.columns.forEach(item => {
      formattedSummary[item.project_date] = {}
      Object.keys(item).forEach(key => {
        if (!(key === 'project_date')) {
          formattedSummary[item.project_date][key] = {
            editable: false,
            value: item[key]
          }
        }
      })
    })
    return formattedSummary
  }

  onSearchInputKeyDown = (e) => {
    // if (e.key === 'Enter') {
    this.setState({
      list: [],
      page: 0,
      size: 3,
      // summary: {},
      isAllLoaded: false,
      // count: 0
    }, () => this.onFormSubmit(e, true))
    // })
    // }
  }

  onFormChange = () => {
    this.setState({ formChanged: true })
  }

  onFormSubmit = (e, updateKeyword = false) => {
    // console.log(13)
    // this.onSearchInputKeyDown(e)
    this.returnYearChoose()
    if (e && e.preventDefault) e.preventDefault()
    const { formChanged } = this.state // eslint-disable-line
    this.props.form.validateFields((err, values) => {
      if (err) {
        return message.error('请检查表单输入')
      }
      const { keyword } = this.state
      const { type, keyword: nextKeyword } = values
      const requestKeyword = updateKeyword ? nextKeyword : keyword
      if (updateKeyword) {
        // console.log('表单查询')
        let results = []
        const searchTypeKey = {
          '区域': 'area',
          '项目名称': 'project_name',
          '项目经理': 'project_manager',
          '项目代码': 'project_code',
          '项目事业部': 'project_business_unit',
        }[type]
        let counts = 0
        if (searchTypeKey) {
          for (let i = 0; i < this.state.lists.length; i++) {
            if (this.state.lists[i].project[searchTypeKey].toString().indexOf(requestKeyword) !== -1) {
              counts++
              results.push(this.state.lists[i])
            }
          }
        }

        this.setState({
          count: counts,
          // summary: this.state.summarys,
          list: results
        })
        // console.log(results)
      } else {
        // console.log('非表单查询')
        this.setState({
          year: this.state.year,
          monthColumns: this.getMonthColumns(this.state.year),
          tableLoading: true,
          keyword: requestKeyword,
          type,
          searchHandle: (state, data) => {
            if (state === 'rejected') {
              this.setState({
                tableLoading: false
              })
              return message.error(data.message || '加载失败，请刷新重试')
            } else if (state === 'resolved') {
              // message.success('加载成功')

              const formattedList = this.formatList(data.list)
              // console.log(this.formatSummary(data.summary))
              // console.log(formattedList)
              // console.log(data)
              this.setState({
                // count: data.count,
                lists: formattedList,
                list: [...this.state.list, ...formattedList],
                summarys: this.formatSummary(data.summary),
                summary: this.state.page === 0 ? this.formatSummary(data.summary) : this.state.summary,
                tableLoading: false,
                size: 3,
                isAllLoaded: formattedList.length < 3,
                formChanged: false,
              })
            }
          },
          searchPromise: new Promise(async (resolve, reject) => {
            try {
              // const data = await getList(this.state.year)
              const res = await axios.get(`/omp-projectmanage/v1/ContractAmount/list?${qs.stringify({
                keyword: (!requestKeyword || requestKeyword.trim().length === 0) ? undefined : requestKeyword,
                type,
                // page: this.state.page,
                // size: this.state.size,
                date: `${this.state.year}-01`
              })}`)
              // setTimeout(() => {
              //   reject(new Error('加载失败'))
              // }, 1000)
              if (res.data.failed) {
                throw new Error(res.data.message || '获取失败')
              }
              // console.log(res.data)
              if (res.data.count !== 0)
                this.setState({
                  count: res.data.count,
                  datas: res.data.list
                })
              resolve(res.data)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
      // this.setState({
      //   monthColumns: this.getMonthColumns(this.state.year),
      //   tableLoading: true,
      //   keyword : requestKeyword,
      //   type,
      //   searchHandle: (state, data) => {
      //     if (state === 'rejected') {
      //       this.setState({
      //         tableLoading: false
      //       })
      //       return message.error(data.message || '加载失败，请刷新重试')
      //     } else if (state === 'resolved') {
      //       // message.success('加载成功')
      //       const formattedList = this.formatList(data.list)
      //       this.setState({
      //         list: [...this.state.list, ...formattedList],
      //         summary: this.state.page === 0 ? this.formatSummary(data.summary) : this.state.summary,
      //         tableLoading: false,
      //         size: 3,
      //         isAllLoaded: formattedList.length < 3,
      //         formChanged: false
      //       })
      //     }
      //   },
      //   searchPromise: new Promise(async (resolve, reject) => {
      //     try {
      //       // const data = await getList(this.state.year)
      //       const res = await axios.get(`/omp-projectmanage/v1/ContractAmount?${qs.stringify({
      //         keyword: (!requestKeyword || requestKeyword.trim().length === 0) ? undefined: requestKeyword,
      //         type,
      //         // page: this.state.page,
      //         // size: this.state.size,
      //         date: `${this.state.year}-01`
      //       })}`)
      //       // setTimeout(() => {
      //       //   reject(new Error('加载失败'))
      //       // }, 1000)
      //       if (res.data.failed) {
      //         throw new Error(res.data.message || '获取失败')
      //       }
      //       // console.log(res.data)
      //       if (res.data.count !== 0)
      //       this.setState({
      //         count: res.data.count
      //       })
      //       resolve(res.data)
      //     } catch (e) {
      //       reject(e)
      //     }
      //   })
      // })
    })
  }

  onClickExport = async () => {
    axios.get(`/omp-projectmanage/v1/amount/Excel/${this.state.year}`, {
      responseType: 'blob'
    }).then((response) => {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(new Blob([response.data]))
      let filename = response.headers[`content-disposition`]
      if (filename) {
        filename = filename.split('filename=')[1]
      }
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
    }).catch(e => {
      message.error(e.message || '导出失败')
    })
  }

  onTableChange = () => {

  }

  onClickLoadMore = (e) => {
    this.setState({
      page: this.state.page + 1
    }, () => this.onFormSubmit(e))
  }

  onTypeChange = (e) => {
    this.setState({ filterType: e.target.value })
  }

  renderMonthCell = (month) => (text, record, index) => {
    const { filterType = 'all' } = this.state
    const isAll = filterType === 'all'
    // const isSummary = record.id === 'summary'
    return (
      <div style={{ fontSize: '12px', width: monthColumnWidth, margin: '0 -20px' }}>
        {[
          'estimated_income',
          'actural_income',
          'financial_recognition_income',
          'billing',
          'receipt'
        ].filter(key => {
          return isAll || filterType === key
        }).map((key, index) => {
          const onBlur = (e) => {

            let num = e.target.value.toString()
            if (num.indexOf(',') !== -1) {
              for (let i = 0; i < num.length; i++) {
                num = num.replace(',', '')
              }
            }

            // const nextValue = Number(Number(e.target.value).toFixed(2))
            // const prevValue = !text ? 0 : Number(Number(text[key].value).toFixed(2))
            // e.target.value = nextValue.toFixed(2)


            const nextValue = Number(Number(num).toFixed(2))
            const prevValue = !text ? 0 : Number(Number(text[key].value).toFixed(2))
            e.target.value = nextValue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')


            e.target.setAttribute('readOnly', true)
            this.onInputBlur({
              month,
              key,
              valueChange: nextValue - prevValue,
              data: {
                projectId: record.project.project_id,
                estimated_income: !text ? 0 : text.estimated_income.value,
                actural_income: !text ? 0 : text.actural_income.value,
                financial_recognition_income: !text ? 0 : text.financial_recognition_income.value,
                billing: !text ? 0 : text.billing.value,
                receipt: !text ? 0 : text.receipt.value,
                [key]: nextValue
              }
            })
          }

          const onKeyDown = e => {
            if (e.key === 'Enter') {
              e.target.blur()
            }
          }

          const onDoubleClick = (e) => {
            // console.log(e.target)
            e.target.removeAttribute('readOnly')
          }

          const handleKeyUp = (e) => {
            e.target.value = e.target.value.replace(/[^\d\,.]/g, '')
            onChange(e)
          }

          const onChange = (e) => {
            // let position = e.target.value.toString().indexOf('.')
            // if (position === -1) {
            //   if (parseInt(e.target.value) >= 1000000000) {
            //     e.target.value = e.target.value.toString().substring(0, 9)
            //   }
            // } else {
            //   if (position > 9) {
            //     // e.target.value = e.target.value.toString().substring(0, 9)
            //     // e.target.value = 999999999.99
            //     let position = e.target.value.toString().indexOf('.')
            //     // console.log(position)
            //     e.target.value = e.target.value.toString().substring(0, 9) + e.target.value.toString().substring(position)
            //   }
            // }
            let num = e.target.value.toString()
            let beforeStr = ''
            // console.log(num)

            if (num.indexOf('.') >= 0) {
              beforeStr = num.substring(0, num.indexOf('.'))
              if (beforeStr.indexOf(',') !== -1) {
                for (let i = 0; i < beforeStr.length; i++) {
                  beforeStr = beforeStr.replace(',', '')
                }
              }
              if (num.indexOf('.') > 9) {
                beforeStr = beforeStr.toString().substring(0, 9)
              }
              e.target.value = beforeStr.replace(/(?=(?!\b)(\d{3})+$)/g, ',') + num.substring(num.indexOf('.'))
            } else {
              if (num.indexOf(',') !== -1) {
                for (let i = 0; i < num.length; i++) {
                  num = num.replace(',', '')
                }
              }
              if (parseInt(num) >= 1000000000) {
                num = num.toString().substring(0, 9)
              }
              // console.log(num.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
              e.target.value = num.replace(/(?=(?!\b)(\d{3})+$)/g, ',')
            }
          }

          let defaultValue = 0
          if (text && text[key]) {
            defaultValue = text[key].value || 0
          }
          defaultValue = Number(defaultValue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

          return (
            <div className={styles.inputnumber} key={key} style={{
              textAlign: 'right',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: monthColumnWidth,
              // paddingRight: 20,
              height: 20,
              color: '#666666',
              fontSize: '12px',
              fontFamily: 'Microsoft YaHei',
              backgroundColor: index % 2 === 1 ? 'rgba(0,0,0,0.04)' : undefined
            }}>
              {
                !text
                  ? record.isSummary
                    ? <div style={{ paddingRight: 14, cursor: 'not-allowed' }}>{defaultValue}</div>
                    // ? <div style={{ cursor: 'not-allowed' }}>{defaultValue}</div>
                    : <EditableCell
                      style={{ paddingRight: 14 }}
                      defaultValue={defaultValue}
                      onKeyDown={onKeyDown}
                      onBlur={onBlur}
                      onDoubleClick={onDoubleClick}
                      readOnly
                      // type="number"
                      // max={10}
                      // maxLength={3}
                      // style={{maxLength: 3}}
                      // onkeyup="value=value.replace(/^[0-9,]+$/,'')"
                      onKeyUp={handleKeyUp}
                      onChange={onChange}
                    />
                  : text[key].editable
                    ? <EditableCell
                      // max={10}
                      style={{ paddingRight: 14, color: record.isSummary ? '#333333' : '#666666' }}
                      defaultValue={defaultValue}
                      onKeyDown={onKeyDown}
                      onDoubleClick={onDoubleClick}
                      readOnly
                      // type="number"
                      onBlur={onBlur}
                      // maxLength={3}
                      // style={{maxLength: 3}}
                      onChange={onChange}
                      onKeyUp={handleKeyUp}
                    />
                    : <div style={{ paddingRight: 14, cursor: 'not-allowed', color: record.isSummary ? '#333333' : '#666666' }}>{defaultValue}</div>
                // : <div style={{ cursor: 'not-allowed' }}>{defaultValue}</div>
              }
            </div>
          )
        })}
      </div>
    )
  }

  renderProjectCell = (text, record, index) => {
    const safeText = !text ? {} : text
    const { filterType = 'all' } = this.state
    const isAll = filterType === 'all'
    const isSummary = !text
    if (isSummary) {
      return (
        <div style={{ marginRight: -10 }} >
          {!isAll ? null : <div style={{ height: 20 }} />}
          {!isAll ? null : <div style={{ height: 20 }} />}
          <div style={{ height: 20 }}><strong style={{ fontSize: '12px', color: '#333333' }}>总计</strong></div>
          {!isAll ? null : <div style={{ height: 20 }} />}
          {!isAll ? null : <div style={{ height: 20 }} />}
        </div>
      )
    }
    let projectName = safeText.project_name
    let area = safeText.area
    let projectManager = safeText.project_manager
    let projectCode = safeText.project_code
    let projectBusinessUnit = safeText.project_business_unit
    if (safeText !== {}) {
      if (safeText.project_name.length > 8) {
        projectName = projectName.toString().substring(0, 8) + '...'
      }
      if (safeText.area.length > 8) {
        area = area.toString().substring(0, 8) + '...'
      }
      if (safeText.project_manager.length > 8) {
        projectManager = projectManager.toString().substring(0, 8) + '...'
      }
      if (safeText.project_code.length > 8) {
        projectCode = projectCode.toString().substring(0, 8) + '...'
      }
      if (safeText.project_business_unit.length > 8) {
        projectBusinessUnit = projectBusinessUnit.toString().substring(0, 8) + '...'
      }
    }

    return (
      <div style={{ marginRight: '-10px' }}>
        {isAll ? <div style={{ height: 20 }}>{isSummary ? null : <strong style={{ fontSize: '11px', color: '#333333', lineHeight: '17px', letterSpacing: '0px', fontFamily: 'Microsoft YaHei' }} >区域：</strong>}<span style={{ fontSize: '11px', color: '#666666', lineHeight: '17px', letterSpacing: '0px' }} title={safeText.area}>{area}</span></div> : null}
        <div style={{ backgroundColor: isAll ? 'transparent' : 'transparent', height: isAll ? 20 : 20, marginRight: isAll ? '' : 4 }}>{isSummary ? null : <strong style={{ fontSize: '11px', color: '#333333', lineHeight: '17px', letterSpacing: '0px', fontFamily: 'Microsoft YaHei' }}>项目名称：</strong>}<span style={{ fontSize: '11px', color: '#666666', lineHeight: '17px', letterSpacing: '0px' }} title={safeText.project_name}>{projectName}</span></div>
        {isAll ? <div style={{ height: 20 }}>{isSummary ? null : <strong style={{ fontSize: '11px', color: '#333333', lineHeight: '17px', letterSpacing: '0px', fontFamily: 'Microsoft YaHei' }} >项目经理：</strong>}<span style={{ fontSize: '11px', color: '#666666', lineHeight: '17px', letterSpacing: '0px' }} title={safeText.project_manager}>{projectManager}</span></div> : null}
        {isAll ? <div style={{ backgroundColor: isAll ? 'transparent' : 'transparent', height: 20 }}>{isSummary ? null : <strong style={{ fontSize: '11px', color: '#333333', lineHeight: '17px', letterSpacing: '0px', fontFamily: 'Microsoft YaHei' }}>项目代码：</strong>}<span style={{ fontSize: '11px', color: '#666666', lineHeight: '17px', letterSpacing: '0px' }} title={safeText.project_code}>{projectCode}</span></div> : null}
        {isAll ? <div style={{ height: 20 }}>{isSummary ? null : <strong style={{ fontSize: '11px', color: '#333333', lineHeight: '17px', letterSpacing: '0px', fontFamily: 'Microsoft YaHei' }} >项目事业部：</strong>}<span style={{ marginLeft: '-2px', fontSize: '11px', color: '#666666', lineHeight: '17px', letterSpacing: '0px' }} title={safeText.project_business_unit}>{projectBusinessUnit}</span></div> : null}
      </div>
    )
  }

  // const SummaryTimeCell = this.renderSummaryTimeCell
  renderSummaryTimeCell = () => {
    const { filterType = 'all' } = this.state
    const isAll = filterType === 'all'

    return (
      // <div style={{ margin: '0 -10px' }}>
      <div style={{ marginLeft: '-10px', marginRight: '-10px' }}>
        {isAll || filterType === 'estimated_income' ? <div style={{ fontSize: '12px', height: 20, color: '#333333', lineHeight: '17px', fontFamily: 'Microsoft YaHei' }}><FormattedMessage id='omp.project.performance.list.estimated_income' /></div> : null}
        {isAll || filterType === 'actural_income' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: isAll ? 20 : 20, lineHeight: '17px', backgroundColor: isAll && 'rgba(0,0,0,0.04)', color: '#333333' }}><FormattedMessage id='omp.project.performance.list.actural_income' /></div> : null}
        {isAll || filterType === 'financial_recognition_income' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: 20, color: '#333333', lineHeight: '17px' }}><FormattedMessage id='omp.project.performance.list.financial_recognition_income' /></div> : null}
        {isAll || filterType === 'billing' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', marginTop: isAll ? '' : '-9px', marginBottom: isAll ? '' : '-9px', height: isAll ? 20 : 20, lineHeight: '17px', backgroundColor: isAll && 'rgba(0,0,0,0.04)', color: '#333333' }}><FormattedMessage id='omp.project.performance.list.billing' /></div> : null}
        {isAll || filterType === 'receipt' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: 20, color: '#333333', lineHeight: '17px' }}><FormattedMessage id='omp.project.performance.list.receipt' /></div> : null}
      </div>
    )
  }

  // const ProjectTimeCell = this.renderProjectTimeCell
  renderProjectTimeCell = (record, index) => {
    const { filterType = 'all' } = this.state
    const isAll = filterType === 'all'
    // const isSummary = record.id === 'summary'
    // console.log(isAll)
    return (
      <div style={{ margin: '0 -10px' }}>
        {isAll || filterType === 'estimated_income' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: isAll ? 20 : 20, color: '#666666', lineHeight: '17px' }}><FormattedMessage id='omp.project.performance.list.estimated_income' /></div> : null}
        {isAll || filterType === 'actural_income' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: isAll ? 20 : 20, lineHeight: '17px', backgroundColor: isAll ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0)', color: '#666666' }}><FormattedMessage id='omp.project.performance.list.actural_income' /></div> : null}
        {isAll || filterType === 'financial_recognition_income' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: isAll ? 20 : 20, color: '#666666', lineHeight: '17px' }}><FormattedMessage id='omp.project.performance.list.financial_recognition_income' /></div> : null}
        {isAll || filterType === 'billing' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: isAll ? 20 : 20, lineHeight: '17px', backgroundColor: isAll ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0)', color: '#666666' }}><FormattedMessage id='omp.project.performance.list.billing' /></div> : null}
        {isAll || filterType === 'receipt' ? <div style={{ fontSize: '12px', fontFamily: 'Microsoft YaHei', height: isAll ? 20 : 20, color: '#666666', lineHeight: '17px' }}><FormattedMessage id='omp.project.performance.list.receipt' /></div> : null}
      </div>
    )
  }

  setClass = (record, index) => {
    // console.log(index)
    return (index % 2 === 0) ? styles.red : styles.blue
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const columns = [...this.state.fixedColumns, ...this.state.monthColumns, ...this.state.sideFixedColumns]
    // console.log(this.state.summary)
    // console.log(this.state.list)
    return (
      <FuLLscreen.Consumer>
        {(fullscreenProp) => {
          return (
            <FormattedMessage id="omp.project.performance.title">
              {(title) => (
                <TableLayout
                  title={
                    <span style={{ marginLeft: '32px', fontSize: '16px', color: '#333333', lineHeight: '24px', textAlign: 'left', fontFamily: 'Microsoft YaHei', fontWeight: 'bold', letterSpacing: '0px' }}>
                      {title}
                    </span>
                  }
                  renderTitleSide={() => (
                    <React.Fragment>
                      <img style={{ height: '15px', width: '15px' }} src={require('../../assets/images/icons/fullScreen.png')} alt={'全屏'} onClick={fullscreenProp.open} />
                      {/* <div onClick={fullscreenProp.open}>全屏</div> */}
                      <FormattedMessage id="omp.project.performance.create">
                        {(text) => (
                          <Button ghost icon='plus' type='primary' style={{ border: 0, color: '#2196F3' }} onClick={() => this.props.history.push('/project/performance/add')} ><span style={{ fontSize: 14, fontFamily: 'Microsoft YaHei', lineHeight: '20px', letterSpacing: '0px' }}>{text}</span></Button>
                        )}
                      </FormattedMessage>
                      {process.env.NODE_ENV === 'production'
                        ? null
                        : <span>
                          {/* <Button onClick={() => this.setState({ isModalOpen: !this.state.isModalOpen })}>测试</Button> */}
                          <Modal visible={!!this.state.isModalOpen} onCancel={() => this.setState({ isModalOpen: false })}>
                            <pre>
                              {JSON.stringify({
                                year: this.state.year,
                                page: this.state.page,
                                keyword: this.state.keyword,
                                monthColumns: this.state.monthColumns,
                                type: this.state.type,
                                size: this.state.size
                              }, 2, 2)}
                            </pre>
                          </Modal>
                        </span>
                      }
                    </React.Fragment>
                  )}
                  renderHeaderSide={() => (
                    <PromiseView>
                      {(state, data) => (

                        <Button style={{ color: '#2196f3', fontSize: 14, fontFamily: 'Microsoft YaHei', lineHeight: '20px', letterSpacing: '0px', textAlign: 'left' }} icon='download' onClick={this.onClickExport}>导出数据</Button>
                      )}
                    </PromiseView>
                  )}
                >

                  <PromiseView promise={this.state.searchPromise} onStateChange={this.state.searchHandle}>
                    {(state, data) => (
                      <div className={styles2.performance} style={fullscreenProp.isFullscreen ? { paddingTop: '100px', position: 'fixed', backgroundColor: 'rgba(0,0,0,0.7)', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 } : {}}>
                        <TableLayout.CardHeader>
                          {/* <Form onSubmit={this.onFormSubmit} onChange={this.onFormChange} layout='horizontal'> */}
                          <Form onChange={this.onFormChange} layout='horizontal'>
                            {/* <Row type='flex' style={{ justifyContent: 'center', flexDirection: 'row-reverse' }}>
                            <Col>
                              <Button value='all' onClick={fullscreenProp.close} style={fullscreenProp.isFullscreen ? { background: 'none', fontFamily: 'Microsoft YaHei', textAlign: 'center', borderWidth: '1px', height: '30px', width: '90px', border: '0px', top: '-50px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' } : { display: 'none' }}>
                                <img style={{height: '20px', width: '20px'}} src={require('../../assets/images/icons/exitFullScreen.png')}/>
                              </Button>
                            </Col>
                          </Row> */}
                            <Row type='flex' style={{ justifyContent: 'space-between' }}>

                              <Col >
                                <FormItem>
                                  {getFieldDecorator('filterType', {
                                    initialValue: 'all'
                                  })(
                                    <Radio.Group style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} size='default' onChange={this.onTypeChange}>
                                      <Radio.Button value='all' style={{ fontFamily: 'Microsoft YaHei', textAlign: 'center', paddingTop: '6px', borderWidth: '1px', height: '30px', width: '90px', borderRadius: '2px', marginRight: '4px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' }}>
                                        <FormattedMessage id='omp.project.performance.list.all' />
                                        ({this.state.count})
                                      </Radio.Button>
                                      <Radio.Button value='estimated_income' style={{ fontFamily: 'Microsoft YaHei', textAlign: 'center', paddingTop: '6px', paddingLeft: '6px', paddingRight: '0px', borderWidth: '1px', height: '30px', width: '90px', borderRadius: '2px', marginRight: '4px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' }}>
                                        <FormattedMessage id='omp.project.performance.list.estimated_income' />
                                      </Radio.Button>
                                      <Radio.Button value='actural_income' style={{ fontFamily: 'Microsoft YaHei', textAlign: 'center', paddingTop: '6px', paddingLeft: '6px', paddingRight: '0px', borderWidth: '1px', height: '30px', width: '90px', borderRadius: '2px', marginRight: '4px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' }}>
                                        <FormattedMessage id='omp.project.performance.list.actural_income' />
                                      </Radio.Button>
                                      <Radio.Button value='financial_recognition_income' style={{ fontFamily: 'Microsoft YaHei', textAlign: 'center', paddingTop: '6px', paddingLeft: '2px', paddingRight: '0px', borderWidth: '1px', height: '30px', width: '90px', borderRadius: '2px', marginRight: '4px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' }}>
                                        <FormattedMessage id='omp.project.performance.list.financial_recognition_income' />
                                      </Radio.Button>
                                      <Radio.Button value='billing' style={{ fontFamily: 'Microsoft YaHei', textAlign: 'center', paddingTop: '6px', borderWidth: '1px', height: '30px', width: '90px', borderRadius: '2px', marginRight: '4px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' }}>
                                        <FormattedMessage id='omp.project.performance.list.billing' />
                                      </Radio.Button>
                                      <Radio.Button value='receipt' style={{ fontFamily: 'Microsoft YaHei', textAlign: 'center', paddingTop: '6px', borderWidth: '1px', height: '30px', width: '90px', borderRadius: '2px', marginRight: '4px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' }}>
                                        <FormattedMessage id='omp.project.performance.list.receipt' />
                                      </Radio.Button>
                                      <Button value='all' onClick={fullscreenProp.close} style={fullscreenProp.isFullscreen ? { paddingLeft: '0px', marginLeft: '10px', background: 'rgba(0,0,0,0)', fontFamily: 'Microsoft YaHei', textAlign: 'center', borderWidth: '1px', height: 'auto', width: 'auto', border: '0px', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px' } : { display: 'none' }}>
                                        <img style={{ height: '20px', width: '20px' }} src={require('../../assets/images/icons/exitFullScreen.png')} />
                                      </Button>
                                    </Radio.Group>
                                  )}
                                </FormItem>
                              </Col>

                              <Col>
                                <Row type='flex'>
                                  <Input.Group compact>
                                    {getFieldDecorator('type', {
                                      initialValue: '区域'
                                    })(
                                      <Select size='default' style={{ fontFamily: 'Microsoft YaHei', width: 106, height: 30, color: '#333333', fontSize: '12px', lineHeight: '17px', letterSpacing: '0px', borderRadius: '2px' }}>
                                        <Select.Option key='area' value='区域'>区域</Select.Option>
                                        <Select.Option key='project_name' value='项目名称'>项目名称</Select.Option>
                                        <Select.Option key='project_manager' value='项目经理'>项目经理</Select.Option>
                                        <Select.Option key='project_code' value='项目代码'>项目代码</Select.Option>
                                        <Select.Option key='project_business_unit' value='项目事业部'>项目事业部</Select.Option>
                                      </Select>
                                    )}
                                    {getFieldDecorator('keyword', {
                                      initialValue: ''
                                      // })(<Search onKeyDown={this.onSearchInputKeyDown} onSearch={this.onFormSubmit} placeholder='输入关键词' style={{ width: 200 }} />)}
                                    })(<Search onSearch={this.onSearchInputKeyDown} placeholder='请输入' style={{ width: '192px', height: '26px', borderRadius: '2px' }} />)}
                                  </Input.Group>
                                </Row>
                              </Col>
                            </Row>
                          </Form>
                        </TableLayout.CardHeader>
                        <div>
                          <PromiseView promise={this.state.updatePromise} onStateChange={this.state.updateHandle} >
                            {(updateState, updateData) => (
                              <Table
                                // className={styles.tableScroll}
                                // onScroll={e => console.log(e)}
                                loading={this.state.tableLoading}
                                scroll={{ x: 2000, y: window.innerHeight - 290 }}
                                // scroll={{ x: 2000, y: 598 }}
                                columns={columns}
                                // rowClassName={() => styles.Table__row}
                                dataSource={[this.state.summary, ...this.state.list]}
                                pagination={false}
                                onChange={this.onTableChange}
                                rowClassName={(record, index) => {
                                  // console.log(record)
                                  const { filterType = 'all' } = this.state
                                  const isAll = filterType === 'all'
                                  return isAll ? '' : (index % 2 === 0) ? styles.red : styles.blue
                                }}
                                // onRow={(record) => {
                                //   return {
                                //     onDoubleClick: (e) => { this.handleLinkToDetail(e, record.id) }
                                //   }
                                // }}
                                // footer={() => <div style={{ cursor: 'pointer', textAlign: 'center', marginTop: -15, marginBottom: -20 }} onClick={(e) => {
                                //   if (state === 'pending') {
                                //   } else if (this.state.isAllLoaded) {
                                //   } else {
                                //     this.onClickLoadMore(e)
                                //   }
                                // }}>
                                //   {state === 'pending' ? (
                                //     <div>
                                //       <Icon type='loading' style={{ marginRight: 10 }} />
                                //       正在加载
                                // </div>
                                //   ) : this.state.isAllLoaded
                                //       ? '已加载完毕'
                                //       : '加载更多'}
                                // </div>}
                                rowKey='id'
                              />
                            )}
                          </PromiseView>

                        </div>
                      </div>

                    )}
                  </PromiseView>
                </TableLayout>
              )}
            </FormattedMessage>
          )
        }}

      </FuLLscreen.Consumer>


    )
  }
}
