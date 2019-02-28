import React from 'react'
import TableLayout from '../../layouts/TableLayout'
import styles from './IntlManageList.less'
import {Button, Icon, Input, Select, Table, Tooltip} from 'antd'
import { connect } from 'dva'

@connect(
  ({ intl, loading }) => ({
    list: intl.list,
    pagination: intl.pagination,
    loading: loading.effects['intl/fetch']
  })
)
class IntlManageList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      searchText: undefined,
      searchField: `lang`,
    }
  }

  componentDidMount(){
    const { dispatch, pagination } = this.props
    dispatch({
      type: 'intl/fetch',
      payload: {page: 0, size: pagination.pageSize}
    })
  }

  handleAdd = () => {
    this.props.history.push(`/setting/intl-manage/add`)
  }

  handleSearchTextChange = ( value ) =>{
    this.setState({searchText: value})
  }

  handleSearchFieldChange = (value) => {
    this.setState({searchField: value})
  }

  handleSearch = () => {
    const { dispatch, pagination } = this.props
    let payload = {page: 0, size: pagination.pageSize}
    if(this.state.searchText){
      payload = {...payload, [this.state.searchField]: this.state.searchText}
    }
    dispatch({
      type: 'intl/fetch',
      payload
    })
  }

  renderSearchBar = () => {
    const Option = Select.Option
    const selectBefore = (
      <Select defaultValue={this.state.searchField}
              onChange={this.handleSearchFieldChange}>
        <Option value={`lang`}>{`语言`}</Option>
        <Option value={`code`}>{`编码`}</Option>
        <Option value={`name`}>{`名称`}</Option>
      </Select>
    );
    return (
      <div className={styles.searchBar}>
        <Input.Search addonBefore={selectBefore} onSearch={this.handleSearch}
                      value={this.state.searchText}
                      onChange={e => this.handleSearchTextChange(e.target.value)}/>
      </div>
    )
  }

  handlePaginationChange = (current, pageSize) => {
    const { dispatch } = this.props
    dispatch({
      type: 'intl/fetch',
      payload: {
        page: current - 1,
        size: pageSize,
        [this.state.searchField]:this.state.searchText
      }
    })
  }

  handleEdit = ( index ) => {
    const { dispatch } = this.props
    dispatch({
      type: 'intl/updateSelectedItem',
      payload: index,
      callback: () => {
        this.props.history.push(`/setting/intl-manage/edit`)
      }
    })
  }

  renderIntlTable = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: '',
        key: 'no',
        width:50,
        render: (text, record, index) => (<span>{index + 1}</span>)
      },
      {
        title: '语言',
        dataIndex: 'lang',
        width:'20%'
      },
      {
        title: '编码',
        dataIndex: 'code',
        render: (text, record, index) => (
          <Tooltip placement='bottom' title={record.code}
                   overlayClassName={styles.longTooltip}>
            {record.code}
          </Tooltip>
        )
      },
      {
        title: '名称',
        dataIndex: 'name',
        width:'30%',
        render: (text, record, index) => (
          <Tooltip placement='bottom' title={record.name}
                   overlayClassName={styles.longTooltip}>
            {record.name}
          </Tooltip>
        )
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render:(text,record,index) => (
          <span>
            <Tooltip placement='bottom' title='编辑'>
              <Button onClick={() => this.handleEdit(index)}>
                <Icon type='edit' /></Button>
            </Tooltip>
          </span>
        )
      }
    ]

    const pagination = {
      ...this.props.pagination,
      showSizeChanger: true,
      showTotal: (total, range) => `共${total}条`,
      onChange: (current, pageSize) => this.handlePaginationChange(current, pageSize),
      onShowSizeChange: (current, pageSize) => this.handlePaginationChange(1, pageSize)
    }

    return <Table size={'middle'} dataSource={this.props.list} loading={this.props.loading}
                  columns={columns} pagination={pagination}/>
  }

  render(){
    return (
      <TableLayout title={`多语言设置`}
                   renderTitleSide={() => (
                     <Button type={`primary`} onClick={this.handleAdd}>添加</Button>
                   )}>
        <div className={styles.tableFilterBar}>
          {
            this.renderSearchBar()
          }
        </div>
        { this.renderIntlTable() }
      </TableLayout>
    )
  }
}

export default IntlManageList
