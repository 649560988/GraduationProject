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
    Cascader,
    message,
    Tag,
    InputNumber,
    Tabs 
   
  } from 'antd';
  import request from '../../utils/request'
import TextArea from 'antd/lib/input/TextArea';
import MyMenu from '../Menu/MyMenu';
import Data from '../../City'
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
        rentHouseType:0,
        apartmentType:1,
        selectedTags: [],
        optionHouseStyle:[],
        houseStyles:[],
      }
      this.getAuthorization().then((result)=>{
        this.setState({authorization:result})
      }) 
    }
    componentWillMount() {
      this.getPersonalInfoById();
      this.getAllRoles()
  }
    getPersonalInfoById = () => {
      request('/v1/sysUserDomin/getAuth', {
          method: 'GET',
      }).then((res) => {
          if (res.message === '成功') {
            this.setState({
              Uid:res.data.id,
            })
          } else {
              message.error('获取当前登录人信息失败');
          }
      }).catch((err) => {
          console.log(err)
      })
  }
  /**
   * 
   * 创建普通住房
   */
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let province=values.address[0]
          let city=values.address[1]
          let area=values.address[2]
          values.province=province
          values.city=city
          values.area=area
          this.createRentHouse(values)
          // this.postUserID(this.state.Uid)
        }
      });
    }
    /**
     * 创建公寓
     */
    handleSubmitApartMent = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let province=values.address[0]
          let city=values.address[1]
          let area=values.address[2]
          values.province=province
          values.city=city
          values.area=area
          this.createApartment(values)
          // this.postUserID(this.state.Uid)
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
   * 将所有房屋类型进行筛选留下的id和name的json数据保存在state里的数组roles中
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
    /**
   * 
   * 创建普通住房
   */
    createRentHouse = (values) => {
    console.log('data:', values)
    request(`/v1/wyw/renthouse/createRentHouse/${this.state.Uid}/${this.state.rentHouseType}`, {
      method: 'POST',
      body: values
    }).then((res) => {
      if (res.message === '添加成功') {
        // this.linkToChange('/setting/users')
      } else {
        // message.error(res.message)
        console.log("创建失败")
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  /**
   * 
   * 创建公寓
   */
  createApartment = (values) => {
    console.log('data:', values)
    request(`/v1/wyw/renthouse/createRentHouse/${this.state.Uid}/${this.state.apartmentType}`, {
      method: 'POST',
      body: values
    }).then((res) => {
      if (res.message === '添加成功') {
        // this.linkToChange('/setting/users')
      } else {
        // message.error(res.message)
        console.log("创建失败")
      }
    }).catch((err) => {
      console.log(err)
    })
  }
      /***
     *   路径跳转
     */
    linkToChange = url => {
      const { history } = this.props
      history.push(url)
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
  onChange=(value) => {
    this.setState({
      address:value
    })
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
        <MyMenu></MyMenu>
        <Tabs defaultActiveKey="1">
      {/* 创建出租屋的标签页 */}
        <Tabs.TabPane tab='出租屋' key="1">
        <Form  onSubmit = {this.handleSubmit.bind(this)} style={{marginTop:'10px'}}>
        <Form.Item  {...formItemLayout} label = {'小区地址'} > 
        {getFieldDecorator('address', {
            rules: [{
              required: true,
              message: '小区地址!'
            }],
          })(
            <Cascader style={{width: 300 }}  matchInputWidth options={Data.diagnoseReport} onChange={this.onChange} placeholder="Please select" 
            />
            )
          } 
          </Form.Item> 

        <Form.Item  {...formItemLayout} label = {'小区名称'} > 
        {getFieldDecorator('communityName', {
            rules: [{
              required: true,
              message: '小区名称!'
            }],
          })(
            <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
             placeholder="请输入小区名称" />
            )
          } 
          </Form.Item> 
          <Form.Item label = {'楼栋号'} {...formItemLayout}  > 
          {getFieldDecorator('buildingNumber', {
              rules: [{
                required: true,
                message: '请输入楼栋号'
              }],
            })( <Input  prefix = {< Icon type = "lock" style = {{color: 'rgba(0,0,0,.25)'}}/>} 
             placeholder="请输入楼栋号" />
              )
            } 
            </Form.Item>
            <Form.Item label = {'单元号'} {...formItemLayout}  >
              {getFieldDecorator('unit',{
                  rules: [{
                    required: true,
                    message: '请输入单元号'
                  }]
              })(
                <InputNumber prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入单元号" style={{width:'100%'}}/>
              )}
            </Form.Item>
            <Form.Item label = {'房间号'} {...formItemLayout} >
              {getFieldDecorator('houseNumbers',{
                  rules: [{
                    required: true,
                    message: '请输入房间号'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房间号" />
              )}
            </Form.Item>
            <Form.Item label = {'房间面积'} {...formItemLayout} >
            {getFieldDecorator('houseArea',{
                  rules: [{
                    required: true,
                    message: '房间面积'
                  }]
              })(
                <div style={{display:'inline'}}>
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房间面积"  style={{width:'90%'}}/>
                <label>m^2</label>
                </div>
                
              )}
            </Form.Item> 
            <Form.Item label={'户型'}  {...formItemLayout}>
                        {getFieldDecorator('houseStyle', {
                            rules: [{ required: true, message: '请选择户型' }]
                        })(
                            <Select
                                placeholder={'请选择户型'}
                            >
                                {this.state.optionHouseStyle}
                            </Select>
                        )}
                    </Form.Item>
            <Form.Item label = {'朝向'} {...formItemLayout} >
            {getFieldDecorator('oriented',{
                  rules: [{
                    required: true,
                    message: '请输入朝向'
                  }]
              })(
                <Select
                placeholder={'请选择朝向'}
            >
                <Option value="东">东</Option>
                <Option value="南">南</Option>
                <Option value="西">西</Option>
                <Option value="北">北</Option>
            </Select>
              )}
            </Form.Item> 
            <Form.Item label = {'楼层'} {...formItemLayout} >
            {getFieldDecorator('floor',{
                  rules: [{
                    required: true,
                    message: '请输入楼层'
                  }]
              })(
                <InputNumber prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入楼层" min={300} style={{width:'100%'}}/>
              )}
            </Form.Item> 
            <Form.Item label = {'装修类型'} {...formItemLayout} >
            {getFieldDecorator('decoration',{
                  rules: [{
                    required: true,
                    message: '请选择装修类型'
                  }]
              })(
                <Select
                placeholder={'请选择装修类型'}
            >
                <Option value="精装修">精装修</Option>
                <Option value="简装修">简装修</Option>
                <Option value="豪华装修">豪华装修</Option>
                <Option value="毛坯房">毛坯房</Option>
            </Select>
              )}
            </Form.Item>
            <Form.Item label = {'租金'} {...formItemLayout} >
            {getFieldDecorator('rent',{
                  rules: [{
                    required: true,
                    message: '请输入租金'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入租金" />
              )}
            </Form.Item>
            <Form.Item label = {'付款类型'} {...formItemLayout} >
            {getFieldDecorator('paymentType',{
                  rules: [{
                    required: true,
                    message: '请输入付款类型'
                  }]
              })(
                <Select
                placeholder={'请输入付款类型'}
            >
                <Option value="支付宝">支付宝</Option>
                <Option value="银行卡">银行卡</Option>
                <Option value="微信">微信</Option>
            </Select>
              )}
            </Form.Item>
            <Form.Item label = {'房东名称'} {...formItemLayout} >
            {getFieldDecorator('landlordName',{
                  rules: [{
                    required: true,
                    message: '请输入房东名称'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房东名称" />
              )}
            </Form.Item>

            <Form.Item label = {'出租要求'} {...formItemLayout} >
            {getFieldDecorator('rentalRequest',{
                  rules: [{
                    required: true,
                    message: '请输入出租要求'
                  }]
              })(
                <Select
                placeholder={'请输入出租要求'}
            >
                <Option value="整租">整租</Option>
                <Option value="合租">合租</Option>
            </Select>
              )}
            </Form.Item>

            <Form.Item label = {'联系方式'} {...formItemLayout} >
            {getFieldDecorator('contactInformation',{
                  rules: [{
                    required: true,
                    message: '联系方式'
                  },
                  {
                    pattern: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/,
                    message: '手机号格式错误！'
                  }
                ]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入联系方式" />
              )}
            </Form.Item>



            <Form.Item label = {'配套设施'} {...formItemLayout} >
            {getFieldDecorator('tags',{
                  rules: [{
                    // required: true,
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
    
            <Form.Item label = {'房屋描述'} {...formItemLayout} >
            {getFieldDecorator('houseDescription',{
                  rules: [{
                    required: true,
                    message: '请输入房屋描述'
                  }]
              })(
                <TextArea prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房屋描述" />
              )}
            </Form.Item>

            <Form.Item label = {'请上传图片'} {...formItemLayout} > 
            {getFieldDecorator('file', {
                rules: [{
                  required: true,
                  message: '请上传图片'
                }],
              })( <div >
                <Upload  
                min={2}
                action={`http://localhost:8080/v1/wyw/picture/insertPictures/${this.state.type}`}
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
            发布
            </Button> 
            </Form.Item> 
            </Form> 
        </Tabs.TabPane>

         {/* 创建公寓的标签页 */}
        <Tabs.TabPane tab='公寓' key="2">

        <Form  onSubmit = {this.handleSubmitApartMent.bind(this)} style={{marginTop:'10px'}}>
        <Form.Item  {...formItemLayout} label = {'小区地址'} > 
        {getFieldDecorator('address', {
            rules: [{
              required: true,
              message: '小区地址!'
            }],
          })(
            <Cascader style={{width: 300 }}  matchInputWidth options={Data.diagnoseReport} onChange={this.onChange} placeholder="Please select" 
            />
            )
          } 
          </Form.Item> 

        <Form.Item  {...formItemLayout} label = {'小区名称'} > 
        {getFieldDecorator('communityName', {
            rules: [{
              required: true,
              message: '小区名称!'
            }],
          })(
            <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
             placeholder="请输入小区名称" />
            )
          } 
          </Form.Item> 
          <Form.Item label = {'楼栋号'} {...formItemLayout}  > 
          {getFieldDecorator('buildingNumber', {
              rules: [{
                required: true,
                message: '请输入楼栋号'
              }],
            })( <Input  prefix = {< Icon type = "lock" style = {{color: 'rgba(0,0,0,.25)'}}/>} 
             placeholder="请输入楼栋号" />
              )
            } 
            </Form.Item>
            <Form.Item label = {'单元号'} {...formItemLayout}  >
              {getFieldDecorator('unit',{
                  rules: [{
                    required: true,
                    message: '请输入单元号'
                  }]
              })(
                <InputNumber prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入单元号" style={{width:'100%'}}/>
              )}
            </Form.Item>
            <Form.Item label = {'房间号'} {...formItemLayout} >
              {getFieldDecorator('houseNumbers',{
                  rules: [{
                    required: true,
                    message: '请输入房间号'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房间号" />
              )}
            </Form.Item>
            <Form.Item label = {'房间面积'} {...formItemLayout} >
            {getFieldDecorator('houseArea',{
                  rules: [{
                    required: true,
                    message: '房间面积'
                  }]
              })(
                <div style={{display:'inline'}}>
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房间面积"  style={{width:'90%'}}/>
                <label>m^2</label>
                </div>
                
              )}
            </Form.Item> 
            <Form.Item label={'户型'}  {...formItemLayout}>
                        {getFieldDecorator('houseStyle', {
                            rules: [{ required: true, message: '请选择户型' }]
                        })(
                            <Select
                                placeholder={'请选择户型'}
                            >
                                {this.state.optionHouseStyle}
                            </Select>
                        )}
                    </Form.Item>
            <Form.Item label = {'朝向'} {...formItemLayout} >
            {getFieldDecorator('oriented',{
                  rules: [{
                    required: true,
                    message: '请输入朝向'
                  }]
              })(
                <Select
                placeholder={'请选择朝向'}
            >
                <Option value="东">东</Option>
                <Option value="南">南</Option>
                <Option value="西">西</Option>
                <Option value="北">北</Option>
            </Select>
              )}
            </Form.Item> 
            <Form.Item label = {'楼层'} {...formItemLayout} >
            {getFieldDecorator('floor',{
                  rules: [{
                    required: true,
                    message: '请输入楼层'
                  }]
              })(
                <InputNumber prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入楼层" min={300} style={{width:'100%'}}/>
              )}
            </Form.Item> 
            <Form.Item label = {'装修类型'} {...formItemLayout} >
            {getFieldDecorator('decoration',{
                  rules: [{
                    required: true,
                    message: '请选择装修类型'
                  }]
              })(
                <Select
                placeholder={'请选择装修类型'}
            >
                <Option value="精装修">精装修</Option>
                <Option value="简装修">简装修</Option>
                <Option value="豪华装修">豪华装修</Option>
                <Option value="毛坯房">毛坯房</Option>
            </Select>
              )}
            </Form.Item>
            <Form.Item label = {'租金'} {...formItemLayout} >
            {getFieldDecorator('rent',{
                  rules: [{
                    required: true,
                    message: '请输入租金'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入租金" />
              )}
            </Form.Item>
            <Form.Item label = {'付款类型'} {...formItemLayout} >
            {getFieldDecorator('paymentType',{
                  rules: [{
                    required: true,
                    message: '请输入付款类型'
                  }]
              })(
                <Select
                placeholder={'请输入付款类型'}
            >
                <Option value="支付宝">支付宝</Option>
                <Option value="银行卡">银行卡</Option>
                <Option value="微信">微信</Option>
            </Select>
              )}
            </Form.Item>
            <Form.Item label = {'房东名称'} {...formItemLayout} >
            {getFieldDecorator('landlordName',{
                  rules: [{
                    required: true,
                    message: '请输入房东名称'
                  }]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房东名称" />
              )}
            </Form.Item>

            <Form.Item label = {'出租要求'} {...formItemLayout} >
            {getFieldDecorator('rentalRequest',{
                  rules: [{
                    required: true,
                    message: '请输入出租要求'
                  }]
              })(
                <Select
                placeholder={'请输入出租要求'}
            >
                <Option value="整租">整租</Option>
                <Option value="合租">合租</Option>
            </Select>
              )}
            </Form.Item>

            <Form.Item label = {'联系方式'} {...formItemLayout} >
            {getFieldDecorator('contactInformation',{
                  rules: [{
                    required: true,
                    message: '联系方式'
                  },
                  {
                    pattern: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/,
                    message: '手机号格式错误！'
                  }
                ]
              })(
                <Input prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入联系方式" />
              )}
            </Form.Item>



            <Form.Item label = {'配套设施'} {...formItemLayout} >
            {getFieldDecorator('tags',{
                  rules: [{
                    // required: true,
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
    
            <Form.Item label = {'房屋描述'} {...formItemLayout} >
            {getFieldDecorator('houseDescription',{
                  rules: [{
                    required: true,
                    message: '请输入房屋描述'
                  }]
              })(
                <TextArea prefix = {< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)'} }/>}
                placeholder="请输入房屋描述" />
              )}
            </Form.Item>

            <Form.Item label = {'请上传图片'} {...formItemLayout} > 
            {getFieldDecorator('file', {
                rules: [{
                  required: true,
                  message: '请上传图片'
                }],
              })( <div >
                <Upload  
                min={2}
                action={`http://localhost:8080/v1/wyw/picture/insertPictures/${this.state.type}`}
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
            发布
            </Button> 
            </Form.Item> 
            </Form> 
        </Tabs.TabPane>
        </Tabs>
        
            </div>
          )
        }
      }
      export default Form.create()(RentHouseCreate);
  