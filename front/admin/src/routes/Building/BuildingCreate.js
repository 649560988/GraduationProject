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
  Modal
} from 'antd';
import request from '../../utils/request'
import PictureWall from '../PictureWall/PictureWall'
class BuildingCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      authorization: ''
    }
    this.getAuthorization().then((result)=>{
      this.setState({authorization:result})
    }) 
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
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
//   createPicture = (value) => {
//     // const formData = new FormData();
//     // console.log(value)
//     value.forEach(file => {
//         // formData.append('files',element)
//         // console.log(element)
//         request('/v1/wyw/picture/insertPictures', {
//           method: 'POST',
//           body: {file:file}
//         }).then((res) => {
//           if (res.message === '创建成功') {
//             // message.success('创建成功')
//             console.log("创建成功")
//             // this.linkToChange('/setting/users')
//           } else {
//             // message.error(res.message)
//             console.log("创建失败")
//           }
//         }).catch((err) => {
//           console.log(err)
//         })
      
//     });
// }
createBuilding = (values) => {
  console.log('data:', values)
  request('/v1/wyw/building/createBuilding', {
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
beforeUpload(file) {
  // const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!');
  // }
  // return isJPG && isLt2M;
  var fileArr = [];
  //获取新的上传列表
        fileArr.push(file);
  //进行赋值保存
      //  this.setState(preState => ({
      //    fileList:fileArr,
      //    uploadPath:''
      //  }))
}
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
      <Fragment >
      <Form onSubmit = {this.handleSubmit.bind(this)} >
      <Form.Item  label = {'楼盘名称'} > 
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
        </Form.Item> <Form.Item  > 
        {getFieldDecorator('telephone', {
            rules: [{
              required: true,
              message: 'Please input your telephone!'
            }],
          })( <Input prefix = {< Icon type = "lock"style = {{color: 'rgba(0,0,0,.25)'}}
/>}  placeholder="telephone" />
            )
          } </Form.Item> 
          <Form.Item > {
            getFieldDecorator('file', {
              rules: [{
                required: true,
                message: '请上传图片'
              }],
            })( <div className = "clearfix" >
              <Upload 
              action="http://localhost:8080/v1/wyw/picture/insertPictures"
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
           <Form.Item >
          <Button type = "primary"
          htmlType = "submit" >
          Log in
          </Button> 
          
          </Form.Item> 
          </Form> 

    </Fragment>
        )
      }
    }
    export default Form.create()(BuildingCreate);
