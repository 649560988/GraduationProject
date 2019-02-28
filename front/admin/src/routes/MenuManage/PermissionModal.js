import React, {Component} from 'react'
import { Col, Icon, Row, Table, Input, Modal } from 'antd'
import styles from './PermissionModal.less'

const Search = Input.Search

class PermissionModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      displayDataSource: [],
      searchText: undefined,
      selectedRowKeys: []
    }
  }

  componentDidMount () {
    const { dataSource, selectedRowKeys } = this.props
    this.setState({dataSource, displayDataSource: dataSource, selectedRowKeys})
  }

  // 复选框改变事件
  handleSelectedKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  // 渲染权限列表
  renderPermissionTable = () => {
    const columns = [
      {
        title: '权限',
        key: 'code',
        dataIndex: 'code',
        width: '50%'
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
    }

    return (
      <Table dataSource={this.state.displayDataSource} rowSelection={rowSelection}
        rowKey={record => record.code} size='small' columns={columns} pagination={pagination} />
    )
  }

  // 查询框 内容改变 事件
  handleInputChange = (e) => {
    const searchText = e.target.value
    this.setState({searchText}, () => {
      if (searchText === '') {
        const displayDataSource = this.state.dataSource
        this.setState({displayDataSource})
      }
    })
  }

  // 查询事件
  handleSearch = () => {
    const {searchText} = this.state
    if (searchText) {
      const displayDataSource = this.state.dataSource.filter((item) =>
        item.code.indexOf(searchText) !== -1 || item.description.indexOf(searchText) !== -1
      )
      this.setState({displayDataSource})
    } else {
      const displayDataSource = this.state.dataSource
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
    const {selectedRowKeys} = this.state
    return (
      <Modal title='添加权限' visible width='60%' style={{top: 50}} className={styles.permissionModal}
        onOk={() => this.props.onOk(selectedRowKeys)} onCancel={this.props.onCancel}>
        <Row style={{marginBottom: 10}}>
          <Col span={6}><span style={{fontSize: 16}}>已选择 {this.state.selectedRowKeys.length} 项权限</span></Col>
          <Col span={10} offset={8}>
            <Search value={this.state.searchText} onChange={this.handleInputChange}
              suffix={this.state.searchText
                ? <Icon key='btnClose' type='close' onClick={this.clearSearchText} style={{marginRight: 5}} /> : null}
              onSearch={this.handleSearch} placeholder='查询权限或描述' size='small' />
          </Col>
        </Row>
        {this.renderPermissionTable()}
      </Modal>
    )
  }
}

export default PermissionModal
