import React from 'react';

import {  Icon, Input, Form, Button,Row, Col, Select} from 'antd';

import styles from './CompanyDetailInfo.css';
import axios from "axios/index";

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
/***
 * created by weimeng on 2018/7/5
 *
 * 客户信息明细页面
 *  修改信息和删除
 */
class CompanyDetailInfo extends React.Component{


  state = {
    id: 0,
    data: {},
    customerNo:"",
    enterState: 0,
  }


  componentWillMount(){
    this.setState({
      id: this.props.match.params.id,
      enterState: this.props.match.params.enterState,
    })
  }

  /***
   *
   */
  componentDidMount(){
    // let x = this.props.match.params.id;
    // console.log(x);

    // console.log(this.state.id);
    //根据url传入的id调用后台接口查询数据
    if(this.state.id != 0){
      let url = "/base-info/v1/company/";
      url += this.state.id;
      //查数据
      axios({
        method: 'get',
        url: url,
      }).then((res) => {
        // console.log(res.data);
        // 处理数据
        let results = this.handleData(res.data);

        //将数据添加到表单里
        this.addToForm(results);
        // this.setState({
        //   customerNo: results.customerNo,
        // });
      }).catch((err) => {
        console.log(err);
      })
    }else{
      //自动生成公司编号
      this.AutomaticGenerateCompanyNumber();
    }
  }

  /***
   * 自动生成公司编号
   * @constructor
   */
  AutomaticGenerateCompanyNumber = () => {

    let newCustomerNo = "S";
    let url = "/base-info/v1/company/all";
    axios({
      method: 'get',
      url: url,
    }).then((res)=>{
      console.log(res);
      console.log(res.data.length);
      newCustomerNo += (10001+res.data.length);
      console.log(newCustomerNo);
      this.setState({
        customerNo: newCustomerNo
      },()=>{
        this.props.form.setFields({
          "customerNo": { value: this.state.customerNo  },
          "isEffective": { value: "0"},
        })
      });
    }).catch((err)=>{
      console.log(err);
    });
  }


  /**
   * 处理数据
   * @param res
   */
  handleData = (res) => {
    let data = {};

    data.customerNo = res.customerNo;
    data.corporateName = res.corporateName;
    data.corporateAddress = res.corporateAddress;
    data.contacts = res.contacts;
    data.contactsTel = res.contactsTel;
    data.contactsEmail = res.contactsEmail;
    //使用状态
    if(res.isEffective == 0){
      data.isEffective = "0";
    }else if(res.isEffective == 1){
      data.isEffective = "1";
    }
    data.remarks = res.remarks;
    data.invoiceCustomerName = res.invoiceCustomerName;
    data.address = res.address;
    data.taxpayerIdentificationNum = res.taxpayerIdentificationNum;
    data.bank = res.bank;
    data.bankAccount = res.bankAccount;
    data.telephone = res.telephone;
    data.summary = res.summary;

    return data;
  }

  /***
   * 将读取的数据添加到form表单
   * @param result
   */
  addToForm = (result) => {
    // console.log(result);
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //   }
    // });
    this.setState({
      data: result,
    });

  }


  //数据转换

  /***
   * form表单提交
   */
  handleSubmit = (e) => {

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        //根据传入的id判断插入还是更新记录，0是插入，!0更新
        if(this.state.id == 0 ){
          //插入一条新记录
          this.insertCompanyInfo(values);
        }else {
          //更新记录
          this.updateCompanyInfo(this.state.id,values);
        }
      }
    });
  }


  /***
   * 插入企业信息
   */
  insertCompanyInfo = (data) => {
    // console.log("insert");
    let url = "/base-info/v1/company";
    //插入数据
    axios({
      method: 'post',
      url: url,
      data: data,
    }).then((res) => {
      // console.log(res);
      if(res.data.failed === true){
        console.log("客户编号重复");
      }else if(res.data === true){
        console.log("插入成功");
        //跳转到基础信息页
        this.linkToChange(`/base-info-defend/company`);
      }

    }).catch((err) => {
      console.log(err);
    })
  }

  /***
   * 更新企业信息
   */
  updateCompanyInfo = (id, data) => {
    // console.log("update");
    let url = "/base-info/v1/company/";
    url += id;
    //更新数据
    axios({
      method: 'post',
      url: url,
      data: data,
    }).then((res) => {
      if(res.data === true){
        console.log("更新成功");
        //跳转到基础信息页
        this.linkToChange(`/base-info-defend/company`);
      }else {
        console.log("更新失败");
      }
    }).catch((err) => {
      console.log(err);
    })

  }


  // /**
  //  * 验证客户编号是否已存在
  //  * @param rule
  //  * @param value
  //  * @param callback
  //  */
  // checkCustomerNo = (rule, value, callback) => {
  //
  //   let customerNo = this.Trim(this.praseStrEmpty(value));
  //   if(this.state.id == 0){
  //
  //     if(customerNo != ""){
  //       //判断客户编号是否已经存在
  //       this.checkExistCustomerNo(customerNo, callback);
  //     }else{
  //       callback();
  //     }
  //   }else{
  //     if(customerNo == this.state.customerNo){
  //       callback();
  //     }else{
  //       if(customerNo != ""){
  //         //判断客户编号是否已经存在
  //         this.checkExistCustomerNo(customerNo, callback);
  //       }else{
  //         callback();
  //       }
  //     }
  //   }
  // };
  //
  // /***
  //  * 判断客户编号是否已经存在
  //  */
  // checkExistCustomerNo = (customerNo, callback) => {
  //
  //   let url = "/base-info/v1/company/if/";
  //   url += customerNo;
  //
  //   axios({
  //     method: 'get',
  //     url: url,
  //     data: {},
  //   }).then((res) => {
  //     if(res.data == 0){
  //       callback('用户名已存在');
  //     }else{
  //       callback();
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //   })
  // }


  /***
   * 输入只能含有中文英文和数字
   * @param rule
   * @param value
   * @param callback
   */
  checkInputWithoutIllegal = (rule, value, callback) => {
    let re = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    if(this.Trim(this.praseStrEmpty(value))!== ""){
      if (re.test(value)) {
        callback();
      } else {
        callback('输入不合法');
      }
    }else {
      callback();
    }
  }

  /**
   * 校验手机号
   * @param rule
   * @param value
   * @param callback
   */
  checkTel = (rule, value, callback) => {
    var re = /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/;

    if(this.Trim(this.praseStrEmpty(value))!== ""){
      if (re.test(value)) {
        callback();
      } else {
        callback('手机号不正确');
      }
    }else {
      callback();
    }


  };

  // /**
  //  * 验证邮箱
  //  * @param rule
  //  * @param value
  //  * @param callback
  //  */
  // checkEmail =(rule, value, callback) =>{
  //   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //
  //   if(this.Trim(this.praseStrEmpty(value))!== ""){
  //     if(re.test(value)){
  //       callback();
  //     } else {
  //       callback('邮箱不正确！');
  //     }
  //   }else {
  //     callback();
  //   }
  //
  // }

  /**
   * 验证姓名
   * @param rule
   * @param value
   * @param callback
   */
  checkName = (rule, value, callback) => {
    var re = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    if (re.test(value)) {
      callback();
    } else {
      callback('姓名不符规则！');
    }
  };


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


  /**
   * 转换字符串，undefined,null等转化为""
   * @param str
   * @returns {*}
   */
   praseStrEmpty = (str) => {
    if(!str || str=="undefined" || str=="null"){
      return "";
    }
    return str;
  }

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    this.linkToChange(`/base-info-defend/company`);
  }


  render(){

    const {getFieldProps, getFieldDecorator} = this.props.form;

    const formItemLayout = {
      style:{width:300,marginBottom:15},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return(
      <div className="container">
        <Button onClick={this.handleClickBackBtn} style={{marginBottom:15}}>
          <Icon type="left" />返回
        </Button>
        <div className="container-item">
          <div className={styles.CompanyDetailInfo__title} >
            公司基本信息
          </div>
          <div className="content">
            <Form layout="inline" style={{marginLeft: "50px"}}>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="公司编号">
                    {getFieldDecorator('customerNo', {
                      initialValue:this.state.data.customerNo,
                      // validateTrigger: 'onBlur',
                      // rules: [
                      //   {required: true, whitespace: true, message: '请输入客户编号!'},
                      //   { validator: this.checkCustomerNo }
                      //   ],
                    })(
                      <Input disabled={true}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="公司名称">
                    {getFieldDecorator('corporateName', {
                      initialValue:this.state.data.corporateName,
                      rules: [
                        {required: true, whitespace: true, message: '请输入公司名称!'},
                        { validator: this.checkInputWithoutIllegal },
                        ],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="公司地址">
                    {getFieldDecorator('corporateAddress', {
                      initialValue: this.state.data.corporateAddress,
                      rules: [{ validator: this.checkInputWithoutIllegal },],
                      },
                    )(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="联系人">
                    {getFieldDecorator('contacts', {
                      initialValue:this.state.data.contacts,
                      rules: [
                        { required: true, whitespace: true, message: '请输入联系人!' },
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="联系电话">
                    {getFieldDecorator('contactsTel',{
                        initialValue:this.state.data.contactsTel,
                        rules: [
                          { required: true, whitespace: true, message: '请输入联系电话!' },
                          { validator: this.checkTel }
                          ],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="联系人邮箱">
                    {getFieldDecorator('contactsEmail', {
                      initialValue: this.state.data.contactsEmail,
                      rules: [{ type: 'email', message: '邮箱格式不正确' }],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="使用状态">
                    {getFieldDecorator('isEffective', {
                      initialValue: this.state.data.isEffective,
                      rules: [{ required: true, whitespace: true, message: '请选择!' },],
                    })(
                      <Select placeholder="请选择"
                              disabled={this.state.enterState == 1}
                      >
                        <Option value="0">有效</Option>
                        <Option value="1">无效</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginBottom: 20}}>
                <Col span={24}>
                  <FormItem label="备注" style={{width: '100%',marginLeft: 15}}
                            labelCol={{span:4}}
                            wrapperCol={{span: 15}}>
                    {getFieldDecorator('remarks', {
                      initialValue: this.state.data.remarks,
                    })(
                      <TextArea rows={4}
                                disabled={this.state.enterState == 1}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="container-item">
          <div className={styles.CompanyDetailInfo__title} >
            开票信息
          </div>
          <div className="content">
            <Form layout="inline" style={{marginLeft: "50px"}}>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="发票客户名称">
                    {getFieldDecorator('invoiceCustomerName', {
                      initialValue: this.state.data.invoiceCustomerName,
                      rules: [
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="地址">
                    {getFieldDecorator('address', {
                      initialValue: this.state.data.address,
                      rules: [
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="纳税人识别号">
                    {getFieldDecorator('taxpayerIdentificationNum', {
                      initialValue: this.state.data.taxpayerIdentificationNum,
                      rules: [
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="开户行">
                    {getFieldDecorator('bank', {
                      initialValue: this.state.data.bank,
                      rules: [
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="账号">
                    {getFieldDecorator('bankAccount', {
                      initialValue: this.state.data.bankAccount,
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="电话">
                    {getFieldDecorator('telephone', {
                      initialValue: this.state.data.telephone,
                      rules: [{ validator: this.checkTel }],
                    })(
                      <Input disabled={this.state.enterState == 1}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="container-item">
          <div className={styles.CompanyDetailInfo__title} >
            公司简介
          </div>
          <div className="content">
            <Form layout="inline" style={{marginLeft: "50px"}}>
              <Row style={{marginBottom: 20}}>
                <Col span={24}>
                  <FormItem style={{width: '100%',marginLeft: 15}}
                            wrapperCol={{span: 15}}>
                    {getFieldDecorator('summary', {
                      initialValue: this.state.data.summary,
                    })(
                      <TextArea rows={6}
                                style={{marginLeft: '27%'}}
                                disabled={this.state.enterState == 1}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={10}>
                  <FormItem >
                    <Button type="primary"
                            onClick={this.handleSubmit}
                            disabled={this.state.enterState == 1}
                    >
                      数据保存
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }

}

export default Form.create()(CompanyDetailInfo);
