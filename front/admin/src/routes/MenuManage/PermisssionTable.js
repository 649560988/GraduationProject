import React, {Component} from 'react'
import {Button, Col, Icon, Row, Table, Input} from 'antd'
import styles from './PermissionTable.less'

const Search = Input.Search

class PermissionTable extends Component {
  constructor (props) {
    super(props)
    const value = props.value || {}
    this.state = {
      dataSource: value.dataSource || [],
      displayDataSource: [],
      searchText: undefined,
      selectedRowKeys: value.selectedRowKeys || []
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value

      this.setState({displayDataSource: value.dataSource, selectedRowKeys: value.selectedRowKeys})
      if (!value.searchText) {
        this.setState({value, dataSource: value.dataSource})
      } else {
        this.setState({value, dataSource: this.state.dataSource})
      }
    }
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue))
    }
  }

  // 复选框改变事件
  handleSelectedKeysChange = (selectedRowKeys) => {
    this.props.handleSelectedKeysChange(selectedRowKeys)
    // this.setState({ selectedRowKeys });
    // this.triggerChange({ selectedRowKeys });
  }

  // 渲染 已分配权限列表
  renderPermissionTable = () => {
    const columns = [
      {
        title: '权限',
        key: 'code',
        dataIndex: 'code'
      },
      {
        title: '描述',
        key: 'description',
        dataIndex: 'description',
        width: '45%'
      }
    ]

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.handleSelectedKeysChange
    }

    const pagination = {
      showSizeChanger: true
    }

    return (
      <Table dataSource={this.state.displayDataSource} rowSelection={rowSelection} className={styles.permissionTable}
        rowKey={record => record.code} size='small' columns={columns} pagination={pagination} />
    )
  }

  // 查询框 内容改变 事件
  handleInputChange = (e) => {
    const searchText = e.target.value
    this.setState({searchText}, () => {
      if (searchText === '') {
        const displayDataSource = this.props.value.dataSource
        this.setState({displayDataSource})
      }
    })
  }

  // 查询事件
  handleSearch = () => {
    const {searchText} = this.state
    if (searchText) {
      const displayDataSource = this.props.value.dataSource.filter((item) =>
        item.code.indexOf(searchText) !== -1 || item.description.indexOf(searchText) !== -1
      )
      this.setState({displayDataSource})
    } else {
      const displayDataSource = this.props.value.dataSource
      this.setState({displayDataSource})
    }
  }

  // 清空查询框内容
  clearSearchText = () => {
    this.setState({searchText: undefined, displayDataSource: []}, () => {
      this.handleSearch()
    })
  }

  render () {
    return (
      <div>
        <Row>
          <Col span={6}><span style={{fontSize: 16, paddingLeft: 15}}>{this.state.selectedRowKeys.length} 项权限</span></Col>
          <Col span={10} offset={2}>
            <Search value={this.state.searchText} onChange={this.handleInputChange}
              suffix={this.state.searchText
                ? <Icon key='btnClose' type='close' onClick={this.clearSearchText} style={{marginRight: 5}} /> : null}
              onSearch={this.handleSearch} placeholder='已分配的权限或描述' size='small' />
          </Col>
          <Col span={6} style={{textAlign: 'right'}}>
            <Button type='primary' size='small' onClick={this.props.showAddModal}><Icon type='plus' />添加权限</Button>
          </Col>
        </Row>
        {this.renderPermissionTable()}
      </div>
    )
  }
}

export default PermissionTable
