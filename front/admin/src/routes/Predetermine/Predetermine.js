import React,{Component} from 'react'
import request from '../../utils/request';
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
class Predetermine extends Component{
    constructor(props){
        super(props)
        this.state={
            rentHouseId:this.props.match.params.id,
            rentHouse:'',
            user:'',
            rentHouseAdmin:'',
            predetermineRentHouse:{
                userId:'',
                userName:'',
                houseId:'',
                houseName:'',
                type:'',
                rentUserIdL:'',
                rentUserName:'',
                rentTime:'',
                money:''
            }
        }
    }
    componentWillMount(){
        this.getCurrentRentHouse()
    }
     //获取当前出租屋信息
  getCurrentRentHouse=()=>{
    let url=`/v1/wyw/renthouse/${this.state.rentHouseId}`
    request(url,{
			method: "GET"
		}).then((res)=>{
			if(res.message=='查询成功'){
            this.getAdmin(this.state.rentHouse.userId)
			this.setState({
				rentHouse:res.data,
      })
    this.getAdmin(res.data.userId)
			}
		})
  }
  //获取当前房屋主人信息
  getAdmin=(id)=>{
    let url=`/v1/sysuser/${id}`
    request(url, {
      method: 'GET',
  }).then((res) => {
      if (res.message === '成功') {
        console.log('获取当前记录信息',res.data);
        this.setState({
          rentHouseAdmin:res.data
        })
      } else {
        console.log('获取当前登录人信息失败');
      }
  }).catch((err) => {
      console.log(err)
  })
  }
  //获取登陆人信息
  getCurrentUser = () => {
    let url = '/v1/sysUserDomin/getAuth'
    request(url, {
        method: 'GET'
    }).then((res) => {
        if (res.message === '成功') {
            this.setState({
           user:res.data
            })
        } else {
            console.log(err)
        }
    }).catch(() => {})
}
//创建订单

    render(){
        return(
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <MyMenu></MyMenu>
            <TableLayout
            title={'详细信息'}
             >

           </TableLayout>
           </div>
        )
    }
}
export default Predetermine;