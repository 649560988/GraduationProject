import React,  {Component, Fragment} from 'react'
import { Divider  ,message} from 'antd'
import request from '../../utils/request'
import MyMenu from '../Menu/MyMenu';
import TableLayout from '../../layouts/TableLayout'
import styles from './style.css'
class Article extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            targ:false
        }
    }
    getCurrentRentHouseItem=(item)=>{
        this.linkToChange(`/html-show/${item.id}`)
      }
      linkToChange = url => {
        const { history } = this.props
        history.push(url)
      };
      componentWillMount(){
          this.getArticleList()
      }
      getArticleList=()=>{
          let url='/v1/wyw/article/selectAll'
          request(url,{
              method:'GET'
          }).then((res)=>{
              if(res.message=='成功'){
                  this.setState({
                      data:res.data
                  })
              }
          })
      }
    handleMouseOver=(item)=>{
        // this.setState({
        //     targ:true
        // })
        // message.success(item.id)
    }
   handleMouseOut=(item)=>{
        // this.setState({
        //     targ:false
        // })
        // message.success(item.id)
        // console.log('qqqqqqqqqqqqqq',item.id)
    }
    render(){
        
        return(
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
            <MyMenu></MyMenu>
            <TableLayout
            title={'楼讯'}
        >
                {
                    this.state.data.map((item,index)=>{
                        return <div style={{marginLeft:'20%',marginRight:'20%',marginTop:'5px',border:'1px',borderStyle:'solid'}} >
                        {/* <div  className={this.state.targ?styles.div:styles.div1}onMouseOver={this.handleMouseOver(item)} onMouseOut={this.handleMouseOut(item)} onClick={() => this.getCurrentRentHouseItem(item)}> */}
                        <div onMouseOver={this.handleMouseOver(item)} onMouseOut={this.handleMouseOut(item)} onClick={() => this.getCurrentRentHouseItem(item)}>
                            <h1>{item.title}</h1>
                            <div>
                            <Divider type="vertical" />
                            作者：{item.userName}
                            <Divider type="vertical" />
                            {item.createdTime}
                            </div>
                            <br/>
                            </div>
                        </div>
                    })
                }
                </TableLayout>
            </div>
        )
    }
}
export default Article;