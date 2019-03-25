import React, {
  Component,
  Fragment
} from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Upload,
  Modal,
  DatePicker,
  message
} from 'antd';
import request from '../../utils/request'
import TextArea from 'antd/lib/input/TextArea';
class BuildingCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      authorization: '',
      Uid: '',
      type:1,
      optionHouseStyle:[],
      styles:[]
    
    }
    this.getAuthorization().then((result)=>{
      this.setState({authorization:result})
    }) 
  }
  componentWillMount() {
    this.getPersonalInfoById()
    this.getAllRoles()
}
   /**
     * 获取所有房屋类型
     */
    getAllRoles = () => {
      request('/v1/wyw/house-style/selectAll', {
          method: 'get',
          // credentials: 'omit'
      }).then((res) => {
          if (res.message === '查询成功') {
              this.filterAllHouseStyle(res.data)
          } else {
              message.error('查询失败')
          }
      }).catch((err) => {
          console.log(err)
      })
  }

  /**
   * 将所有的角色信息进行筛选留下角色的id和name的json数据保存在state里的数组roles中
   */
  filterAllHouseStyle = (data) => {
      let styles = []
      data.map((item) => {
          let houseStyle = {}
          houseStyle.id = item.id
          houseStyle.name = item.name
          styles.push(houseStyle)
      })
      this.setState({
        styles
      }, () => {
          this.putAllHouseStylesIntoOptions()
      })
  }

  /**
   * 把所有的角色都放到select的option中
   */
  putAllHouseStylesIntoOptions = () => {
      let optionHouseStyle = []
      this.state.styles.map((item) => {
          let option = {}
          option = <Option key={item.id} value={item.id}>{item.name}</Option>
          optionHouseStyle.push(option)
      })
      this.setState({
        optionHouseStyle
      })
  }
  getPersonalInfoById = () => {
    request('/v1/sysUserDomin/getAuth', {
        method: 'GET',
        // credentials: 'omit'
    }).then((res) => {
        // console.log(res)
        if (res.message === '成功') {
          this.setState({
            Uid:res.data.id
          })
        } else {
            message.error('获取当前登录人信息失败');
        }
    }).catch((err) => {
        console.log(err)
    })
}
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let houseStyles =[]
        values.houseStyleIds.map((item) =>{
          this.state.styles.some((role,index) =>{
            if(role.id == item){
              houseStyles.push(this.state.styles[index])
              return true
            }
          })
        })
        values.houseStyles=houseStyles
        console.log('Received values of form: ', values);
        this.createBuilding(values)

      }
    });
  }
  getAuthorization = async function  () {
    try {
      const accessTokenExpire = localStorage.getItem('accessTokenExpire')
      if (!accessTokenExpire) {
        return null
      }
      let accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        return null
      }
      if (Number(accessTokenExpire) > Date.now() + 10000) {
        return `Bearer ${accessToken}`
      }
  
      const refreshTokenExpire = localStorage.getItem('refreshTokenExpire')
      if (!refreshTokenExpire) {
        return null
      }
  
      if (Number(refreshTokenExpire) < Date.now()) {
        return null
      }
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return null
      }
  
      const res = await fetch(`${process.env.server}/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=client&client_secret=secret&type=222`, {
        method: 'POST',
        credentials: 'omit'
      })
      const json = await res.json()
      accessToken = json.data.access_token
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('accessTokenExpire', Date.now() + json.data.expires_in * 1000)
      return `Bearer ${accessToken}`
    } catch (e) {
      return null
    }
  }
  handleCancel = () => this.setState({
    previewVisible: false
  })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
    });
  }
createBuilding = (values) => {
  console.log('data:', values)
  request(`/v1/wyw/building/createBuilding/${this.state.Uid}`, {
    method: 'POST',
    body: values
  }).then((res) => {
    if (res.message === '创建成功') {
      // message.success('创建成功')
      console.log("创建成功")
      // this.linkToChange('/setting/users')
    } else {
      // message.error(res.message)
      console.log("创建失败")
    }
  }).catch((err) => {
    console.log(err)
  })
}


handleChange = ({
  fileList
}) => {
  this.setState({
    fileList
  })

}
onRemove=(file) =>{
  // this.setState(preState => ({
  //   fileList:[],
  //   uploadPath : ''
  // })
  //  )
  console.log("删除的文件",file)
}
// beforeUpload(file) {
  // const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!');
  // }
  // return isJPG && isLt2M;
  // var fileArr = [];
  //获取新的上传列表
        // fileArr.push(file);
  //进行赋值保存
      //  this.setState(preState => ({
      //    fileList:fileArr,
      //    uploadPath:''
      //  }))
//       let fileType = file.type;
//       let fileName = file.name;
//       //判断是否支持该文件格式
//       let isInvalidFileType = !fileType || fileType.length < 1;
//       if (isInvalidFileType) {
//           message.error('抱歉，不支持上传该格式的文件！');
//           return !isInvalidFileType;
//       }

//       let availFileSuffix = ['.png', '.PNG', '.jpg', '.JPG'];
//       let fileSuffixName = fileName.substring(file.name.lastIndexOf('.'));
//       let isAvailableSuffix = availFileSuffix.includes(fileSuffixName);
//       console.log('fileSuffixName',fileSuffixName)
//       console.log('isAvailableSuffix',isAvailableSuffix)
//       console.log('fileType',fileType)
//       console.log('fileName',fileName)
//       if (!isAvailableSuffix) {
//           let msg = '抱歉，只支持上传【' + availFileSuffix.join(' || ') + '】格式的文件！';
//           message.error(msg);
//           return isAvailableSuffix;
// }
// updateChange = (info) => {      
//   if (info.file.status === 'done') {
// //上传成功后将后台返回来的文件地址进行获取--info.file.response
//      if (info.file.response) {
//        this.setState(preState => ({
//         uploadPath : info.file.response.Data,
//       })
//        )
//   }
//       message.success('上传成功！');
//   } else if (info.file.status === 'error') {
// //上传失败进行提示
//       message.error('上传失败！');
//   }
// }
render() {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
    const {
      previewVisible,
      previewImage,
      fileList
    } = this.state;
    const uploadButton = ( 
    <div>
      <Icon type = "plus"/>
      <div className = "ant-upload-text" > Upload </div> 
      </div>
    );
    const {
      getFieldDecorator
    } = this.props.form;
   
    return ( 
      <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
      <Form  onSubmit = {this.handleSubmit.bind(this)} >
      <Form.Item  {...formItemLayout} label = {'楼盘名称'} > 
      {getFieldDecorator('name', {
          rules: [{
            required: true,
            message: '请输入楼盘名称!'
          }],
        })(
          <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
           placeholder="请输入楼盘名称" />
          )
        } 
        </Form.Item> <Form.Item label = {'联系方式'} {...formItemLayout}  > 

        {getFieldDecorator('phone', {
            rules: [{
              required: true,
              message: '请输入联系方式'
            },
            {
              pattern: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/,
              message: '手机号格式错误！'
            }],
          })( <Input  prefix = {< Icon type = "lock" style = {{color: 'rgba(0,0,0,.25)'}}/>} 
           placeholder="phone" />
            )
          } 
          </Form.Item>

          <Form.Item label = {'预计价格'} {...formItemLayout}  >
            {getFieldDecorator('estimatePrice',{
                rules: [{
                  required: true,
                  message: '预计价格'
                }]
            })(
              <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入预计价格" />
            )}
          </Form.Item>
          <Form.Item label = {'开盘时间'} {...formItemLayout} >
            {getFieldDecorator('openingTime',{
                rules: [{
                  required: true,
                  message: '开盘时间'
                }]
            })(
              <DatePicker />
            )}
          </Form.Item>
          <Form.Item label = {'交房时间'} {...formItemLayout} >
          {getFieldDecorator('deliveryTime',{
                rules: [{
                  required: true,
                  message: '交房时间'
                }]
            })(
              <DatePicker />
            )}
          </Form.Item> 
          <Form.Item label={'户型'}  {...formItemLayout}>
                        {getFieldDecorator('houseStyleIds', {
                            // initialValue: this.state.data.roleIds,
                            rules: [{ required: true, message: '请选择户型' }]
                        })(
                            <Select
                                mode={'multiple'}
                                placeholder={'请选择户型'}
                            >
                                {this.state.optionHouseStyle}
                            </Select>
                        )}
                    </Form.Item>
          <Form.Item label = {'开发商'} {...formItemLayout} >
          {getFieldDecorator('developer',{
                rules: [{
                  required: true,
                  message: '开发商'
                }]
            })(
              <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入预计价格" />
            )}
          </Form.Item> 
          <Form.Item label = {'楼层状况'} {...formItemLayout} >
          {getFieldDecorator('floorNumber',{
                rules: [{
                  required: true,
                  message: '楼层状况'
                }]
            })(
              <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入楼层状况" />
            )}
          </Form.Item> 
          <Form.Item label = {'物业管理费'} {...formItemLayout} >
          {getFieldDecorator('anagementPrice',{
                rules: [{
                  required: true,
                  message: '物业管理费'
                }]
            })(
              <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入物业管理费" />
            )}
          </Form.Item>
          <Form.Item label = {'物业公司'} {...formItemLayout} >
          {getFieldDecorator('anagementCompany',{
                rules: [{
                  required: true,
                  message: '物业公司'
                }]
            })(
              <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入物业公司" />
            )}
          </Form.Item>
          <Form.Item label = {'车位数'} {...formItemLayout} >
          {getFieldDecorator('parkingNumber',{
                rules: [{
                  required: true,
                  message: '车位数'
                }]
            })(
              <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入车位数" />
            )}
          </Form.Item>
          <Form.Item label = {'楼盘描述'} {...formItemLayout} >
          {getFieldDecorator('description',{
                rules: [{
                  required: true,
                  message: '楼盘描述'
                }]
            })(
              <TextArea prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
              placeholder="请输入楼盘描述" />
            )}
          </Form.Item>
          <Form.Item  {...formItemLayout} > 
          {getFieldDecorator('file', {
              rules: [{
                required: true,
                message: '请上传图片'
              }],
            })( <div className = "clearfix" >
              <Upload  
              action={`http://localhost:8080/v1/wyw/picture/insertPictures/${this.state.type}`}
              // /${this.state.type} /${this.state.Uid}/${this.state.type}
              headers = {
                {
                  Authorization: this.state.authorization
                }
              }
              listType = "picture-card"
              fileList = {
                fileList
              }
              // beforeUpload={this.beforeUpload}

              onPreview = {
                this.handlePreview
              }
              onChange = {
                this.handleChange
              } >
              {
                fileList.length >= 3 ? null : uploadButton
              } 
              </Upload> 
              <Modal visible = {
                previewVisible
              }
              footer = {
                null
              }
              onCancel = {
                this.handleCancel
              } >
              <img alt = "example"
              style = {
                {
                  width: '100%'
                }
              }
              src = {
                previewImage
              }
              /> </Modal> 
              </div>
            )
          } 
          </Form.Item> 
           <Form.Item {...tailFormItemLayout}>
          <Button type = "primary"
          htmlType = "submit" >
          Log in
          </Button> 
          
          </Form.Item> 
          </Form> 
          </div>
        )
      }
    }
    export default Form.create()(BuildingCreate);
