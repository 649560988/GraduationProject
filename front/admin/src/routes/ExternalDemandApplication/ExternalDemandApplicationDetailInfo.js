/***
 * created by weimeng
 *
 */
import React from 'react';
import { InputNumber, Input, Form, Button,Row, Col, Select, DatePicker, Icon, Modal, Table,Steps} from 'antd';
import moment from "moment/moment";
import styles from './ExternalDemandApplicationDetailInfo.css';
import axios from "axios/index";
import { connect } from 'dva';

const Step = Steps.Step;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
/***
 *保存成功弹窗
 */
function success() {
  const modal = Modal.success({
    title: '保存成功',
    content: '保存成功',
  });
  setTimeout(() => modal.destroy(), 1000);
}
/***
 *保存失败弹窗
 */
function error(reason) {
  Modal.error({
    title: '保存失败',
    content: reason,
  });
}

@Form.create()
@connect(({ user }) => ({
  user: user
}))
class OutsourcingDemandApproval extends React.Component{
  columns = [
    {
      title: '审批人',
      dataIndex: 'createdBy',
    },
    {
      title: '审批日期',
      dataIndex: 'creationDate',
    },
    {
      title: '审批结果',
      dataIndex: 'isPass',
    },
    {
      title: '审批意见',
      dataIndex: 'auditOpinion',
    }
  ];
  SignColumns = [
    {
      title: '外协申请号',
      dataIndex: 'id',
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
    },
    {
      title: '报名日期',
      dataIndex: 'creationDate',
    }
  ];
  state = {
    demandId:0,
    processSubId:0,
    relationId:0,
    resourcesId:0,
    current: 0,
    enterState: 0,  //进入状态,是修改还是查看
    id: 0,    //demand主表id
    data: {},
    objectId: 0,//object项目id
    lookUpState: false,
    btnApplication:true,
    btnSave:false,
    applicationId:0,
    info:[],
    steps:[],
    signData:[],
    isInsert: false,
  }
  componentWillMount(){
    this.setState({
      enterState: this.props.match.params.enterState,
      id: this.props.match.params.id,
      objectId: this.props.match.params.objectId,
    })
  }
  /***
   *
   */
  componentDidMount(){
    // console.log(this.state.enterState);
    // console.log(this.state.id);
    // console.log(this.state.objectId);

    //根据enterState判断是修改1还是查看0
    if(this.state.enterState == 1){
      this.setState({
        lookUpState: false,
        btnApplication:false,
        btnSave:false,
      });
    }
    //查看
    if(this.state.enterState == 0){
      this.setState({
        lookUpState: true,
        btnApplication:true,
        btnSave:true,
      });
    }
    //根据url传入的id调用后台接口查询数据 查看0 修改1
    if(this.state.id != 0){
      // if(this.state.enterState == 0){
      //   this.setState({
      //     btnApplication:true,
      //   })
      // }
      let url = "/base-info/resume/ocmsDemand/getDemand/id?id=";
      url += this.state.id;
      //查数据
      axios({
        method: 'get',
        url: url,
      }).then((res) => {
         console.log(res.data);
        this.setState({
          relationId:res.data.ocmsCompanyId,
          demandId:res.data.id,
        },()=>{
          //读取审批记录
          this.approvalInfo();
          //读取报名列表
          this.signUpInfo();
        })
        //处理数据
        let results = this.handleData(res.data);
        // console.log(results);
        //将数据添加到表单里
        this.addToForm(results);
      }).catch((err) => {
        console.log(err);
      })
    }else if(this.state.id == 0 && this.state.enterState == 1){
      console.log("添加");
      // console.log(this.state.objectId);
      this.setState({
        btnApplication: true,
        btnSave:false,
        isInsert: true,
      })

      //自动生成外协需求编号
      // let demand_no = 100000001;

      // axios({
      //   method: 'get',
      //   url: '/base-info/resume/ocmsDemand/all',
      // }).then((res)=>{
      //   if(res.data != null){
      //     demand_no += res.data.length;
      //
      //
      //   }
      // }).catch((err)=>{
      //   console.log(err);
      // });

      //根据objectId查询项目信息
      let url = '/base-info/resume/ocmsObject/';
      url += this.state.objectId;
      axios({
        method: 'get',
        url: url,
      }).then((res)=>{
        // console.log(res.data);

        //处理项目数据
        if(res.data != null){
          let datas = {};

          datas.objectName = res.data.objectName;
          datas.companyName = res.data.companyName;
          datas.objectManager = res.data.objectManager;
          datas.tel = res.data.tel;
          datas.employmentTime = "0";
          datas.remandCycle = "0";
          datas.priceUnit = "0";
          datas.demandConsultantRole = "2";
          datas.isBoard = "0";
          // console.log(datas);

          this.addToForm(datas);
        }
      }).catch((err)=>{
        console.log(err);
      });

    }
  }


  /***
   * 处理数据
   * @param res
   */
  handleData = (res) => {
    let data = {};
    data.id = res.id;
    data.demandNo = res.demandNo;

    data.ocmsObjectId = res.ocmsObjectId;

    // data.objectName = res.objectName;
    // data.corporateName = res.corporateName;
    // data.objectManager = res.objectManager;

    //获取项目信息
    this.getObjectInfo(data.ocmsObjectId);

    data.tel = res.tel;
    data.type = res.type;
    data.modular = res.modular;

    //从业年限
    if(res.employmentTime == 0){
      data.employmentTime = "0" ;
    }else if(res.employmentTime == 1){
      data.employmentTime = "1" ;
    }else if(res.employmentTime == 2){
      data.employmentTime = "2" ;
    }else if(res.employmentTime == 3){
      data.employmentTime = "3" ;
    }else if(res.employmentTime == 4){
      data.employmentTime = "4" ;
    }else if(res.employmentTime == 5){
      data.employmentTime = "5" ;
    }

    data.workAddress = res.workAddress;
    data.remandStartDate = res.remandStartDate;

    //需求周期
    data.remandCycle=res.remandCycle;
    // if(res.remandCycle == 0){
    //   data.remandCycle = "0";
    // }else if (res.remandCycle == 1){
    //   data.remandCycle = "1";
    // }else if (res.remandCycle == 2){
    //   data.remandCycle = "2";
    // }else if (res.remandCycle == 3){
    //   data.remandCycle = "3";
    // }

    data.price = res.price.toString();

    //价格单位
    if (res.priceUnit == 0){
      data.priceUnit = "0";
    } else if (res.priceUnit == 1){
      data.priceUnit = "1";
    }

    //顾问角色
    if (res.demandConsultantRole == 2){
      data.demandConsultantRole = "2";
    } else if (res.demandConsultantRole == 3){
      data.demandConsultantRole = "3";
    } else if (res.demandConsultantRole == 4){
      data.demandConsultantRole = "4";
    } else if (res.demandConsultantRole == 5){
      data.demandConsultantRole = "5";
    }

    //是否包住宿
    if(res.isBoard == 0){
      data.isBoard = "0";
    }else if (res.isBoard == 1){
      data.isBoard = "1";
    }

    data.requirementDescription = res.requirementDescription;

    return data;
  }


  /***
   * 获取项目信息
   * @param objectId
   */
  getObjectInfo = (objectId) => {
    //根据objectId查询项目信息
    let url = '/base-info/resume/ocmsObject/';
    url += objectId;
    axios({
      method: 'get',
      url: url,
    }).then((res)=>{
      // console.log(res.data);

      //处理项目数据
      if(res.data != null){
        this.props.form.setFields({
          "objectName": { value: res.data.objectName  },
          "companyName": { value: res.data.companyName },
          "objectManager": { value: res.data.objectManager },
        })
      }

    }).catch((err)=>{
      console.log(err);
    });
  }

  /***
   * 读取报名列表
   */
  signUpInfo=()=>{
    if(this.state.id != 0){
      let url = "/base-info/resume/ocmsResume/demand/";
      url += this.state.demandId;
      console.log(url);
      //查数据
      axios({
        method: 'get',
        url: url,
      }).then((res) => {
        console.log(res.data);

        this.addToSignTable(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  /***
   * 读取审批记录
   */
  approvalInfo=()=>{
    if(this.state.id != 0){
      let url = "/process/v1/ocms/process/account?relationId=";
      url += this.state.id;
      //查数据
      axios({
        method: 'get',
        url: url,
      }).then((res) => {
        console.log(res.data);
        this.setState({
          resourcesId:res.data[0].resourcesId,
          processSubId:res.data[0].processSubId,
          current:res.data.length-1,
        },()=>{
          //读取流程信息
          this.processInfo();
        })
        //将数据添加到表格里
        this.addToTable(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  /***
   * 读取流程信息
   */
  processInfo=()=>{

    if(this.state.id != 0){
      let url = "/process/v1/ocms/process/sub/node?processSubId=";
      url += this.state.processSubId+"&relationId="+this.state.relationId+"&resourcesId="+this.state.resourcesId;
      console.log(url);
      //查数据
      axios({
        method: 'get',
        url: url,
      }).then((res) => {
        console.log(res.data);
        //将数据添加到步骤条里
        this.addToSteps(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }
  }


  /***
   * 将读取的数据添加到form表单
   * @param result
   */
  addToForm = (result) => {
    this.setState({
      data: result,
    });

  }



  /***
   * form表单提交
   */
  handleSaveData = (e) => {

    let _this = this;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          'remandStartDate': fieldsValue['remandStartDate'].format('YYYY-MM-DD HH:mm:ss'),
        };
        // console.log('Received values of form: ', values);
        let data = this.handleSudmitData(values);
        // console.log(this.handleSudmitData(values));
        //根据传入的id判断插入还是更新记录，0是插入，!0更新
        if(_this.state.id === "0"){
          data.ocmsObjectId = this.state.objectId;
          data.status = 0;
          data.examineStatus = 0;
          data.createdBy = this.props.user.currentUser.id;
          data.ocmsCompanyId = this.props.user.currentUser.organizationId;
          //插入一条新记录
          this.insertDemandInfo(data);
        }else {
          //更新记录
          this.updateDemandInfo(this.state.id,data);
        }
      }
    });
  }


  /**
   * 处理提交数据
   */
  handleSudmitData = (values) => {
    let data = {};

    data.demandNo = values.demandNo;
    data.requirementDescription = values.requirementDescription;
    data.demandConsultantRole = parseInt(values.demandConsultantRole);
    data.type = values.type;
    data.modular = values.modular;
    data.employmentTime = parseInt(values.employmentTime);
    data.workAddress = values.workAddress;
    data.isBoard = parseInt(values.isBoard);
    data.remandStartDate = values.remandStartDate;
    data.remandCycle = values.remandCycle;
    data.price = parseFloat(values.price);
    data.priceUnit = parseInt(values.priceUnit);
    data.tel = parseInt(values.tel);

    return data;
  }

  /***
   * 插入外协需求信息
   */
  insertDemandInfo = (data) => {
    let _this = this;
    axios({
      method: 'post',
      url: '/base-info/resume/ocmsDemand',
      data: data,
    }).then((res) => {
      console.log(res);
      if (res.status === 200){
        success();
        _this.setState({
          id:res.data,
          btnApplication:false,
          applicationId:res.data,
        },() => {})
      }
    }).catch((err) => {
      console.log(err);
      error(err);
    });
    axios({
      method: 'post',
      url: '/search/resume/solr/demand/deltaImport',
      data: data,
    }).then((res) => {
      if (res.status === 200){
        success();
      }
    }).catch((err) => {
      console.log(err);
      error(err);
    });
  }

  /***
   * 更新外协需求信息
   */
  updateDemandInfo = (id, data) => {
    console.log("update");
    let url = "/base-info/resume/ocmsDemand/updateNullNot";
    data.id = id;
    //更新数据
    axios({
      method: 'post',
      url: url,
      data: data,
    }).then((res) => {
      console.log(res);
      if (res.data == true){
        console.log("修改成功!");
        //success();
        this.setState({
          btnApplication:false,
          applicationId:res.data,
        })
      }
    }).catch((err) => {
      console.log(err);
    });
    //solr
    axios({
      method: 'post',
      url: '/search/resume/solr/demand/deltaImport',
      data: data,
    }).then((res) => {
      if (res.status == 200){
        console.log("修改成功2!");
        success();
      }
    }).catch((err) => {
      console.log(err);
    });

  }


  /**
   * 提交申请
   */
  handleSubmitAppliaction = (e) => {

    e.preventDefault();

    //先保存
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          'remandStartDate': fieldsValue['remandStartDate'].format('YYYY-MM-DD HH:mm:ss'),
        };
        let data = this.handleSudmitData(values);
        //更新记录
        this.updateDemandInfo(this.state.id,data);

        let url = "/base-info/resume/ocmsDemand/submitApplication?demandId=";
        if(this.state.id==0){
          url += this.state.applicationId;
        }
        else{
          url+=this.state.id;
        }
        //调接口
        //提交后跳转到审批列表
        axios({
          method: 'get',
          url: url,
        }).then((res) => {
          console.log(res);
          if(res.data.success == true){
            console.log("提交成功");
            //solr
            axios({
              method: 'post',
              url: '/search/resume/solr/demand/deltaImport',
              data: {},
            }).then((res) => {
              console.log("solr");
              if (res.status == 200){
                success();
              }
            }).catch((err) => {
              console.log(err);
              error(err);
            });
            //跳转路径
            // this.linkToChange(`/external-demand/application`);
          }
          else{
            error(res.data.msg);
          }
        }).catch((err) => {
          console.log(err);

        })

      }
    });

  }
  /***
   * 将读取的数据添加到Table
   * @param result
   */
  addToTable = (result) => {
    let datas = [];
    let ids=[];
    let names=[];

    //获取ids
    result.forEach(function (value) {
      if (value.createdBy != null ) {
        ids.push(value.createdBy);
      }
    });

    //用接口获取姓名
    axios({
      method: 'post',
      url: '/iam-ext/v1/users/ids',
      data:ids,
    }).then((res) => {
      // console.log(res);
      res.data.forEach(function (value) {
        if (value.realName != null) {
          names.push(value.realName);
        }
      });
      //把数据放入表格
      result.map(function(value,i) {
        let item = {};
        item.createdBy = names[i];
        item.creationDate = value.creationDate;
        if(value.isPass===1)
        {
          item.isPass="通过";
        }
        if(value.isPass===0)
        {
          item.isPass="未通过";
        }
        item.auditOpinion = value.auditOpinion;
        datas.push(item);
      });
    }).catch((err) => {
      console.log(err);
    })

    //将datas 添加到state中
    this.setState({
      info: datas,
    })
  }

  /***
   * 将读取的数据添加到Table
   * @param result
   */
  addToSignTable = (result) => {
    let datas = [];
    result.forEach(function (value) {
      let item = {};
      item.id = value.id;
      item.mobile = value.mobile;
      item.creationDate = value.creationDate;

      datas.push(item);
    });

    //将datas 添加到state中
    this.setState({
      signData: datas,
    })
  }


  /***
   * 将读取的数据添加到Steps
   * @param result
   */
  addToSteps=(result)=>{
    //根据id获取审批人姓名
    let ids = [];
    let names=[];
    result.forEach(function (value) {
      if (value.operatorId != null ) {
        ids.push(value.operatorId);
      }
    });
    //调用后台的接口
    axios({
      method: 'post',
      url: '/iam-ext/v1/users/ids',
      data:ids,
    }).then((res) => {
      // console.log(res);
      res.data.forEach(function (value) {
        if (value.realName != null ) {

          names.push(value.realName);
        }
      });
      // console.log(names);
      this.setState({
        steps : result.map(function(res,i) {
          console.log(i);
          return {
            title: res.processSubName,
            content:names[i],
          };
        })
      });
    }).catch((err) => {
      console.log(err);
    })
  }


  /**
   * 校验手机号
   * @param rule
   * @param value
   * @param callback
   */
  checkTel = (rule, value, callback) => {
    let re = /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/;

    if(this.Trim(this.praseStrEmpty(String(value)))!== ""){
      if (re.test(value)) {
        callback();
      } else {
        callback('手机号不正确！');
      }
    }else {
      callback();
    }
  };

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

  /**
   *   跳转到明细页面
   */
  handleLinkToAdvisor = (e, id)=>{
    e.stopPropagation();
    this.linkToChange(`/base-info-defend/external-consultant-resume/${id}`);
  }

  /***
   *   路径跳转
   */
  linkToChange = url => {
    const { history } = this.props;
    history.push(url);
  };

  /***
   * 返回上一个页面
   * @param result
   */
  handleClickBackBtn = (e) => {
    if(this.state.id==0){
      this.linkToChange(`/base-info-defend/project`);
    }
    else {
      this.linkToChange(`/external-demand/application`);
    }

  }

  render(){
    const { current } = this.state;
    const { getFieldDecorator} = this.props.form;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const formItemLayout = {
      style:{width:350,marginBottom:15},
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
          <div className={styles.OutsourcingDemandApproval__title} >
            外协需求申请基本信息
          </div>
          <div className="content">
            <Form layout="inline" style={{marginLeft: "50px"}}>
              <Row>
                {!(this.state.isInsert) ?
                  <Col span={10} offset={2}>
                    <FormItem {...formItemLayout} label="外协申请编号">
                      {getFieldDecorator('demandNo', {
                        initialValue:this.state.data.demandNo,
                      })(
                        <Input disabled={true}/>
                      )}
                    </FormItem>
                  </Col> :
                  null
                }

                {/*<Col span={10}>*/}
                {/*<FormItem {...formItemLayout} label="申请状态">*/}
                {/*{getFieldDecorator('status', {*/}
                {/*// initialValue: "0",*/}
                {/*rules: [{ required: true, whitespace: true, message: '请选择申请状态!' }],*/}
                {/*})(*/}
                {/*<Select placeholder="请选择申请状态">*/}
                {/*<Option value="0">有效</Option>*/}
                {/*<Option value="1">失效</Option>*/}
                {/*<Option value="2">关闭</Option>*/}
                {/*</Select>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
              </Row>
              <Row>
                <Col span={10}  offset={2}>
                  <FormItem {...formItemLayout} label="项目名称">
                    {getFieldDecorator('objectName', {
                      initialValue:this.state.data.objectName,
                      // rules: [{ required: true, whitespace: true, message: '请输入项目名称!' }],
                      rules: [{ required: true, whitespace: true, message: '请输入项目名称!' }],
                    })(
                      <Input disabled={true} />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="项目所属公司">
                    {getFieldDecorator('companyName', {
                        initialValue: this.state.data.companyName,
                      },
                    )(
                      <Input disabled={true} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={2}>
                  <FormItem {...formItemLayout} label="项目经理">
                    {getFieldDecorator('objectManager', {
                      initialValue:this.state.data.objectManager,
                      // rules: [{ required: true, whitespace: true, message: '请输入项目经理!' }],
                    })(
                      <Input disabled={true} />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="联系电话">
                    {getFieldDecorator('tel',{
                      initialValue:this.state.data.tel,
                      rules: [
                        { validator: this.checkTel }
                      ],
                    })(
                      <Input disabled={this.state.lookUpState} />
                    )}
                  </FormItem>
                </Col>
                {/*<Col span={10}>*/}
                {/*<FormItem {...formItemLayout} label="申请日期">*/}
                {/*{getFieldDecorator('objectStartDate', {*/}
                {/*// initialValue: moment(this.state.data.objectStartDate, dateFormat),*/}
                {/*initialValue: this.state.data.objectStartDate,*/}
                {/*rules: [{ required: true, message: '请选择申请日期' }],*/}
                {/*})(*/}
                {/*<DatePicker style={{width:233}} placeholder="请选择申请日期" />*/}
                {/*)}*/}
                {/*</FormItem>*/}
                {/*</Col>*/}
              </Row>
              <Row>
                <Col span={10}  offset={2}>
                  <FormItem {...formItemLayout} label="系统">
                    {getFieldDecorator('type', {
                      initialValue:this.state.data.type,
                      rules: [
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.lookUpState} />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="技能">
                    {getFieldDecorator('modular', {
                      initialValue: this.state.data.modular,
                      rules: [
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.lookUpState} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}  offset={2}>
                  <FormItem
                    {...formItemLayout}
                    label="从业年限">
                    {getFieldDecorator('employmentTime', {
                      initialValue:this.state.data.employmentTime,
                      rules: [{ required: true, whitespace: true, message: '请选择从业年限!' }],
                    })(
                      <Select placeholder="请选择从业年限" disabled={this.state.lookUpState} >
                        <Option value="0">不限</Option>
                        <Option value="1">应届生</Option>
                        <Option value="2">1-3年</Option>
                        <Option value="3">4-6年</Option>
                        <Option value="4">7-10年</Option>
                        <Option value="5">10年以上</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="工作地点">
                    {getFieldDecorator('workAddress', {
                      initialValue: this.state.data.workAddress,
                      rules: [
                        { validator: this.checkInputWithoutIllegal },
                      ],
                    })(
                      <Input disabled={this.state.lookUpState} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}  offset={2}>
                  <FormItem {...formItemLayout} label="需求开始日期">
                    {getFieldDecorator('remandStartDate',
                      this.state.data.remandStartDate?
                        {initialValue: moment(this.state.data.remandStartDate, dateFormat),
                          rules: [{ required: true, message: '请选择需求开始日期!' }],
                        }:
                        {initialValue:this.state.data.remandStartDate,
                          rules: [{ required: true, message: '请选择需求开始日期!' }],
                        },
                    )(
                      <DatePicker showTime
                                  format="YYYY-MM-DD HH:mm:ss"
                                  style={{width:233}}
                                  disabled={this.state.lookUpState}
                                  placeholder="请选择" />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="需求周期（月）">
                    {getFieldDecorator('remandCycle', {
                        initialValue: this.state.data.remandCycle,
                      },
                    )(
                      <InputNumber min={0} step={0.01} disabled={this.state.lookUpState} style={{width:233.33}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}  offset={2}>
                  <FormItem {...formItemLayout} label="价格">
                    {getFieldDecorator('price', {
                      initialValue:this.state.data.price,
                      rules: [
                        { required: true, message: '输入不正确!' },
                        ],
                    })(
                      <InputNumber min={1}
                                   style={{width:233}}
                                   disabled={this.state.lookUpState}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="价格单位">
                    {getFieldDecorator('priceUnit', {
                        initialValue: this.state.data.priceUnit,
                        rules: [{ required: true, whitespace: true, message: '请选择!' }],
                      },
                    )(
                      <Select placeholder="请选择价格单位" disabled={this.state.lookUpState}>
                        <Option value="0">元/天</Option>
                        <Option value="1">元/月</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={10}  offset={2}>
                  <FormItem {...formItemLayout} label="需求顾问角色">
                    {getFieldDecorator('demandConsultantRole', {
                      initialValue:this.state.data.demandConsultantRole,
                      rules: [
                        { required: true, whitespace: true, message: '请选择!' },
                        ],
                    })(
                      <Select placeholder="请选择顾问角色" disabled={this.state.lookUpState}>
                        <Option value="2">咨询顾问</Option>
                        <Option value="3">高级咨询顾问</Option>
                        <Option value="4">资深顾问</Option>
                        <Option value="5">方案顾问</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="是否包住宿">
                    {getFieldDecorator('isBoard', {
                        initialValue: this.state.data.isBoard,
                        rules: [{ required: true, whitespace: true, message: '请选择!' }],
                      },
                    )(
                      <Select placeholder="请选择" disabled={this.state.lookUpState}>
                        <Option value="0">是</Option>
                        <Option value="1">否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginBottom: 20}}>
                <Col span={24} offset={1}>
                  <FormItem label="详细需求描述"
                            style={{width: '100%',marginLeft: 30}}
                            labelCol={{span: 3}}
                            wrapperCol={{span: 16}}>
                    {getFieldDecorator('requirementDescription', {
                      initialValue: this.state.data.requirementDescription,
                      rules: [{ required: true, whitespace: true, message: '请输入详细需求描述!' }],
                    })(
                      <TextArea rows={6} disabled={this.state.lookUpState}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginBottom: 20}}>
                <Col span={3} offset={9}>
                  <FormItem >
                    <Button type="primary"
                            onClick={this.handleSaveData}
                            disabled={this.state.btnSave}
                    >
                      数据保存
                    </Button>
                  </FormItem>
                </Col>
                <Col span={3} >
                  <FormItem >
                    <Button type="primary"
                            onClick={this.handleSubmitAppliaction}
                            disabled={this.state.btnApplication}
                    >
                      提交申请
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="container-item">
          <div className={styles.OutsourcingDemandApproval__title} >
            流程信息
          </div>
          <div className="content">
            <Form layout="inline" style={{marginLeft: "15%"}}>
              <Row style={{marginBottom: 30}}>
                {
                  this.state.steps.length > 0 ?
                    <Col span={19}>
                      <Steps current={current}>
                        {this.state.steps.map(item => <Step key={item.title} title={item.title} description={item.content}/>)}
                      </Steps>
                    </Col>
                    :
                    <Col span={5} offset={8}><label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;暂无流程信息</label></Col>
                }
              </Row>
            </Form>
          </div>
        </div>
        <div className="container-item">
          <div className={styles.OutsourcingDemandApproval__title} >
            报名列表
          </div>
          <div className="content">
            <Form layout="inline" style={{marginLeft: "15%"}}>
              <Row style={{marginBottom: 30}}>
                <Col span={19}>
                  <Table
                    columns = {this.SignColumns}
                    dataSource = {this.state.signData}
                    rowKey = "id"
                    onRow={(record) => {
                      return {
                        onDoubleClick: (e) => {this.handleLinkToAdvisor(e,record.id)}
                      };
                    }}
                  >
                  </Table>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="container-item">
          <div className={styles.OutsourcingDemandApproval__title} >
            审批记录
          </div>
          <div className="content">
            <Form layout="inline" style={{marginLeft: "15%"}}>
              <Row style={{marginBottom: 30}}>
                <Col span={19}>
                  <Table columns = {this.columns} dataSource = {this.state.info} rowKey = "createdBy">
                  </Table>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}


export default OutsourcingDemandApproval;
