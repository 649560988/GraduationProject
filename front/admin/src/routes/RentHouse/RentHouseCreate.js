import React, {
    Component,
    Fragment
  } from 'react';
  import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    Upload,
    Modal,
    DatePicker,
    message
  } from 'antd';
  import request from '../../utils/request'
  const CheckableTag = Tag.CheckableTag;
const tagsFromServer = ['Movies', 'Books', 'Music', 'Sports'];
  class RentHouseCreate extends Component {
    constructor(props) {
      super(props)
      this.state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        authorization: '',
        Uid: '',
        type:0,
        selectedTags: [],
        optionHouseStyle:[],
        houseStyles:[]
      }
      this.getAuthorization().then((result)=>{
        this.setState({authorization:result})
      }) 
    }
    componentWillMount() {
      this.getPersonalInfoById()
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
          // const values={
          //   ...fieldsValue,
          //   'openingTime':fieldsValue['date-picker'].format('YYYY-MM-DD'),
          // }
          console.log('Received values of form: ', values);
          this.createBuilding(values)
          this.postUserID(this.state.Uid)
  
        }
      });
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
      let houseStyles = []
      data.map((item) => {
          let houseStyle = {}
          houseStyle.id = item.id
          houseStyle.name = item.name
          houseStyles.push(houseStyle)
      })
      this.setState({
        houseStyles
      }, () => {
          this.putAllHouseStylesIntoOptions()
      })
  }

  /**
   * 把所有的角色都放到select的option中
   */
  putAllHouseStylesIntoOptions = () => {
      let optionHouseStyle = []
      this.state.houseStyles.map((item) => {
          let option = {}
          option = <Option key={item.id} value={item.id}>{item.name}</Option>
          optionHouseStyle.push(option)
      })
      this.setState({
        optionHouseStyle
      })
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
  handleChangeTag=(tag, checked) =>{
    const { selectedTags } = this.state;
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedTags: nextSelectedTags });
  }
  render() {
    const { selectedTags } = this.state.selectedTags;
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
        <Form  onSubmit = {this.handleSubmit.bind(this)} style={{marginTop:'10px'}}>
        <Form.Item  {...formItemLayout} label = {'小区名称'} > 
        {getFieldDecorator('communityName', {
            rules: [{
              required: true,
              message: '小区名称!'
            }],
          })(
            <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
             placeholder="请输入楼盘名称" />
            )
          } 
          </Form.Item> <Form.Item label = {'楼栋号'} {...formItemLayout}  > 
          {getFieldDecorator('buildingNumber', {
              rules: [{
                required: true,
                message: '请输入联系方式'
              }],
            })( <Input  prefix = {< Icon type = "lock" style = {{color: 'rgba(0,0,0,.25)'}}/>} 
             placeholder="telephone" />
              )
            } 
            </Form.Item>
            <Form.Item label = {'单元号'} {...formItemLayout}  >
              {getFieldDecorator('unit',{
                  rules: [{
                    required: true,
                    message: '预计价格'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>
            <Form.Item label = {'房间号'} {...formItemLayout} >
              {getFieldDecorator('houseNumbers',{
                  rules: [{
                    required: true,
                    message: '开盘时间'
                  }]
              })(
                <DatePicker />
              )}
            </Form.Item>
            <Form.Item label = {'房间面积'} {...formItemLayout} >
            {getFieldDecorator('houseArea',{
                  rules: [{
                    required: true,
                    message: '交房时间'
                  }]
              })(
                <DatePicker />
              )}
            </Form.Item> 
            <Form.Item label={'户型'}  {...formItemLayout}>
                        {getFieldDecorator('houseStyle', {
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
            {/* <Form.Item label = {'户型'} {...formItemLayout} >
            {getFieldDecorator('houseStyle',{
                  rules: [{
                    required: true,
                    message: '户型'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>  */}
            <Form.Item label = {'朝向'} {...formItemLayout} >
            {getFieldDecorator('oriented',{
                  rules: [{
                    required: true,
                    message: '朝向'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item> 
            <Form.Item label = {'楼层'} {...formItemLayout} >
            {getFieldDecorator('floor',{
                  rules: [{
                    required: true,
                    message: '楼层'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item> 
            <Form.Item label = {'装修'} {...formItemLayout} >
            {getFieldDecorator('decoration',{
                  rules: [{
                    required: true,
                    message: '装修'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>
            <Form.Item label = {'租金'} {...formItemLayout} >
            {getFieldDecorator('rent',{
                  rules: [{
                    required: true,
                    message: '物业公司'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>
            <Form.Item label = {'付款类型'} {...formItemLayout} >
            {getFieldDecorator('paymentType',{
                  rules: [{
                    required: true,
                    message: '付款类型'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>
            <Form.Item label = {'房东名称'} {...formItemLayout} >
            {getFieldDecorator('landlordName',{
                  rules: [{
                    required: true,
                    message: '付款类型'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>

            <Form.Item label = {'房屋描述'} {...formItemLayout} >
            {getFieldDecorator('houseDescription',{
                  rules: [{
                    required: true,
                    message: '付款类型'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>

            <Form.Item label = {'出租要求'} {...formItemLayout} >
            {getFieldDecorator('rentalRequest',{
                  rules: [{
                    required: true,
                    message: '付款类型'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>

            <Form.Item label = {'联系方式'} {...formItemLayout} >
            {getFieldDecorator('contactInformation',{
                  rules: [{
                    required: true,
                    message: '付款类型'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入预计价格" />
              )}
            </Form.Item>



            <Form.Item label = {'联系方式'} {...formItemLayout} >
            {getFieldDecorator('contactInformation',{
                  rules: [{
                    required: true,
                    message: '付款类型'
                  }]
              })(
                <div>
                <h6 style={{ marginRight: 8, display: 'inline' }}>Categories:</h6>
                {tagsFromServer.map((tag,index) => (
                  <CheckableTag
                    key={tag}
                    checked={this.state.selectedTags.indexOf(tag)>-1}
                    onChange={checked => this.handleChangeTag(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </div>
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
                action={`http://localhost:8080/v1/wyw/picture/insertPictures/${this.state.Uid}/${this.state.type}`}
                headers = {
                  {
                    Authorization: this.state.authorization
                  }
                }
                listType = "picture-card"
                fileList = {
                  fileList
                }
                beforeUpload={this.beforeUpload}
  
                onRemove={this.onRemove}
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
      export default Form.create()(RentHouseCreate);
  