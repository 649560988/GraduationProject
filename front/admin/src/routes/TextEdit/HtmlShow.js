import React,{ Component, Fragment} from 'react'
import { isConstructorDeclaration } from 'typescript';
import { Row, Col } from 'antd';
import MyMenu from '../Menu/MyMenu';
import request from '../../utils/request'
class HtmlShow extends Component{
    constructor(props){
        super(props)
        this.state={
            id:this.props.match.params.id,
            data:{
              
            }
        }
    }
    componentWillMount(){
        this.getCurrentArticle()
    }
    getCurrentArticle=()=>{
        let url=`/v1/wyw/article/${this.state.id}`
        request(url,{
            method:'GET'
        }).then((res)=>{
            if(res.message=='查询成功'){
                this.setState({
                    data:res.data
                })
            }
            console.log('接收到的数据',this.state.data)
        })
    }
    render(){
        return(
            <Fragment>
                <MyMenu></MyMenu>
                <div>
                    <h1 style={{textAlign:'center'}}>{this.state.data.title}</h1>
                    <h2 style={{textAlign:'center'}}> 作者：{this.state.data.userName}    发布日期：{this.state.data.createdTime}</h2>
                </div>
                <div style={{width:'100%',height:'800px',marginLeft:'20px',marginRight:'30px'}} dangerouslySetInnerHTML={{__html:this.state.data.content}}></div>
            </Fragment>
        )
    }
}
export default HtmlShow;