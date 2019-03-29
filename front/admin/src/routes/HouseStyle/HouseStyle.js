import React,{ Component } from 'react'
import {Table,Divider} from 'antd'
import TableLayout from '../../layouts/TableLayout'
import request from '../../utils/request'
class HouseStyle extends Component{
    constructor(props){
        super(props)
        this.state={
            columns : [{
                title: '序号',
                dataIndex: 'order',
                align: 'center',
                width: '30%',
            },{
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width:'30%'
              },{
                title: '操作',
                key: 'action',
                render: (text, record) => (
                  <span>
                    <a href="">编辑</a>
                    <Divider type="vertical" />
                    <a href="">删除</a>
                  </span>
                ),
              }],
              data:''
        }
    }
    componentDidMount(){
        this.getAllHouseStyle()
    }
    getAllHouseStyle=()=>{
        let url='/v1/wyw/house-style/selectAll'
        request(url,{
            method: 'GET'
        }).then((res)=>{
            console.log(res)
            if(res.message=='查询成功'){
              this.addToTable(res.data)
            }
        })
    }
    addToTable = (data) => {
        let dataSource = []
        data.map((item, index) => {

                item.order = index + 1
                let record = item
                dataSource.push(record)
        })
        this.setState({
            data: dataSource
        })
    }
    render(){
        return(
       <div>
            <TableLayout
                title={'类别管理'}
            >
           <Table 
           columns={this.state.columns} 
           dataSource={this.state.data} 
           rowKey={'id'}
           size={'middle'}
           />
           </TableLayout>
       </div>
        )
    }
}
export default HouseStyle;