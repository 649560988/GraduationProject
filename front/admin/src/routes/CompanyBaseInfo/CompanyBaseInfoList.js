import React from 'react';
import { Table, Icon, Input, Form,Row, Col, Button, Tooltip, Popconfirm } from 'antd';
import { connect } from 'dva';
import axios from 'axios';
import styles from './CompanyBaseInfoList.css';
const FormItem = Form.Item;


/****
 * created by weimeng on 2018/7/4
 *
 * 客户信息查询及显示页面
 * 提供条件查询，双击每一条记录进入对应的明细页面
 */
@Form.create()
@connect(({ user }) => ({
  user: user
}))
class CompanyBaseInfoList extends React.Component{


  columns = [
    {
      title: '序号',
      dataIndex: 'order',
      width: '10%',
    },
    {
      title: '客户编号',
      dataIndex: 'customerNo',
      width: '10%',
    },
    {
      title: '公司名称',
      dataIndex: 'corporateName',
      width: '20%',
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      width: '12%',
    },
    {
      title: '联系人电话',
      dataIndex: 'contactsTel',
      width: '15%',
    },
    {
      title: '联系人邮箱',
      dataIndex: 'contactsEmail',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '200',
      render: (text, record) => {
        const btnUpdate = (
          <Tooltip placement="bottom" title="编辑">
            <Button onClick={(e) => {this.handleLinkToDetail(e, record.id)}}>
              <Icon type="edit" />
            </Button>
          </Tooltip>
        );
        const btnDelete = (
          <Tooltip placement="bottom" title="移除">
            <Popconfirm title="确定要删除吗" okText="是的" cancelText="取消"
                        onConfirm={(e) => {this.handleDelete(e, record.id)}}
            >
              <Button type="danger" style={{marginLeft:3}}><Icon type="delete"  /></Button>
            </Popconfirm>
          </Tooltip>
        );

        const btnLook = (
          <Tooltip placement="bottom" title="查看">
            <Button onClick={(e) => {
              this.handleLinkToDetailToLook(e, record.id)
            }}
                    style={{marginLeft:3}}
            >
              <Icon type="eye-o" />
            </Button>
          </Tooltip>
        );

        return (
          <div>
            {(this.props.user.currentUser.admin)?
              <React.Fragment>{btnUpdate}{btnDelete}{btnLook}</React.Fragment> :
              <React.Fragment>{btnUpdate}{btnLook}</React.Fragment>
            }
          </div>
        )
      }
    }
  ];

  state = {
    current: 1,
    totals: 0,
    data: [],
    moreSearchState: true,
    moreSearchInfo: "更多筛选",
  }


  componentWillMount(){
    if(this.props.user.currentUser.admin){
      this.selectData();
    }else{
      this.getSelfCompanyInfo(this.props.user.currentUser.organizationId);
    }
  }


  componentDidMount(){
    // console.log(this.props);
  }

  /***
   * 处理page跳转
   */
  handlePageChange = (page) => {
    // console.log(page);
    this.setState({
      current: page,
    },() => {this.selectData()});
  }


  /**
   * 条件查询
   */
  handleSearch = () => {
    this.setState({
      current: 1,
      totals: 0,
    },() => {this.selectData()})
  }


  /***
   *  更多筛选按钮
   */
  handleMoreSearch = () => {
    let moreSearchForm = document.getElementById("moreSearch");
    //改变筛选按钮的状态
    if(this.state.moreSearchState){
      moreSearchForm.style.display = "block";
      this.setState({
        moreSearchState: false,
        moreSearchInfo: "关闭筛选",
      });
    }else {
      moreSearchForm.style.display = "none";
      this.setState({
        moreSearchState: true,
        moreSearchInfo: "更多筛选",
      });
      this.handleReset();
    }
  }


  /***
   * 根据page查询企业信息
   */
  selectData = () => {
    //获取三个输入框的输入
    let customerNoValue = this.props.form.getFieldValue('customerNo');
    let corporateNameValue = this.props.form.getFieldValue('corporateName');
    let contactsValue = this.props.form.getFieldValue('contacts');
    let url = "/base-info/v1/company?";
    url += "page="+ (this.state.current-1) + "&size=6";

    if(customerNoValue !== undefined){
      if(this.Trim(customerNoValue) !== ""){
        url += "&customerNo="+customerNoValue;
      }
    }
    if(corporateNameValue !== undefined){
      if(this.Trim(corporateNameValue) !== ""){
        url += "&corporateName="+corporateNameValue;
      }
    }
    if(contactsValue !== undefined){
      if(this.Trim(contactsValue) !== ""){
        url += "&contacts="+contactsValue;
      }
    }
    console.log(url);
    //调用后台的接口
    axios({
      method: 'get',
      url: url,
    }).then((res) => {
      console.log(res);
      //添加数据到data
      let totals = res.data.totalElements;
      this.addTodata(res.data.content);
      this.setState({
        totals: totals,
      })
    }).catch((err) => {
      console.log(err);
    })
  }


  getSelfCompanyInfo = (organizationId) => {

    let url = "/base-info/v1/company/getCompanyInfoByOrganizationId?organizationId=";
    url += organizationId;
    axios({
      method: 'get',
      url: url,
    }).then((res) => {
      let datas = [];

      let item = {};
      item.order = 1;
      item.id = res.data.id;
      item.customerNo = res.data.customerNo;
      item.corporateName = res.data.corporateName;
      item.contacts = res.data.contacts;
      item.contactsTel = res.data.contactsTel;
      item.contactsEmail = res.data.contactsEmail;

      datas.push(item);

      //将datas 添加到state中
      this.setState({
        data: datas,
      })
      // console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  /***
   * 将查询到的结果添加到列表的data中
   */
  addTodata = (result) => {

    let datas = [];
    let order = 1;
    result.forEach(function (value) {
        let item = {};
        item.order = order++;
        item.id = value.id;
        item.customerNo = value.customerNo;
        item.corporateName = value.corporateName;
        item.contacts = value.contacts;
        item.contactsTel = value.contactsTel;
        item.contactsEmail = value.contactsEmail;

        datas.push(item);
    });

    //将datas 添加到state中
    this.setState({
      data: datas,
    })

  }

  /**
   * 删除一条记录
   */
  handleDelete = (e, id) => {
    e.stopPropagation();
    //调用后台接口删除一条记录

    let url = "/base-info/v1/company/";
    url += id;
    //删除数据
    axios({
      method: 'delete',
      url: url,
    }).then((res) => {
      // console.log(res);
      if(res.data === true){

        //过滤掉删除的信息
        const { data } = this.state;
        const nextData = data.filter(item => item.id !== id);
        this.setState({
          data:nextData
        },() => {this.selectData()});
        console.log("删除成功");
      }
    }).catch((err) => {
      console.log(err);
    })

  }

  /***
   * 清空三个查询输入框的内容
   */
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      current: 1,
      totals: 0,
    },() => {this.selectData()})
  }


  // clearInput = () => {
  //   this.props.form.setFields({"customerNo": ""})
  //   this.props.form.setFields({"corporateName": ""})
  //   this.props.form.setFields({"contacts": ""})
  // };

  /**
   *   跳转到明细页面
   */
  handleLinkToDetail = (e, id)=>{
    e.stopPropagation();
    this.linkToChange(`/base-info-defend/customerDetail/${id}/0`);
  }

  handleLinkToDetailToLook = (e, id) => {
    e.stopPropagation();
    this.linkToChange(`/base-info-defend/customerDetail/${id}/1`);
  }

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props;
    history.push(url);
  };


  /**
   * 去除两端空格
   * @param str
   * @returns {*}
   * @constructor
   */
  Trim = (str) =>{
    return str.replace(/(^\s*)|(\s*$)/g,"");
  }


  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const formSearch = (
      <Form layout="horizontal">
        <Row type="flex" style={{marginLeft: 20}}>
          <Col xs={{span: 12}} style={{ marginRight:20}}>
            <FormItem
              wrapperCol={{span:24}}
            >
              {getFieldDecorator('searchInput', {})(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col style={{ marginRight:87}}>
            <FormItem>
              <Button type="primary" onClick={this.handleSearch}>搜索</Button>
            </FormItem>
          </Col>
          <Col style={{ marginRight:20}}>
            <FormItem>
              <Button type="primary"
                      onClick={this.handleMoreSearch}
                      disabled={!(this.props.user.currentUser.admin)}
              >
                {this.state.moreSearchInfo}
              </Button>
            </FormItem>
          </Col>
          <Col>
            <FormItem>
              <Button type="primary"
                      onClick={(e) => {this.handleLinkToDetail(e, 0)}}
                      disabled={!(this.props.user.currentUser.admin)}
              >
                添加
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
    const formMoreSearch = (
      <Form id="moreSearch" layout="inline" style={{display: 'none',marginBottom:20}}>
        <FormItem
          {...formItemLayout}
          label="客户编号"
        >
          {getFieldDecorator('customerNo', {})(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="公司名称"
        >
          {getFieldDecorator('corporateName', {})(
            <Input prefix={<Icon type="info-circle-o" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系人"
        >
          {getFieldDecorator('contacts', {})(
            <Input prefix={<Icon type="contacts" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    );
    return(
      <div id="no">
        {(this.props.user.currentUser.admin)?
          <React.Fragment>{formSearch} {formMoreSearch}</React.Fragment> :
          null
        }


        <Table columns = {this.columns}
               dataSource = {this.state.data}
               rowClassName={ styles.Table__row }
               pagination = { {
                 pageSize: 6,
                 current: this.state.current,
                 onChange: this.handlePageChange,
                 total: this.state.totals
               }}
               rowKey = "id"
        >
        </Table>
      </div>

    );
  }

}


export default CompanyBaseInfoList;
